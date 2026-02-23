import ConversationList from "./ConversationList";

export default function Sidebar() {
    return (
        <div
            style={{
                width: "320px",
                height: "100vh",
                borderRight: "1px solid #e5e5e5",
                display: "flex",
                flexDirection: "column",
                background: "#f8f9fa"
            }}
        >
            <div
                style={{
                    padding: "20px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    borderBottom: "1px solid #e5e5e5"
                }}
            >
                Conversations
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
                <ConversationList />
            </div>
        </div>
    );
}