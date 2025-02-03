import { useState } from "react";

const PYPopupBox = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [items, setItems] = useState([
        { id: "watch-later", label: "Watch Later", checked: false },
        { id: "code", label: "code", checked: false },
        { id: "vibe", label: "vibe", checked: false },
        { id: "fall", label: "Fall", checked: false },
        { id: "motivation", label: "motivation", checked: false },
        { id: "food", label: "food", checked: false },
        { id: "fav", label: "Fav", checked: false },
        { id: "feel", label: "feel", checked: false },
    ]);

    const toggleItem = (id) => {
        setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    };

    return (
        <div className="h-1/5 bg-gray-900 flex items-center justify-center">
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-gray-800 rounded-lg  overflow-hidden shadow-xl transform transition-all duration-300 scale-100">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h2 className="text-lg font-semibold text-white">Save video to...</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <div className="">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center space-x-3 px-3 hover:bg-gray-700/50 rounded-lg transition-colors"
                                >
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            id={item.id}
                                            checked={item.checked}
                                            onChange={() => toggleItem(item.id)}
                                            className="w-4 h-4 opacity-0 absolute"
                                        />
                                        <div
                                            className={`w-4 h-4 border ${item.checked ? "bg-white border-white" : "border-gray-600"} rounded flex items-center justify-center`}
                                        >
                                            {item.checked && (
                                                <svg className="w-3 h-3 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <label htmlFor={item.id} className="text-sm font-medium text-white cursor-pointer">
                                        {item.label}
                                    </label>
                                    <div className="ml-auto">
                                        <button className="h-8 w-8 text-gray-400 hover:text-white transition-colors">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-4 w-4"
                                            >
                                                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                                                <path d="M9 12h6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-700">
                            <button
                                className="w-full bg-white text-gray-900 hover:bg-gray-200 py-2 px-4 rounded flex items-center justify-center transition-colors"
                                onClick={() => {
                                    // Handle new playlist creation
                                    console.log("Create new playlist");
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5 mr-2"
                                >
                                    <path d="M12 5v14" />
                                    <path d="M5 12h14" />
                                </svg>
                                New playlist
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PYPopupBox;
