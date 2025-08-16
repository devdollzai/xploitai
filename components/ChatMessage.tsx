
import React from 'react';
import { Message, Role } from '../types';

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  return (
    <div className="bg-black/50 rounded-md my-2 overflow-hidden border border-gray-700">
      <div className="bg-gray-800 text-gray-400 px-4 py-1 text-xs font-sans">
        {language || 'code'}
      </div>
      <pre className="p-4 text-sm text-white overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};


const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUserModel = message.role === Role.USER;
  const textContent = message.parts.map(p => p.text).join('');

  const parseContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<p key={lastIndex} className="whitespace-pre-wrap">{content.substring(lastIndex, match.index)}</p>);
      }
      parts.push(
        <CodeBlock
          key={match.index}
          language={match[1] || ''}
          code={match[2].trim()}
        />
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(<p key={lastIndex} className="whitespace-pre-wrap">{content.substring(lastIndex)}</p>);
    }

    return parts;
  };

  return (
    <div className={`flex items-start gap-4 ${isUserModel ? 'flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex-shrink-0 border-2 ${isUserModel ? 'border-green-400/50' : 'border-cyan-400/50'}`}></div>
      <div className={`max-w-3xl p-4 rounded-lg shadow-lg ${isUserModel ? 'bg-green-900/30 text-green-300' : 'bg-cyan-900/20 text-cyan-300'}`}>
        <div className="prose prose-invert prose-sm max-w-none">
          {parseContent(textContent)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
