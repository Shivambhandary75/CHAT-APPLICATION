import { useState } from "react";
import { socketClient } from "../../../../core/socket/socketClient";

export default function MessageInput({
    conversationId
}) {
    const [text, setText] = useState("");

    const send = () => {

        if (!text.trim()) {
            return;
        }
        socketClient.send({
            conversation_id: conversationId,
            content: text
        });

        setText("");
    };

    return (
        <div
            style={{
                padding: 16,
                borderTop: "1px solid #eee",
                display: "flex"
            }}
        >
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ flex: 1 }}
            />
            <button onClick={send}>Send</button>
        </div>
    );
}