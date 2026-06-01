/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, Heart, User, Loader2, MessageSquare, Coffee, Check } from 'lucide-react';

export function ParentAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Warm greetings, dear parent! I am Rayiza, a mother and traditional recipe keeper. I know how precious a milestone starting solids is. Ask me anything about Sprouted Ragi, banana powder, ABC mix, or how to feed your sweet 6-to-24 month bundle! How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quick reply prompt cards
  const SUGGESTIONS = [
    "What is special about Sprouted Ragi Digestability?",
    "Is raw banana powder safe for 6-month-old infants?",
    "How does ABC Powder help active immunity?",
    "Mixed Kurukku feeding steps for weight gain?"
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const chatPayload = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatPayload })
      });

      if (!res.ok) {
        throw new Error();
      }

      const responseData = await res.json();
      
      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: responseData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'system',
        text: "I apologizs, dear. It seems our local kitchen connection is busy cooking. Let me give you a quick reassuring tip: Sprouted Ragi Powder is extremely easy to digest, and Natural Banana holds massive play energy. Try asking again in a moment, dear parent!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 rounded-3xl p-6 md:p-8 organic-card-shadow border border-brand-sage/20 id-advisor-section min-h-[500px] flex flex-col justify-between">
      
      {/* Header info */}
      <div className="pb-4 border-b border-brand-sage/10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-display font-semibold border-2 border-brand-cream shadow-sm relative shrink-0">
            R
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-brand-primary text-sm tracking-wide">Rayiza's AI Parenting Assistant</h4>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Warm traditional counselor active
            </p>
          </div>
        </div>

        <span className="text-[9px] bg-brand-primary/10 text-brand-primary font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          FSSAI Confirmed Safe
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 max-h-[290px] overflow-y-auto pr-2 space-y-4 mb-4 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            id={`chat-${msg.id}`}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            } animate-fade-in`}
          >
            {/* Avatar annotation */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
              msg.sender === 'user' 
                ? 'bg-brand-accent/20 border-brand-accent/20 text-brand-accent' 
                : msg.sender === 'system'
                ? 'bg-amber-100 border-amber-200 text-amber-700'
                : 'bg-brand-sage/10 border-brand-sage/20 text-brand-primary'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Heart className="w-4 h-4 text-brand-primary" />}
            </div>

            {/* Bubble layout */}
            <div>
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-primary text-white font-medium rounded-tr-none'
                  : msg.sender === 'system'
                  ? 'bg-amber-50 text-amber-900 border border-amber-100'
                  : 'bg-brand-cream/80 text-gray-800 font-medium rounded-tl-none border border-brand-sage/5 shadow-sm'
              }`}>
                {msg.text}
              </div>
              <span className={`text-[9px] text-[#888888] mt-1 block px-1 text-right ${
                msg.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 items-center text-gray-500 text-[11px] italic pl-10">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" /> Rayiza is preparing loving advice...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions cards */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-[10px] uppercase font-bold text-[#666666] mb-2 tracking-wider">Tap a quick maternal advice prompt:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                id={`chat-sug-${idx}`}
                onClick={() => handleSendMessage(s)}
                className="p-2.5 rounded-xl bg-brand-cream/60 border border-brand-sage/10 hover:border-brand-sage text-left text-[11px] text-gray-700 font-bold cursor-pointer hover:bg-brand-cream transition-all hover:translate-x-1"
              >
                🌱 {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inputs block */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about feeding timing, Ragi recipes..."
          className="flex-1 px-4 py-3 rounded-xl border border-brand-sage/30 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-xs font-semibold text-brand-primary"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3.5 rounded-xl bg-brand-primary text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md shadow-brand-primary/10"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
