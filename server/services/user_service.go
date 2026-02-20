package services

import (
	"chat-app/server/config"
	"chat-app/server/models"
	"chat-app/server/storage"
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo *storage.UserRepository
}

// NewUserService creates a new user service
func NewUserService(repo *storage.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

// CreateUser creates a new user with hashed password
func (s *UserService) CreateUser(ctx context.Context, req *models.SignupRequest) (*models.User, error) {
	// Validate input
	if req.Email == "" || req.Password == "" || req.Username == "" {
		return nil, errors.New("email, username, and password are required")
	}

	// Check if email already exists
	emailExists, err := s.repo.CheckEmailExists(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if emailExists {
		return nil, errors.New("email already exists")
	}

	// Check if username already exists
	usernameExists, err := s.repo.CheckUsernameExists(ctx, req.Username)
	if err != nil {
		return nil, err
	}
	if usernameExists {
		return nil, errors.New("username already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	user := &models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
		Friends:  []string{},
		Groups:   []string{},
		Requests: []models.FriendRequest{},
	}

	err = s.repo.CreateUser(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// AuthenticateUser authenticates a user and returns a JWT token
func (s *UserService) AuthenticateUser(ctx context.Context, req *models.LoginRequest) (*models.AuthResponse, error) {
	// Validate input
	if req.Email == "" || req.Password == "" {
		return nil, errors.New("email and password are required")
	}

	// Find user by email
	user, err := s.repo.FindUserByEmail(ctx, req.Email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Compare passwords
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Generate JWT token
	token, err := s.GenerateToken(user)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	// Update user status to online
	_ = s.repo.UpdateUserStatus(ctx, user.ID.Hex(), "online")

	return &models.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

// GenerateToken generates a JWT token for a user
func (s *UserService) GenerateToken(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  user.ID.Hex(),
		"email":    user.Email,
		"username": user.Username,
		"exp":      time.Now().Add(config.AppConfig.JWTExpiry).Unix(),
		"iat":      time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.AppConfig.JWTSecret))
}

// ValidateToken validates a JWT token and returns the claims
func (s *UserService) ValidateToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(config.AppConfig.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

// GetUserByID retrieves a user by ID
func (s *UserService) GetUserByID(ctx context.Context, userID string) (*models.User, error) {
	return s.repo.FindUserByID(ctx, userID)
}

// UpdateUserStatus updates a user's status
func (s *UserService) UpdateUserStatus(ctx context.Context, userID string, status string) error {
	return s.repo.UpdateUserStatus(ctx, userID, status)
}
