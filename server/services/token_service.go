package services

import "github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"

type TokenService struct {
	repo *repositories.TokenRepository
}

func NewTokenService(repo *repositories.TokenRepository) *TokenService {
	return &TokenService{repo: repo}
}

func (s *TokenService) Revoke(token string) error {
	return s.repo.Revoke(token)
}

func (s *TokenService) IsRevoked(token string) (bool, error) {
	return s.repo.IsRevoked(token)
}