class SocketClient {
    constructor() {
        this.socket = null;
        this.listeners = {};
        this.connected = false;
    }

    connect(token) {
        if (this.socket) {
            return;
        }

        this.socket = new WebSocket(
            `${import.meta.env.VITE_WS_URL || "ws://localhost:8080"}/ws?token=${token}`
        );

        this.socket.onopen = () => {
            this.connected = true;
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.emit("message", data);
        };

        this.socket.onclose = () => {
            this.connected = false;
            this.socket = null;
        };
    }
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        const handlers = this.listeners[event] || [];
        handlers.forEach((cb) => cb(data));
    }

    send(data) {
        if (!this.socket) {
            return;
        }

        if (this.socket.readyState !== WebSocket.OPEN) {
            return;
        }

        this.socket.send(JSON.stringify(data));
    }

    disconnect() {
        this.socket?.close();
    }
}

export const socketClient = new SocketClient();