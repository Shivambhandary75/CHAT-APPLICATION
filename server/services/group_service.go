package services

import (
	"fmt"
	"time"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/models"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/repositories"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type GroupService struct {
	repo        *repositories.GroupRepository
	authRepo    *repositories.AuthRepository
	convService *ConversationService
}

func NewGroupService(repo *repositories.GroupRepository, authRepo *repositories.AuthRepository, convService *ConversationService) *GroupService {
	return &GroupService{repo: repo, authRepo: authRepo, convService: convService}
}

func (s *GroupService) CreateGroup(creatorID, name, description, avatarColor string, memberIDs []string) (*models.Group, error) {
	if name == "" {
		return nil, fmt.Errorf("group name is required")
	}

	// deduplicate and always include creator
	seen := map[string]bool{creatorID: true}
	members := []string{creatorID}
	for _, id := range memberIDs {
		if !seen[id] {
			seen[id] = true
			members = append(members, id)
		}
	}

	g := models.Group{
		Name:        name,
		Description: description,
		AvatarColor: avatarColor,
		Members:     members,
		CreatedBy:   creatorID,
		CreatedAt:   time.Now(),
	}

	return s.repo.Create(g)
}

func (s *GroupService) GetGroupConversation(groupID string) (*models.Conversation, error) {
	group, err := s.repo.FindByID(groupID)
	if err != nil {
		return nil, err
	}
	return s.convService.GetOrCreateGroupConversation(groupID, group.Name, group.Members)
}

func (s *GroupService) GetUserGroups(userID string) ([]models.Group, error) {
	return s.repo.FindByMember(userID)
}

func (s *GroupService) GetGroupByID(groupID string) (*models.Group, error) {
	return s.repo.FindByID(groupID)
}

func (s *GroupService) UpdateGroup(groupID, name, description, photo, avatarColor string, memberIDs []string) (*models.Group, error) {
	update := bson.M{}
	if name != "" {
		update["name"] = name
	}
	update["description"] = description
	if photo != "" {
		update["photo"] = photo
	}
	if avatarColor != "" {
		update["avatar_color"] = avatarColor
	}
	if memberIDs != nil {
		update["members"] = memberIDs
	}
	group, err := s.repo.Update(groupID, update)
	if err != nil {
		return nil, err
	}
	// Sync conversation participants whenever group members change.
	if memberIDs != nil {
		conv, convErr := s.convService.GetOrCreateGroupConversation(groupID, group.Name, group.Members)
		if convErr == nil && conv != nil {
			s.convService.UpdateConversationParticipants(conv.ID.Hex(), group.Members)
		}
	}
	return group, nil
}

func (s *GroupService) LeaveGroup(groupID, userID string) error {
	err := s.repo.RemoveMember(groupID, userID)
	if err != nil {
		return err
	}
	// Sync conversation participants
	group, err := s.repo.FindByID(groupID)
	if err == nil && group != nil {
		conv, convErr := s.convService.GetOrCreateGroupConversation(groupID, group.Name, group.Members)
		if convErr == nil && conv != nil {
			s.convService.UpdateConversationParticipants(conv.ID.Hex(), group.Members)
		}
	}
	return nil
}

func (s *GroupService) GetGroupMembers(groupID string) ([]models.FriendResponse, error) {
	group, err := s.repo.FindByID(groupID)
	if err != nil {
		return nil, err
	}

	users, err := s.authRepo.FindUsersByIDs(group.Members)
	if err != nil {
		return nil, err
	}

	result := make([]models.FriendResponse, 0, len(users))
	for _, u := range users {
		result = append(result, models.FriendResponse{
			ID:          u.ID.Hex(),
			Username:    u.Username,
			DisplayName: u.DisplayName,
			Email:       u.Email,
			PhotoURL:    u.PhotoURL,
		})
	}
	return result, nil
}
