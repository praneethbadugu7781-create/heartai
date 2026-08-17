import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, X, AlertTriangle, Sparkles, MessageSquare, ChevronDown, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { HealthInput, ChatMessage } from '../../services/types';

interface ChatAssistantDrawerProps {
  healthData?: HealthInput;
  predictionSummary?: any;
  assessmentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatAssistantDrawer: React.FC<ChatAssistantDrawerProps> = ({
  healthData,
  predictionSummary,
  assessmentId,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello, I am **HeartGuard Assistant**, your educational AI cardiac health communicator. " +
        "I can help explain your risk assessment results, physiological biomarkers (such as blood pressure, cholesterol, ECG indicators), and general lifestyle habits. " +
        "How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: [
        'Why did the models predict this risk score?',
        'What lifestyle changes support healthy blood pressure?',
        'How does TabNet analyze my cardiac features?'
      ]
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputVal.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const res = await api.queryAssistant(query, assessmentId, healthData, predictionSummary);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: res.is_emergency,
        suggestedFollowups: res.suggested_followups
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm currently unable to reach the AI assistant service. Please check your network connection or try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base">HeartGuard Assistant</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30">
                Educational AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Context-Aware Cardiac Explanations</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Close Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Medical Safety Notice Banner */}
      <div className="bg-rose-50/80 px-4 py-2 border-b border-rose-200/80 flex items-center gap-2 text-[11px] text-rose-900">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span>Non-diagnostic assistant. For acute symptoms, call 911 / 112 immediately.</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAFAF9]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
          >
            <div className="flex items-center gap-1 text-[10px] text-slate-400 px-1">
              {msg.role === 'user' ? (
                <>
                  <span>You</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  <span className="font-semibold text-brand-700">HeartGuard AI</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </>
              )}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-[88%] text-xs sm:text-sm leading-relaxed shadow-soft whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : msg.isEmergency
                  ? 'bg-rose-50 border-2 border-rose-400 text-rose-950 rounded-tl-none font-medium'
                  : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>

            {/* Suggested Follow-up Pills */}
            {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5 max-w-[92%]">
                {msg.suggestedFollowups.map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(pill)}
                    className="text-[11px] bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-800 border border-slate-200 hover:border-brand-200 px-3 py-1.5 rounded-full shadow-xs transition-colors text-left"
                  >
                    {pill} →
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit text-xs text-slate-500 shadow-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
            <span>Consulting cardiovascular model context...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about your risk score, vitals, or habits..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="p-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl shadow-md disabled:opacity-40 transition-colors"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
