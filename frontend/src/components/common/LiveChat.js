import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaHeadset, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import './LiveChat.css';

const botReplies = [
  "Hi! 👋 Welcome to rentselectronics.com! How can I help you today?",
  "I can help you with product information, rental plans, orders, or connect you with a live agent.",
  "Our support team is available Mon–Sat, 9AM–8PM. For urgent issues, call 1800-123-4567.",
];

const quickReplies = [
  'How does renting work?',
  'Check order status',
  'Pricing & plans',
  'Talk to an agent',
];

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: botReplies[0], time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [replyIdx, setReplyIdx] = useState(1);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [messages, isOpen]);

  // Show options after first bot message
  useEffect(() => {
    if (isOpen && messages.length === 1) {
      const t = setTimeout(() => setShowOptions(true), 600);
      return () => clearTimeout(t);
    }
  }, [isOpen, messages.length]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { from: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowOptions(false);

    // Bot response
    setTimeout(() => {
      const reply = botReplies[replyIdx % botReplies.length];
      setMessages(prev => [...prev, { from: 'bot', text: reply, time: new Date() }]);
      setReplyIdx(i => i + 1);
      setTimeout(() => setShowOptions(true), 400);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Chat bubble */}
      <button
        className={`chat-bubble ${isOpen ? 'chat-bubble-open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label="Open live chat"
      >
        {isOpen ? <FaTimes /> : <FaComments />}
        {!isOpen && <span className="chat-bubble-ping"></span>}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-window" role="dialog" aria-label="Live chat support">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-agent">
              <div className="agent-avatar"><FaHeadset /></div>
              <div>
                <strong>Support Team</strong>
                <span className="agent-status">🟢 Online</span>
              </div>
            </div>
            <div className="chat-header-actions">
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="chat-action-btn" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="tel:18001234567" className="chat-action-btn" aria-label="Call">
                <FaPhoneAlt />
              </a>
              <button className="chat-action-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                {msg.from === 'bot' && (
                  <div className="bot-avatar"><FaHeadset /></div>
                )}
                <div className="msg-bubble">
                  <p>{msg.text}</p>
                  <span className="msg-time">{fmt(msg.time)}</span>
                </div>
              </div>
            ))}
            {showOptions && (
              <div className="chat-quick-replies">
                {quickReplies.map(r => (
                  <button key={r} className="quick-reply-btn" onClick={() => sendMessage(r)}>
                    {r}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="chat-input"
              aria-label="Chat message"
            />
            <button type="submit" className="chat-send-btn" disabled={!input.trim()} aria-label="Send">
              <FaPaperPlane />
            </button>
          </form>
          <p className="chat-disclaimer">Usually replies within minutes · Mon–Sat 9AM–8PM</p>
        </div>
      )}
    </>
  );
};

export default LiveChat;
