package services

import (
	"fmt"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/utils"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo *repositories.AuthRepository
}

func NewAuthService(repo *repositories.AuthRepository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) Register(username, displayName, email, password string) error {

	// Check existing email
	existingEmail, _ := s.repo.FindByEmail(email)
	if existingEmail != nil {
		return fmt.Errorf("email already exists")
	}

	// Check existing username
	existingUsername, _ := s.repo.FindByUsername(username)
	if existingUsername != nil {
		return fmt.Errorf("username already exists")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}

	user := models.User{
		Username:    username,
		DisplayName: displayName,
		Email:       email,
		Password:    string(hash),
		CreatedAt:   time.Now(),
	}

	return s.repo.Create(user)
}

func (s *AuthService) Login(email, password string) (string, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", fmt.Errorf("invalid credentials")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", fmt.Errorf("invalid credentials")
	}

	return utils.GenerateToken(user.ID.Hex())
}

func (s *AuthService) GetProfile(userID string) (*models.User, error) {
	return s.repo.FindByID(userID)
}

func (s *AuthService) UpdateProfile(userID string, displayName string) error {
	if displayName == "" {
		return fmt.Errorf("display name cannot be empty")
	}
	return s.repo.UpdateDisplayName(userID, displayName)
}
