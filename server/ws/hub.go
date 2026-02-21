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

			if h.Clients[client.UserID] == nil {
				h.Clients[client.UserID] = make(map[*Client]bool)
			}

			h.Clients[client.UserID][client] = true

		case client := <-h.Unregister:

			if clients, ok := h.Clients[client.UserID]; ok {

				if _, exists := clients[client]; exists {
					delete(clients, client)
					close(client.Send)
				}

				if len(clients) == 0 {
					delete(h.Clients, client.UserID)
				}
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