import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../socket/socket";

export default function Chat() {
    const [conversations, setConversations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;

    // load conversations
    useEffect(() => {
        const fetchData = async () => {
            const res = await api.get("/chat/conversations");
            setConversations(res.data);
        };
        fetchData();
    }, []);

    // join room + listen
    useEffect(() => {
        if (!selected) return;

        socket.connect();
        socket.emit("join_conversation", selected.id);

        socket.on("receive_message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => socket.off("receive_message");
    }, [selected]);

    const loadMessages = async (conv) => {
        setSelected(conv);
        const res = await api.get(`/messages/${conv.id}`);
        setMessages(res.data);
    };

    const sendMessage = () => {
        if (!content) return;

        socket.emit("send_message", {
            conversationId: selected.id,
            senderId: userId,
            content,
        });

        setContent("");
    };

    const createConversation = async () => {
        if (!newEmail) return;
        try {
            await api.post("/chat/conversation", { email: newEmail });
            setNewEmail("");
            const res = await api.get("/chat/conversations");
            setConversations(res.data);
        } catch (err) {
            alert(err.response?.data?.message || "Error creating conversation");
        }
    };

    return (
        <div className="h-screen flex">
            {/* sidebar */}
            <div className="w-1/4 border-r p-4">
                <h2 className="font-bold mb-4">Chats</h2>

                <div className="mb-4">
                    <input
                        className="w-full border p-2 rounded mb-2 text-sm"
                        placeholder="Enter email..."
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <button
                        onClick={createConversation}
                        className="w-full bg-blue-500 text-white p-2 rounded text-sm"
                    >
                        New Chat
                    </button>
                </div>

                {conversations.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => loadMessages(c)}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                        {c.user1_username}, {c.user2_username}
                    </div>
                ))}
            </div>

            {/* chat */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((m) => {
                        const isMine = m.sender_id === userId;
                        return (
                            <div key={m.id} className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div className={`p-2 rounded max-w-xs ${isMine ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                                    {m.content}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-3 border-t flex">
                    <input
                        className="flex-1 border p-2"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 text-white px-4 ml-2"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}