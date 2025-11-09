# A.B Deliveries LangChain Agent

Hebrew-speaking AI assistant for A.B Deliveries built with LangChain.

## Features

- **Hebrew Language Support**: Agent communicates exclusively in Hebrew
- **Google Sheets Integration**: Read/write customer data and log conversations
- **Delivery Status Tracking**: Check package delivery status
- **Memory Management**: Maintains conversation context per customer
- **Friendly & Persuasive**: Encourages customers to place new orders

## Architecture

### Tools

1. **googleSheetsTool** - Manages customer data in Google Sheets
   - Read customer information by phone
   - Write new customer records
   - Update existing customer data

2. **deliveryStatusTool** - Checks shipment status
   - Fetches delivery location and status
   - Provides estimated delivery time
   - Shows last update timestamp

3. **messageTool** - Logs conversations
   - Records all chat interactions
   - Stores: timestamp, name, phone, message, response

### Agent Configuration

- **LLM**: GPT-4o-mini (via OpenAI)
- **Memory**: BufferMemory (per conversation/phone number)
- **Max Iterations**: 5
- **Language**: Hebrew only

## Setup

### 1. Install Dependencies

```bash
cd server-node
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
OPENAI_API_KEY=sk-...
GOOGLE_SPREADSHEET_ID=1abc...
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

### 3. Setup Google Sheets

Create a Google Sheet with two tabs:
- **Customers** (columns: Name, Phone, Email, Address, LastOrder)
- **ChatLogs** (columns: Timestamp, Name, Phone, Message, Response)

Share the sheet with your service account email.

### 4. Start the Server

```bash
npm start
```

## API Endpoint

### POST /agent/chat

Sends a message to the LangChain agent.

**Request:**
```json
{
  "name": "יוסי כהן",
  "phone": "0501234567",
  "message": "היי, אני רוצה לבדוק את סטטוס המשלוח שלי"
}
```

**Response:**
```json
{
  "reply": "שלום יוסי! אשמח לעזור לך. מה מספר המשלוח שלך?",
  "actions": ["messageTool"],
  "timestamp": "2025-11-09T12:00:00.000Z"
}
```

## Testing

Test the agent with sample messages:

```bash
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d '{
    "name": "דני לוי",
    "phone": "0521234567",
    "message": "מה המחיר למשלוח לירושלים?"
  }'
```

## Memory Management

- Each conversation is stored per phone number
- Memory persists across requests during server runtime
- Clear specific conversation: Use `clearConversationMemory(phone)`
- Clear all: Use `clearAllMemories()`

## File Structure

```
agent/
├── agent.ts              # Main agent logic
├── config.ts             # Configuration & Google Sheets client
├── types.ts              # TypeScript types
├── index.ts              # Export entry point
├── tools/
│   ├── googleSheetsTool.ts
│   ├── deliveryStatusTool.ts
│   ├── messageTool.ts
│   └── index.ts
└── README.md
```

## Notes

- The agent enforces Hebrew-only responses
- All conversations are automatically logged to Google Sheets
- Delivery status uses mock data (replace with real API in production)
- Memory is stored in-memory (consider Redis for production)

