import { useEffect } from "react";
import { socketClient } from "./socketClient";

export default function SocketProvider({ children }) {
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            socketClient.connect(token);
        }

        return () => {
            socketClient.disconnect();
        };
    }, []);

    return children;
}