package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"

	"github.com/Shivambhandary75/CHAT-APPLICATION/server/services"
	"github.com/Shivambhandary75/CHAT-APPLICATION/server/ws"
)

type WSController struct {
	hub       *ws.Hub
	wsService *services.WSService
}

func NewWSController(hub *ws.Hub, wsService *services.WSService) *WSController {
	return &WSController{
		hub:       hub,
		wsService: wsService,
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (w *WSController) Handle(c *gin.Context) {

	userID := c.GetString("user_id")

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	client := &ws.Client{
		UserID: userID,
		Conn:   conn,
		Send:   make(chan []byte),
	}

	w.hub.Register <- client

go client.WritePump()

	go func() {
		defer func() {
			w.hub.Unregister <- client
			conn.Close()
		}()

		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				break
			}

			w.wsService.HandleMessage(userID, message)
		}
	}()
}