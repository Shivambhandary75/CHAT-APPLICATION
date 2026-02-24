package services

import (
	"context"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
)

type AppStats struct {
	Users    int64 `json:"users"`
	Messages int64 `json:"messages"`
	Groups   int64 `json:"groups"`
}

type StatsService struct {
	repo *repositories.StatsRepository
}

func NewStatsService(repo *repositories.StatsRepository) *StatsService {
	return &StatsService{repo: repo}
}

func (s *StatsService) GetAppStats(ctx context.Context) (*AppStats, error) {
	users, err := s.repo.GetTotalUsers(ctx)
	if err != nil {
		return nil, err
	}
	messages, err := s.repo.GetTotalMessages(ctx)
	if err != nil {
		return nil, err
	}
	groups, err := s.repo.GetTotalGroups(ctx)
	if err != nil {
		return nil, err
	}

	return &AppStats{
		Users:    users,
		Messages: messages,
		Groups:   groups,
	}, nil
}
