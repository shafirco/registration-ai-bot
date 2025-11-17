# Setup & Installation Guide

## Requirements

- Node.js (v18+)
- Python 3.8+
- npm
- OpenAI account with API Key

## Step 1: Install Packages

### Node Server (Bot):
```bash
cd server-node
npm install
```

### Frontend Web:
```bash
cd frontend-web
npm install
```

### Frontend Mobile (Optional):
```bash
cd frontend-mobile/frontendMobile
npm install
```

### Python Server (Optional):
```bash
cd server-python
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

## Step 2: Configure .env Files

### Node Server (Chat Bot):
Create a `.env` file in `server-node/`:

```env
# Required!
OPENAI_API_KEY=sk-your-openai-key-here

# Optional (for Google Sheets)
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### Python Server (Registration):
Copy `server-python/env-template.txt` to `server-python/.env`:

```bash
copy server-python/env-template.txt server-python/.env
```

Edit the file with your details:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=registration_db
NODE_SERVER_URL=http://localhost:4000
PORT=5000
```

### How to get your OpenAI API Key?
1. Go to: https://platform.openai.com/api-keys
2. Create a new API Key
3. Copy and paste it to server-node/.env

### Google Sheets (Optional)
If you want Google Sheets integration:
1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create a Service Account
4. Share the spreadsheet with the service account
5. Paste the JSON Key into the .env file

## Step 3: Compile TypeScript

**Important!** The bot is written in TypeScript and needs compiling:

```bash
cd server-node
npm run build
```

This creates a `dist/` folder with JavaScript files.

**Whenever you make code changes in `agent/`**, run:
```bash
npm run build
```

## Step 4: Running the Application

**🚀 Servers are deployed on Azure! No need to run them locally.**

### Live Services:
- **Chat Bot API**: https://registration-bot-node-bfb7g2gscyghg4gc.israelcentral-01.azurewebsites.net
- **Registration API**: https://registration-bot-python-dgebdmedh3g3g7ge.israelcentral-01.azurewebsites.net

### Run the website:
```bash
cd frontend-web
npm start
```

The app should open at `http://localhost:3000`

### Run Mobile:
```bash
cd frontend-mobile/frontendMobile
npx expo start
```

Scan the QR code with Expo Go app on your phone.

**Note:** Both web and mobile apps are configured to use the Azure servers automatically.

## Quick Test

Test the live Azure services:
```bash
curl https://registration-bot-node-bfb7g2gscyghg4gc.israelcentral-01.azurewebsites.net/random-message
```

You should get a JSON reply in Hebrew.

## Troubleshooting

### 1. Bot not responding / error
```bash
# Ensure server is running
curl http://localhost:4000/random-message

# Recompile TypeScript
cd server-node
npm run build

# Restart the server
npm start
```

### 2. Missing .env
```bash
cd server-node
# Create .env with OPENAI_API_KEY
```

### 3. Compilation errors
```bash
cd server-node
npm install
npm run build
```

### 4. Button not appearing on the site
- Refresh the page
- Open the browser console (F12) and check for errors

## Typical Workflow

1. **Open 1 terminal for frontend:**
   ```bash
   cd frontend-web && npm start
   ```

2. **For mobile development:**
   ```bash
   cd frontend-mobile/frontendMobile && npx expo start
   ```

3. **Frontend changes:**
   - Saving files will update automatically (Hot Reload)
   - Servers are already running on Azure

## What can the bot do?

- ✅ Speak Hebrew only
- ✅ Check delivery statuses (12345, 67890)
- ✅ Store customer information in Google Sheets
- ✅ Log conversations
- ✅ Encourage new orders

## Test Data

Example deliveries to test:
- Delivery number: **12345** (in transit)
- Delivery number: **67890** (delivered)

## Quick Summary

```bash
# One-time setup
cd server-node && npm install
cd ../frontend-web && npm install

# Create .env with OPENAI_API_KEY

# Build TypeScript (once or after changes in agent/)
cd server-node && npm run build

# Running (every time)
Terminal 1: cd server-node && npm start
Terminal 2: cd frontend-web && npm start

# Open: http://localhost:3000
# Click the chat floating button
```

That's it! 🚀

