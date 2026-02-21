package services

import (
	"time"
	"fmt"

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

func (s *AuthService) Register(username, email, password string) error {

	// Check if user already exists
	existingUser, err := s.repo.FindByEmail(email)
	if err == nil && existingUser != nil {
		return fmt.Errorf("email already exists")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}

	user := models.User{
		Username:  username,
		Email:     email,
		Password:  string(hash),
		CreatedAt: time.Now(),
	}

	return s.repo.Create(user)
}

func (s *AuthService) Login(email, password string) (string, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", err
	}

	return utils.GenerateToken(user.ID.Hex())
}