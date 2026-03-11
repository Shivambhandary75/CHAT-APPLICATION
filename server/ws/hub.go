package ws

type Hub struct {
	Clients map[string]map[*Client]bool

	Register   chan *Client
	Unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[string]map[*Client]bool),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {

		case client := <-h.Register:
			isNew := false
			if len(h.Clients[client.UserID]) == 0 {
				isNew = true
			}

			if h.Clients[client.UserID] == nil {
				h.Clients[client.UserID] = make(map[*Client]bool)
			}
			h.Clients[client.UserID][client] = true

			if isNew {
				// broadcast user is online
				msg := `{"type":"online_status","user_id":"` + client.UserID + `","is_online":true}`
				go h.BroadcastToAll([]byte(msg))
			}

            // Tell the new client about EVERYONE ELSE who is online
            for otherUserID := range h.Clients {
                if otherUserID != client.UserID {
                    msg := `{"type":"online_status","user_id":"` + otherUserID + `","is_online":true}`
                    // We only need to send it down one of the connections of the new user
                    client.Send <- []byte(msg)
                }
            }

		case client := <-h.Unregister:

			if clients, ok := h.Clients[client.UserID]; ok {

				if _, exists := clients[client]; exists {
					delete(clients, client)
					close(client.Send)
				}

				if len(clients) == 0 {
					delete(h.Clients, client.UserID)
					// broadcast user is offline
					msg := `{"type":"online_status","user_id":"` + client.UserID + `","is_online":false}`
					go h.BroadcastToAll([]byte(msg))
				}
			}
		}
	}
}

func (h *Hub) BroadcastToAll(message []byte) {
	for _, clients := range h.Clients {
		for client := range clients {
			select {
			case client.Send <- message:
			default:
				close(client.Send)
				delete(clients, client)
			}
		}
	}
}

func (h *Hub) SendToUser(userID string, message []byte) {

	if clients, ok := h.Clients[userID]; ok {

		for client := range clients {

			select {
			case client.Send <- message:
			default:
				close(client.Send)
				delete(clients, client)
			}
		}
	}
}