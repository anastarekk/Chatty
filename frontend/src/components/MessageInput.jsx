export default function MessageInput({ value, onChange, onSend }) {
    return (
        <div className="p-3 border-t flex bg-white">
            <input
                className="flex-1 border p-2 rounded"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type a message..."
            />

            <button
                onClick={onSend}
                className="ml-2 bg-blue-500 text-white px-4 rounded"
            >
                Send
            </button>
        </div>
    );
}