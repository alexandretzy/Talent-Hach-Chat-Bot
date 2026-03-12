import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { AiOutlineSend } from "react-icons/ai";

export default function ChatBot() {
    const [userQuery, setUserQuery] = useState(''); // User input
    const [messages, setMessages] = useState([]); // Chat history (user and bot messages)
    const [loading, setLoading] = useState(false); // Loading state for waiting response
    const [openChatBot, setOpenChatBot] = useState(false); // To open/close the chat

    // Send Message to Webhook
    const sendMessageToWebhook = async () => {
        if (!userQuery) return; // Do nothing if input is empty

        // Add user question to messages array
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'applicant', question: userQuery, answer: '' }
        ]);

        setLoading(true); // Show loading animation

        try {
            const response = await fetch('https://gonfrecs.app.n8n.cloud/webhook-test/talent-hatch-chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_query: userQuery }),
            });

            // Check if the response is valid and JSON parsable
            if (!response.ok) {
                throw new Error('Failed to fetch data from n8n');
            }

            const data = await response.json();

            // Check if the response has an 'output' field and handle accordingly
            if (data && data[0] && data[0].output) {
                // Format the response by replacing '\n' with <br /> for line breaks in HTML
                const formattedAnswer = data[0].output.replace(/\n/g, '<br />');

                // Add AI response to messages array
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'ai', question: userQuery, answer: formattedAnswer }
                ]);
            } else {
                // Handle empty or invalid response
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: 'ai', question: userQuery, answer: "Sorry, I couldn't process your request." }
                ]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'ai', question: userQuery, answer: "Sorry, I couldn't process your request." }
            ]);
        } finally {
            setLoading(false); // Hide loading animation
            setUserQuery(''); // Clear the input field
        }
    };

    const toggleChatBot = () => {
        setOpenChatBot((active) => !active); // Toggle chatbot visibility
    };

    const clearChatHistory = () => {
        setMessages([]); // Clear all chat history
    };

    return (
        <div className="w-full h-full">
            {/* Button to open/close chatbot */}
            {openChatBot ? (
                <div className="w-[350px] bg-slate-300 rounded-lg drop-shadow fixed bottom-4 right-4 z-10">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-cyan-700 px-1 py-2">
                        <div className="flex items-center">
                            <img src="logo.png" alt="Talent Hatch Logo" className="object-contain w-fit h-8" />
                            <h6 className="text-sm text-white font-bold">Talent Hatch AI Assistant</h6>
                        </div>
                        <button
                            className="text-white hover:text-slate-200 text-3xl pr-2 cursor-pointer"
                            onClick={toggleChatBot}
                        >
                            ✖️
                        </button>
                    </div>

                    {/* Chat History */}
                    <div className="h-[350px] space-y-4 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.sender === 'applicant' ? 'text-left' : 'text-right'}>
                                <div className={`p-2 rounded-lg ${msg.sender === 'applicant' ? 'bg-gray-100' : 'bg-blue-200'}`}>
                                    <strong>{msg.sender === 'applicant' ? 'You' : 'AI'}</strong>
                                    <p>{msg.question}</p>
                                    {/* Use dangerouslySetInnerHTML to display HTML (line breaks) in response */}
                                    {msg.answer && <p><strong>Answer: </strong><span dangerouslySetInnerHTML={{ __html: msg.answer }} /></p>}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="text-center">
                                <span className="animate-pulse">...</span> {/* Loading dots */}
                            </div>
                        )}
                    </div>

                    {/* Message Input and Send Button */}
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-3">
                        <Input
                            className="border border-slate-700 focus:border-cyan-500 focus:ring-0 focus-visible:ring-0"
                            placeholder="Type your message here..."
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                        />
                        <Button onClick={sendMessageToWebhook}>
                            <AiOutlineSend /> Send
                        </Button>
                    </div>

                    {/* Button to Clear Chat */}
                    <div className="text-center">
                        <Button onClick={clearChatHistory}>Clear Chat</Button>
                    </div>
                </div>
            ) : (
                <button
                    className="text-6xl text-white bg-cyan-500 rounded-full shadow-lg p-4 fixed bottom-4 right-4 z-20 cursor-pointer animate-bounce"
                    onClick={toggleChatBot}
                >
                    🤖
                </button>
            )}
        </div>
    );
};