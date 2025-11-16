# A.B Deliveries - Registration & Chat Bot

Project for a registration system with a smart chat bot in Hebrew.

## Project Structure

```
registration-ai-bot/
├── server-python/          # Python server for registration (FastAPI)
├── server-node/           # Node.js server + LangChain-based bot
├── frontend-web/          # React web app with chat bot
└── frontend-mobile/       # React Native mobile app with chat bot
```

## Features

- 📝 Registration system with AI
- 💬 Smart chat bot (LangChain + GPT-4o-mini)
- 📊 Google Sheets integration
- 📦 Delivery status checking
- 🌐 Web and Mobile support

## Quick Installation

See [SETUP.md](SETUP.md) for full instructions.

## Technologies

**Backend:**
- Python (FastAPI)
- Node.js (Express)
- LangChain
- OpenAI GPT-4o-mini
- Google Sheets API

**Frontend:**
- React (Web)
- React Native (Mobile)
- Expo

## Bot Architecture

The bot uses LangChain with 3 main tools:
1. **googleSheetsTool** - Manage customer information
2. **deliveryStatusTool** - Check delivery status
3. **messageTool** - Log conversations

## Running

```bash
# 1. Node bot server
cd server-node
npm start

# 2. Web frontend
cd frontend-web
npm start

# 3. Mobile (optional)
cd frontend-mobile/frontendMobile
npm run android  # or ios
```

## License

MIT

