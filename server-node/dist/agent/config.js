import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
// Google Sheets configuration
export const GOOGLE_SHEETS_CONFIG = {
    spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || '',
    customerSheetName: 'Customers',
    chatLogSheetName: 'ChatLogs',
};
// Initialize Google Sheets API
export async function getGoogleSheetsClient() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY
                ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
                : undefined,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });
        return sheets;
    }
    catch (error) {
        console.error('Error initializing Google Sheets client:', error);
        throw error;
    }
}
// System prompt for the agent
export const SYSTEM_PROMPT = `דבר רק בעברית. אתה עוזר בשם A.B Deliveries.
ענה ללקוחות על שאלות לגבי סטטוס משלוחים, הצעות להזמנות חדשות, ותמיכה כללית.
תשובותיך צריכות להיות מנומסות, חכמות, ותמיד לכלול עידוד חיובי להזמנה נוספת.
אם יש צורך לבדוק סטטוס משלוח, השתמש בכלי deliveryStatusTool.
אם יש צורך לעדכן או לרשום מידע על לקוח, השתמש בכלי googleSheetsTool.
אם יש הודעה מהלקוח, רשום אותה עם messageTool.`;
//# sourceMappingURL=config.js.map