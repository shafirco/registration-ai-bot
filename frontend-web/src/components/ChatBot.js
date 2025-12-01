import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    
    const savedName = localStorage.getItem('abDeliveriesUserName');
    const savedPhone = localStorage.getItem('abDeliveriesUserPhone');
    if (savedName && savedPhone) {
      setUserName(savedName);
      setUserPhone(savedPhone);
      setIsSetup(true);
      setMessages([
        {
          role: 'assistant',
          content: `שלום ${savedName}! איך אפשר לעזור לך היום? 😊`,
        },
      ]);
    }
  }, []);

  const handleSetup = (e) => {
    e.preventDefault();
    if (userName && userPhone) {
      localStorage.setItem('abDeliveriesUserName', userName);
      localStorage.setItem('abDeliveriesUserPhone', userPhone);
      setIsSetup(true);
      setMessages([
        {
          role: 'assistant',
          content: `שלום ${userName}! איך אפשר לעזור לך היום? 😊`,
        },
      ]);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://registration-bot-node-bfb7g2gscyghg4gc.israelcentral-01.azurewebsites.net/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          phone: userPhone,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'מצטער, אירעה שגיאה. אנא נסה שוב מאוחר יותר.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const resetChat = () => {
    localStorage.removeItem('abDeliveriesUserName');
    localStorage.removeItem('abDeliveriesUserPhone');
    setUserName('');
    setUserPhone('');
    setIsSetup(false);
    setMessages([]);
  };

  return (
    <>
      {/* כפתור פתיחת הצ'אט */}
      <button
        className={`chat-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="פתח צ'אט"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* חלון הצ'אט */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <h3>A.B Deliveries</h3>
              <p>נציג וירטואלי</p>
            </div>
            {isSetup && (
              <button className="reset-btn" onClick={resetChat} title="אתחול שיחה">
                🔄
              </button>
            )}
          </div>

          {!isSetup ? (
            
            <div className="chat-setup">
              <div className="setup-content">
                <div className="setup-icon">👋</div>
                <h4>שלום! נעים להכיר</h4>
                <p>בואו נתחיל - ספרו לי מי אתם:</p>
                <form onSubmit={handleSetup}>
                  <input
                    type="text"
                    placeholder="שם מלא"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    autoFocus
                  />
                  <input
                    type="tel"
                    placeholder="מספר טלפון (050-1234567)"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    required
                    pattern="[0-9]{3}-?[0-9]{7}"
                  />
                  <button type="submit" className="setup-submit">
                    התחל שיחה
                  </button>
                </form>
              </div>
            </div>
          ) : (
            
            <>
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.role}`}>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message assistant typing">
                    <div className="message-content">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* אזור הקלדה */}
              <form className="chat-input-container" onSubmit={sendMessage}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="הקלד הודעה..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={isTyping || !input.trim()}
                >
                  ↵
                </button>
              </form>

              {/* הצעות מהירות */}
              <div className="quick-actions">
                <button
                  onClick={() => setInput('אני רוצה לבדוק משלוח')}
                  className="quick-action-btn"
                >
                  📦 בדיקת משלוח
                </button>
                <button
                  onClick={() => setInput('מה המחיר למשלוח?')}
                  className="quick-action-btn"
                >
                  💰 מחירון
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default ChatBot;

