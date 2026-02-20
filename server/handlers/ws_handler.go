package handlers

import (
	"chat-app/server/websocket"
	"log"
	"net/http"

	gorillaws "github.com/gorilla/websocket"
)

var upgrader = gorillaws.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for development
	},
}

type WSHandler struct {
	Hub *websocket.Hub
}

func NewWSHandler(hub *websocket.Hub) *WSHandler {
	return &WSHandler{
		Hub: hub,
	}
}

func (h *WSHandler) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}

	// Get user info from query params or headers
	userID := r.URL.Query().Get("user_id")
	username := r.URL.Query().Get("username")
	roomID := r.URL.Query().Get("room_id")

	if userID == "" || roomID == "" {
		log.Println("Missing user_id or room_id")
		conn.Close()
		return
	}

	client := &websocket.Client{
		Hub:      h.Hub,
		Conn:     conn,
		Send:     make(chan []byte, 256),
		UserID:   userID,
		Username: username,
		RoomID:   roomID,
	}

	h.Hub.Register <- client

	go client.WritePump()
	go client.ReadPump()
}
