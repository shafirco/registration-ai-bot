# Quick Start Guide - A.B Deliveries Agent

Get the LangChain Agent running in 5 minutes!

## 1. Install Dependencies

```bash
cd server-node
npm install
```

## 2. Set Up Environment Variables

You'll need to provide your `.env` file with the following keys:

```env
OPENAI_API_KEY=sk-your-key-here
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

### Getting These Values:

- **OPENAI_API_KEY**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Google Sheets Setup**: Follow [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)

## 3. Prepare Google Sheet

Create a Google Sheet with two tabs:

### Customers Tab
```
Name | Phone | Email | Address | LastOrder
```

### ChatLogs Tab
```
Timestamp | Name | Phone | Message | Response
```

Share with your service account email and get the spreadsheet ID from the URL.

## 4. Start the Server

```bash
npm start
```

You should see:
```
🚀 Node server running on port 4000
```

## 5. Test the Agent

Open a new terminal and run:

```bash
node test-agent.js
```

Or test manually with curl:

```bash
curl -X POST http://localhost:4000/agent/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"דני\",\"phone\":\"0521234567\",\"message\":\"שלום!\"}"
```

(Note: On Linux/Mac, use `\` instead of `^` for line continuation)

## What the Agent Can Do

✅ Speak Hebrew only
✅ Check delivery status (shipments 12345, 67890)
✅ Read/write customer data to Google Sheets
✅ Log all conversations automatically
✅ Remember conversation context per customer
✅ Encourage new orders in a friendly way

## Example Conversations

### Check Delivery Status
**User**: "אני רוצה לבדוק משלוח 12345"
**Agent**: "המשלוח 12345 נמצא כעת בתל אביב - מרכז חלוקה. סטטוס: בדרך"

### General Inquiry
**User**: "מה השירותים שלכם?"
**Agent**: Hebrew response about A.B Deliveries services + encouragement to order

### Price Check
**User**: "מה המחיר למשלוח לירושלים?"
**Agent**: Helpful response + persuasive encouragement for new order

## Verify It Works

After testing, check your Google Sheet:
- **ChatLogs** tab should have new entries
- **Customers** tab may have new customer records

## Troubleshooting

### Server won't start
- Check `.env` file exists in `server-node/`
- Verify all environment variables are set

### Agent responds but doesn't log to Sheets
- Verify Google Sheets API is enabled
- Check service account has Editor access to the sheet
- Confirm tab names are exactly "Customers" and "ChatLogs"

### Getting errors about tools
- Make sure `npm install` completed successfully
- Check Node.js version (requires v18+)

## Next Steps

- Read [agent/README.md](./agent/README.md) for architecture details
- See [agent/TESTING.md](./agent/TESTING.md) for comprehensive testing
- Integrate with your frontend application

## API Endpoint

```
POST http://localhost:4000/agent/chat

Request Body:
{
  "name": "שם לקוח",
  "phone": "0501234567",
  "message": "ההודעה מהלקוח"
}

Response:
{
  "reply": "התשובה בעברית",
  "actions": ["toolName"],
  "timestamp": "2025-11-09T12:00:00.000Z"
}
```

---

**Need Help?** Check the detailed guides:
- [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) - Google Sheets configuration
- [agent/README.md](./agent/README.md) - Agent architecture and features
- [agent/TESTING.md](./agent/TESTING.md) - Testing scenarios and examples

