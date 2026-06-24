export default function Sidebar({ conversations, onSelect }) {
    return (
        <div className="w-1/4 bg-white border-r p-4">
            <h2 className="font-bold mb-4">Chats</h2>

            {conversations.map((c) => (
                <div
                    key={c.id}
                    onClick={() => onSelect(c)}
                    className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                >
                    Chat {c.id.slice(0, 6)}
                </div>
            ))}
        </div>
    );
}