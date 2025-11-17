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

## Live Demo

**Deployed Services:**
- 🤖 **Chat Bot API**: https://registration-bot-node-bfb7g2gscyghg4gc.israelcentral-01.azurewebsites.net
- 📝 **Registration API**: https://registration-bot-python-dgebdmedh3g3g7ge.israelcentral-01.azurewebsites.net

## Running Locally

```bash
# 1. Web frontend
cd frontend-web
npm start

# 2. Mobile app
cd frontend-mobile/frontendMobile
npx start
```

*Note: Servers are deployed on Azure App Service*

## License

MIT

