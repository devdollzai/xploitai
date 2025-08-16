
import React, { useState } from 'react';

interface InputBarProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="AWAITING AXIOM..."
        disabled={isLoading}
        className="flex-1 bg-gray-800/50 border border-cyan-500/30 rounded-full px-6 py-3 text-cyan-300 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-800/50 disabled:cursor-not-allowed text-black font-bold rounded-full h-12 w-12 flex items-center justify-center transition-all duration-300 shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-400/40"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        )}
      </button>
    </form>
  );
};

export default InputBar;
