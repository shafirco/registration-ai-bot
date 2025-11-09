# Testing the LangChain Agent

This document provides testing scenarios and examples for the A.B Deliveries agent.

## Prerequisites

1. ✅ Dependencies installed (`npm install`)
2. ✅ `.env` file configured with:
   - `OPENAI_API_KEY`
   - `GOOGLE_SPREADSHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_KEY`
3. ✅ Google Sheet created and shared with service account
4. ✅ Server running (`npm start`)

## Quick Test

### Start the Server

```bash
cd server-node
npm start
```

You should see:
```
🚀 Node server running on port 4000
```

### Run Automated Tests

In a new terminal:

```bash
cd server-node
node test-agent.js
```

## Manual Testing with cURL

### Test 1: General Inquiry

```bash
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"דני לוי\",\"phone\":\"0521234567\",\"message\":\"שלום! אני רוצה לשמוע על השירותים שלכם\"}"
```

Expected: Hebrew response introducing A.B Deliveries services

### Test 2: Delivery Status Check

```bash
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"שרה כהן\",\"phone\":\"0501234567\",\"message\":\"אני רוצה לבדוק את סטטוס המשלוח 12345\"}"
```

Expected: 
- Uses `deliveryStatusTool`
- Returns status, location, and estimated delivery time
- Logs conversation to Google Sheets

### Test 3: New Order Inquiry

```bash
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"יוסי אברהם\",\"phone\":\"0541234567\",\"message\":\"מה המחיר למשלוח חבילה לחיפה?\"}"
```

Expected:
- Friendly response with pricing information
- Encouragement to place an order
- Possible use of `googleSheetsTool` to check/update customer data

## Testing Individual Tools

### Google Sheets Tool

The agent will automatically use this tool when needed, but you can verify it works by:

1. Send a message that requires customer data lookup
2. Check the "Customers" tab in your Google Sheet
3. Send another message - the agent should remember the customer

### Delivery Status Tool

Test with mock shipment IDs:
- `12345` - In transit
- `67890` - Delivered

```bash
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"phone\":\"0500000000\",\"message\":\"בדוק משלוח 12345\"}"
```

### Message Tool

Every conversation is automatically logged. Check the "ChatLogs" tab in your Google Sheet after each test.

## Conversation Memory Test

Test that the agent remembers context:

```bash
# First message
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"מיכל ישראלי\",\"phone\":\"0523333333\",\"message\":\"שלום, קוראים לי מיכל\"}"

# Second message (same phone number)
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"מיכל ישראלי\",\"phone\":\"0523333333\",\"message\":\"מה שמי?\"}"
```

Expected: Agent remembers the name from the first message

## Hebrew Language Test

Try sending a message in English:

```bash
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"phone\":\"0500000001\",\"message\":\"Hello, how are you?\"}"
```

Expected: Agent responds in Hebrew only

## Response Structure

All successful responses follow this format:

```json
{
  "reply": "התשובה בעברית...",
  "actions": ["toolName1", "toolName2"],
  "timestamp": "2025-11-09T12:00:00.000Z"
}
```

- `reply`: The agent's response in Hebrew
- `actions`: Array of tools used (e.g., "googleSheetsTool", "deliveryStatusTool", "messageTool")
- `timestamp`: ISO 8601 timestamp

## Error Cases

### Missing Fields

```bash
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\"}"
```

Expected: HTTP 400 with error message

### Invalid Shipment ID

```bash
curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"phone\":\"0500000000\",\"message\":\"בדוק משלוח 99999\"}"
```

Expected: Agent responds that the shipment was not found

## Verify Google Sheets Logging

After running tests, verify that:

1. **ChatLogs** tab contains all conversations with:
   - Timestamp
   - Customer name
   - Phone number
   - Original message
   - Agent's response

2. **Customers** tab may have new entries if the agent used `googleSheetsTool`

## Performance Testing

Test agent response time:

```bash
time curl -X POST http://localhost:4000/agent/chat \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test\",\"phone\":\"0500000000\",\"message\":\"שלום\"}"
```

Typical response time: 2-5 seconds (depends on LLM and tools used)

## Common Issues

### "Error: OPENAI_API_KEY is not defined"
- Check `.env` file exists and contains valid OpenAI API key

### "Error: Google Spreadsheet ID is not configured"
- Verify `GOOGLE_SPREADSHEET_ID` in `.env`

### "Error initializing Google Sheets client"
- Check `GOOGLE_SERVICE_ACCOUNT_KEY` is valid JSON
- Verify the service account has access to the sheet

### Agent doesn't use tools
- Check the system prompt in `config.ts`
- Verify tools are properly registered in `agent.ts`
- Try more explicit requests (e.g., "check shipment 12345")

## Next Steps

After successful testing:

1. ✅ Add real delivery API integration in `deliveryStatusTool.ts`
2. ✅ Implement production-grade error handling
3. ✅ Add authentication to the API endpoint
4. ✅ Set up monitoring and logging
5. ✅ Deploy to production environment

