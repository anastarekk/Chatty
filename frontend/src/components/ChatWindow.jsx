import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MessageInput from "./MessageInput";

export default function ChatWindow({ messages, onSend, selected }) {
    const [text, setText] = useState("");
    const { user } = useContext(AuthContext);

    const handleSend = () => {
        if (!text) return;
        onSend(text);
        setText("");
    };

    return (
        <div className="flex flex-col flex-1 bg-gray-50">

            {/* messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">

                {selected ? (
                    messages.map((m) => {
                        const isMine = m.sender_id === user.id;

                        return (
                            <div
                                key={m.id}
                                className={`flex ${isMine ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow
                                    ${isMine
                                            ? "bg-blue-500 text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                        }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-gray-500 text-center mt-10">
                        Select a chat to start messaging
                    </div>
                )}
            </div>

            {/* input */}
            <MessageInput
                value={text}
                onChange={setText}
                onSend={handleSend}
            />
        </div>
    );
}