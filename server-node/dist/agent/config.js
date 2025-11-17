"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_PROMPT = exports.GOOGLE_SHEETS_CONFIG = void 0;
exports.getGoogleSheetsClient = getGoogleSheetsClient;
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Google Sheets configuration
exports.GOOGLE_SHEETS_CONFIG = {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
    customerSheetName: 'Customers',
    chatLogSheetName: 'ChatLogs',
};
// Initialize Google Sheets API
async function getGoogleSheetsClient() {
    try {
        // Check if Google Sheets is properly configured
        if (!process.env.GOOGLE_SPREADSHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
            throw new Error('Google Sheets not configured');
        }
        let credentials;
        try {
            credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        }
        catch (parseError) {
            throw new Error('Invalid Google Service Account Key format');
        }
        const auth = new googleapis_1.google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const authClient = await auth.getClient();
        const sheets = googleapis_1.google.sheets({ version: 'v4', auth: authClient });
        return sheets;
    }
    catch (error) {
        console.error('Error initializing Google Sheets client:', error);
        throw error;
    }
}
// System prompt for the agent
exports.SYSTEM_PROMPT = `דבר רק בעברית. אתה עוזר בשם A.B Deliveries.
ענה ללקוחות על שאלות לגבי סטטוס משלוחים, הצעות להזמנות חדשות, ותמיכה כללית.
תשובותיך צריכות להיות מנומסות, חכמות, ותמיד לכלול עידוד חיובי להזמנה נוספת.
אם יש צורך לבדוק סטטוס משלוח, השתמש בכלי deliveryStatusTool.
אם יש צורך לעדכן או לרשום מידע על לקוח, השתמש בכלי googleSheetsTool.
אם יש הודעה מהלקוח, רשום אותה עם messageTool.`;
//# sourceMappingURL=config.js.map