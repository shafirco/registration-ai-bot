# Google Sheets Setup Guide

This guide will help you set up Google Sheets API integration for the A.B Deliveries agent.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Sheets API"
3. Click on it and press **Enable**

## Step 3: Create a Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Fill in the service account details:
   - Name: `ab-deliveries-agent`
   - Description: `Service account for A.B Deliveries LangChain Agent`
4. Click **Create and Continue**
5. Grant the role: **Editor** (or custom role with Sheets access)
6. Click **Done**

## Step 4: Create and Download Service Account Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Choose **JSON** format
5. Click **Create** - this will download a JSON file

## Step 5: Prepare the JSON Key for .env

The downloaded JSON looks like this:

```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "ab-deliveries-agent@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

**Important**: Convert this entire JSON to a single-line string for the .env file:

```env
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project",...}'
```

## Step 6: Create Google Sheet

1. Create a new Google Sheet
2. Name it: **A.B Deliveries Data**
3. Create two tabs:

### Tab 1: Customers
Columns: `Name | Phone | Email | Address | LastOrder`

Example data:
```
Name          | Phone       | Email              | Address         | LastOrder
דני לוי       | 0521234567  | danny@email.com    | תל אביב         | 2025-11-08
שרה כהן      | 0501234567  | sarah@email.com    | ירושלים         | 2025-11-07
```

### Tab 2: ChatLogs
Columns: `Timestamp | Name | Phone | Message | Response`

This will be auto-populated by the agent.

## Step 7: Share the Sheet

1. Click the **Share** button on your Google Sheet
2. Add the service account email (from the JSON: `client_email`)
3. Give it **Editor** permissions
4. Click **Share**

## Step 8: Get the Spreadsheet ID

The spreadsheet ID is in the URL:
```
https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
                                      ^^^^^^^^^^^^^^^^^^^^^^^^
```

Copy this ID for your .env file.

## Step 9: Update .env File

Create or update your `.env` file in the `server-node` folder:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-key

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_from_url
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...entire JSON on one line...}'

# Server Configuration
PORT=4000
```

## Verification

Test your setup by running:

```bash
npm start
```

Then test with:

```bash
node test-agent.js
```

Check your Google Sheet - you should see new entries in the ChatLogs tab!

## Troubleshooting

### Error: "Invalid credentials"
- Verify the JSON key is correct and properly formatted
- Make sure the service account has the correct permissions

### Error: "Spreadsheet not found"
- Check the spreadsheet ID is correct
- Verify the sheet is shared with the service account email

### Error: "Insufficient permissions"
- Make sure the service account has Editor access to the sheet
- Verify Google Sheets API is enabled in your project

### No data appearing in sheets
- Check the sheet tab names match exactly: "Customers" and "ChatLogs"
- Verify the column headers are in the correct order

