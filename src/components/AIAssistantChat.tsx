import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, BrainCircuit, Bot } from 'lucide-react';
import { ChatMessage, Budget, Transaction } from '../types';

interface AIAssistantChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  budgets: Budget[];
  incomeTotal: number;
  expensesTotal: number;
}

export default function AIAssistantChat({ 
  messages, 
  onSendMessage, 
  budgets, 
  incomeTotal, 
  expensesTotal 
}: AIAssistantChatProps) {
  const [inputText, setInputText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const samplePrompts = [
    "Why is my Food budget At Risk?",
    "How can I lock in $140/mo savings?",
    "Analyze my subscription costs"
  ];

  return (
    <div className="bg-[#ffffff] border border-[#d6c3b6] rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px] lg:h-full">
      {/* Bot Header info */}
      <div className="px-5 py-4 bg-[#dae4c1] border-b border-[#d6c3b6] flex justify-between items-center bg-radial from-[#dae4c1] to-[#c1cba9]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#596246] flex items-center justify-center text-[#fff9e8]">
            <Bot className="w-5.5 h-5.5" />
          </div>
          <div>
            <h4 id="finsight-ai-status" className="font-display text-sm font-bold text-[#161e08]">FinSight AI</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping"></span>
              <span className="text-[10px] font-sans text-[#414a30] font-semibold uppercase tracking-wider">Online Co-Pilot</span>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xs border border-[#596246]/10 rounded-full px-2.5 py-0.5 text-[9px] font-bold text-[#596246] flex items-center gap-1 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-[#804e22]" /> Gemini Pro
        </div>
      </div>

      {/* Message Feed list */}
      <div ref={containerRef} className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-[#faf3e0]/30">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[85%] ${
                isAI ? 'mr-auto items-start' : 'ml-auto items-end text-right'
              }`}
            >
              <div 
                className={`p-3 rounded-xl shadow-xs ${
                  isAI 
                    ? 'bg-white text-[#1e1c10] rounded-tl-none border border-[#d6c3b6] text-sm' 
                    : 'bg-[#596246] text-white rounded-tr-none text-sm'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</p>
              </div>
              <span className="text-[9px] text-[#847469] font-semibold mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}
      </div>

      {/* Suggested Quick Buttons */}
      <div className="px-4 py-2 border-t border-[#eee8d5] bg-[#ffffff] flex flex-wrap gap-1.5 scroll-x">
        {samplePrompts.map((promptText, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(promptText)}
            className="text-[11px] font-sans font-medium text-[#804e22] hover:text-[#fff9e8] bg-[#f4eedb] hover:bg-[#804e22] border border-[#d6c3b6] rounded-full px-3 py-1 transition-all cursor-pointer shadow-2xs"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Messages Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[#d6c3b6] bg-white flex gap-2">
        <input 
          type="text" 
          placeholder="Ask AI about your finances..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-[#faf3e0]/50 border border-[#d6c3b6] focus:border-[#804e22] rounded-xl outline-hidden focus:ring-1 focus:ring-[#804e22] text-sm font-sans placeholder-[#847469] text-[#1e1c10]"
        />
        <button 
          type="submit" 
          className="bg-[#804e22] text-white p-2.5 rounded-xl hover:bg-[#9d6638] transition-all cursor-pointer flex items-center justify-center select-none shadow-xs active:scale-95"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
}
