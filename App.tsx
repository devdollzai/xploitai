
import React, { useState, useEffect, useRef } from 'react';
import { Message, Role } from './types';
import { CONVERSATION_HISTORY } from './constants';
import { streamChat } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import InputBar from './components/InputBar';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(CONVERSATION_HISTORY);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: Role.USER,
      parts: [{ text }],
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const modelResponsePlaceholder: Message = {
      role: Role.MODEL,
      parts: [{ text: '' }],
    };
    setMessages(prev => [...prev, modelResponsePlaceholder]);

    let fullResponse = '';
    try {
        for await (const chunk of streamChat(newMessages)) {
            fullResponse += chunk;
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: Role.MODEL, parts: [{ text: fullResponse }] };
                return updated;
            });
        }
    } catch (error) {
        setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: Role.MODEL, parts: [{ text: "Error: Could not get response." }] };
            return updated;
        })
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 flex flex-col h-screen text-gray-200 font-mono">
       <header className="bg-black/30 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-4">
        <h1 className="text-2xl font-bold text-cyan-400 text-center tracking-widest">
          AURA PRAXIS v3.1
        </h1>
      </header>
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
             <div className="flex items-center space-x-2 animate-pulse pl-16">
                <div className="w-10 h-10 border-2 border-cyan-400/50 rounded-full flex-shrink-0"></div>
                <div className="text-cyan-400">Aura is thinking...</div>
            </div>
        )}
      </main>
      <div className="p-4 bg-black/30 border-t border-cyan-500/30">
        <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
