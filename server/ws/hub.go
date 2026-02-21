package ws

type Hub struct {
	Clients    map[string]*Client
	Register   chan *Client
	Unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[string]*Client),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client.UserID] = client

		case client := <-h.Unregister:
			delete(h.Clients, client.UserID)
			close(client.Send)
		}
	}
}

func (h *Hub) SendToUser(userID string, message []byte) {
	if client, ok := h.Clients[userID]; ok {
		client.Send <- message
	}
}