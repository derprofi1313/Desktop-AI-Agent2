import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function ChatInterface({ messages, onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl flex flex-col h-[400px]">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Agenten-Konsole</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'agent' && <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0 flex items-center justify-center"><Bot size={20} /></div>}
              <div className={`p-3 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
               {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center"><User size={20} /></div>}
            </div>
          ))}
           {isLoading && (
              <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-cyan-500 flex-shrink-0 flex items-center justify-center"><Bot size={20} /></div>
                 <div className="p-3 rounded-lg bg-gray-700 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16}/>
                    <span className="text-sm italic">denkt nach...</span>
                 </div>
              </div>
           )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-gray-700 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Anweisung an den Agenten..."
          className="flex-1 bg-gray-900 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          disabled={isLoading}
        />
        <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded-lg disabled:bg-gray-500" disabled={isLoading}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
