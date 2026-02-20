package websocket

type Message struct {
	RoomID  string
	UserID  string
	Content []byte
}

type Hub struct {
	Rooms      map[string]*Room
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan *Message
}

func NewHub() *Hub {
	return &Hub{
		Rooms:      make(map[string]*Room),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan *Message),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			room, ok := h.Rooms[client.RoomID]
			if !ok {
				room = &Room{
					ID:      client.RoomID,
					Clients: make(map[*Client]bool),
				}
				h.Rooms[client.RoomID] = room
			}
			room.Clients[client] = true

		case client := <-h.Unregister:
			if room, ok := h.Rooms[client.RoomID]; ok {
				if _, ok := room.Clients[client]; ok {
					delete(room.Clients, client)
					close(client.Send)

					if len(room.Clients) == 0 {
						delete(h.Rooms, client.RoomID)
					}
				}
			}

		case message := <-h.Broadcast:
			if room, ok := h.Rooms[message.RoomID]; ok {
				for client := range room.Clients {
					select {
					case client.Send <- message.Content:
					default:
						close(client.Send)
						delete(room.Clients, client)
					}
				}
			}
		}
	}
}
