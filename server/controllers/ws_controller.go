package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/realtime"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/utils"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type WSController struct {
	hub                 *realtime.Hub
	messageService      *services.MessageService
	conversationService *services.ConversationService
}

func NewWSController(
	hub *realtime.Hub,
	messageService *services.MessageService,
	conversationService *services.ConversationService,
) *WSController {
	return &WSController{
		hub: hub,
		messageService: messageService,
		conversationService: conversationService,
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (w *WSController) Handle(c *gin.Context) {

	token := c.Query("token")

	userID, err := utils.ParseToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	client := realtime.NewClient(conn)
	w.hub.Register(userID, client)

	go client.WritePump()

	client.ReadPump(func(message []byte) {

		var payload struct {
			ConversationID string `json:"conversation_id"`
			Content        string `json:"content"`
		}

		if err := json.Unmarshal(message, &payload); err != nil {
			return
		}

		// Save message (includes membership validation)
		err := w.messageService.SendMessage(
			payload.ConversationID,
			userID,
			payload.Content,
		)
		if err != nil {
			return
		}

		participants, err := w.conversationService.
			GetParticipants(payload.ConversationID)
		if err != nil {
			return
		}

		// Send to both users
		for _, p := range participants {
			w.hub.SendToUser(p, message)
		}
	})

	w.hub.Unregister(userID, client)
}