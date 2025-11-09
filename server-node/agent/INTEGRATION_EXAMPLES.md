# Integration Examples - Connecting to the Agent

This guide shows how to integrate the LangChain agent with your frontend applications.

## API Endpoint

```
POST http://localhost:4000/agent/chat
Content-Type: application/json
```

## Request Format

```json
{
  "name": "שם הלקוח",
  "phone": "0501234567",
  "message": "ההודעה מהלקוח"
}
```

## Response Format

```json
{
  "reply": "התשובה בעברית מהאייג'נט",
  "actions": ["googleSheetsTool", "messageTool"],
  "timestamp": "2025-11-09T12:00:00.000Z"
}
```

## Frontend Integration Examples

### React / React Native (JavaScript)

```javascript
async function sendMessageToAgent(name, phone, message) {
  try {
    const response = await fetch('http://localhost:4000/agent/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        phone,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from agent');
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error communicating with agent:', error);
    return 'מצטער, אירעה שגיאה. אנא נסה שוב מאוחר יותר.';
  }
}

// Usage in a React component
function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    const userMessage = input;
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setInput('');

    const agentReply = await sendMessageToAgent(
      'שם המשתמש', // Get from user state
      '0501234567', // Get from user state
      userMessage
    );

    setMessages(prev => [...prev, { role: 'assistant', content: agentReply }]);
  };

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} className={msg.role}>
          {msg.content}
        </div>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={handleSend}>שלח</button>
    </div>
  );
}
```

### React Native (TypeScript)

```typescript
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentResponse {
  reply: string;
  actions: string[];
  timestamp: string;
}

async function callAgent(
  name: string,
  phone: string,
  message: string
): Promise<string> {
  try {
    const response = await fetch('http://localhost:4000/agent/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone, message }),
    });

    const data: AgentResponse = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Agent error:', error);
    return 'מצטער, אני לא זמין כרגע. אנא נסה שוב מאוחר יותר.';
  }
}

export default function ChatScreen({ userName, userPhone }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    const reply = await callAgent(userName, userPhone, userMessage);
    
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: item.role === 'user' ? '#e3f2fd' : '#f5f5f5' }}>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="הקלד הודעה..."
          style={{ flex: 1, borderWidth: 1, borderRadius: 5, padding: 10 }}
        />
        <TouchableOpacity onPress={sendMessage} disabled={loading}>
          <Text style={{ padding: 10 }}>שלח</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

### Vanilla JavaScript

```javascript
// Simple chat widget
class ABDeliveriesChat {
  constructor(apiUrl = 'http://localhost:4000/agent/chat') {
    this.apiUrl = apiUrl;
    this.userName = null;
    this.userPhone = null;
  }

  setUser(name, phone) {
    this.userName = name;
    this.userPhone = phone;
  }

  async sendMessage(message) {
    if (!this.userName || !this.userPhone) {
      throw new Error('User information not set');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.userName,
        phone: this.userPhone,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error('Agent request failed');
    }

    const data = await response.json();
    return data;
  }
}

// Usage
const chat = new ABDeliveriesChat();
chat.setUser('דני לוי', '0521234567');

document.getElementById('sendBtn').addEventListener('click', async () => {
  const input = document.getElementById('messageInput');
  const message = input.value;

  if (message.trim()) {
    const response = await chat.sendMessage(message);
    displayMessage('user', message);
    displayMessage('agent', response.reply);
    input.value = '';
  }
});

function displayMessage(role, content) {
  const messagesDiv = document.getElementById('messages');
  const messageEl = document.createElement('div');
  messageEl.className = role;
  messageEl.textContent = content;
  messagesDiv.appendChild(messageEl);
}
```

### Python (for backend-to-backend)

```python
import requests

def call_agent(name: str, phone: str, message: str) -> dict:
    """Call the LangChain agent from Python backend"""
    url = "http://localhost:4000/agent/chat"
    
    payload = {
        "name": name,
        "phone": phone,
        "message": message
    }
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error calling agent: {e}")
        return {
            "reply": "מצטער, אירעה שגיאה.",
            "actions": [],
            "timestamp": ""
        }

# Usage
result = call_agent("יוסי כהן", "0501234567", "מה קורה עם משלוח 12345?")
print(f"Agent reply: {result['reply']}")
print(f"Tools used: {result['actions']}")
```

## Error Handling

### HTTP Status Codes

- **200 OK** - Success
- **400 Bad Request** - Missing fields (name, phone, or message)
- **500 Internal Server Error** - Agent error

### Example Error Response

```json
{
  "error": "Failed to process chat",
  "details": "Error message here"
}
```

### Handling Errors in Frontend

```javascript
async function sendMessageWithErrorHandling(name, phone, message) {
  try {
    const response = await fetch('http://localhost:4000/agent/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, phone, message }),
    });

    if (response.status === 400) {
      return 'אנא ודא שכל השדות מלאים';
    }

    if (response.status === 500) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      return 'מצטער, אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.';
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Network error:', error);
    return 'לא ניתן להתחבר לשרת. בדוק את החיבור שלך.';
  }
}
```

## Real-World Integration Tips

### 1. Loading States

Show a loading indicator while waiting for the agent:

```javascript
const [isAgentThinking, setIsAgentThinking] = useState(false);

const sendMessage = async () => {
  setIsAgentThinking(true);
  const reply = await callAgent(name, phone, message);
  setIsAgentThinking(false);
  // ... display reply
};
```

### 2. Typing Indicator

Show that the agent is "typing":

```javascript
{isAgentThinking && (
  <div className="typing-indicator">
    <span>A.B Deliveries מקליד</span>
    <span className="dots">...</span>
  </div>
)}
```

### 3. Message Timestamps

Display when each message was sent:

```javascript
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
};

{messages.map((msg) => (
  <div key={msg.id}>
    <p>{msg.content}</p>
    <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
  </div>
))}
```

### 4. Persistent User Info

Store user info once and reuse:

```javascript
// Store in localStorage
localStorage.setItem('userName', 'דני לוי');
localStorage.setItem('userPhone', '0521234567');

// Retrieve when needed
const userName = localStorage.getItem('userName');
const userPhone = localStorage.getItem('userPhone');
```

### 5. Connection Testing

Test the connection before displaying the chat:

```javascript
async function testConnection() {
  try {
    const response = await fetch('http://localhost:4000/random-message');
    return response.ok;
  } catch {
    return false;
  }
}

// In your component
useEffect(() => {
  testConnection().then(isConnected => {
    if (!isConnected) {
      alert('לא ניתן להתחבר לשרת');
    }
  });
}, []);
```

## WebSocket Alternative (Future Enhancement)

For real-time, lower-latency chat, consider adding WebSocket support:

```javascript
// This would require updating the server
const ws = new WebSocket('ws://localhost:4000/agent/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  displayAgentMessage(data.reply);
};

ws.send(JSON.stringify({
  name: 'דני',
  phone: '0521234567',
  message: 'שלום'
}));
```

## Production Considerations

### 1. Use Environment Variables

```javascript
const API_URL = process.env.REACT_APP_AGENT_URL || 'http://localhost:4000/agent/chat';
```

### 2. Add Authentication

```javascript
const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  },
  body: JSON.stringify({ name, phone, message }),
});
```

### 3. Rate Limiting

Implement client-side rate limiting:

```javascript
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds

async function sendMessage(message) {
  const now = Date.now();
  if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
    return 'אנא המתן רגע לפני שליחת הודעה נוספת';
  }
  lastRequestTime = now;
  // ... send message
}
```

## Testing Your Integration

Use the test script to verify the endpoint works:

```bash
cd server-node
node test-agent.js
```

Then integrate step by step:
1. Test with a simple button click
2. Add input field
3. Add message display
4. Add loading states
5. Add error handling

---

**Ready to integrate?** Start with a simple fetch request and build from there!

