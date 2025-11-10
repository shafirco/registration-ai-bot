import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { getGoogleSheetsClient, GOOGLE_SHEETS_CONFIG } from '../config.js';
// Tool for logging chat messages to Google Sheets
export const messageTool = new DynamicStructuredTool({
    name: 'messageTool',
    description: `כלי לרישום שיחות צ'אט ב-Google Sheets.
  השתמש בכלי זה כדי:
  - לרשום הודעות מלקוחות
  - לתעד את השיחה לצורך מעקב עתידי
  - לשמור היסטוריית תקשורת עם הלקוח`,
    schema: z.object({
        name: z.string().describe('שם הלקוח'),
        phone: z.string().describe('מספר הטלפון של הלקוח'),
        message: z.string().describe('ההודעה מהלקוח'),
        response: z.string().describe('התשובה שניתנה ללקוח'),
    }),
    func: async ({ name, phone, message, response }) => {
        try {
            const sheets = await getGoogleSheetsClient();
            const { spreadsheetId, chatLogSheetName } = GOOGLE_SHEETS_CONFIG;
            if (!spreadsheetId) {
                return JSON.stringify({ error: 'Google Spreadsheet ID is not configured' });
            }
            const timestamp = new Date().toISOString();
            const newRow = [timestamp, name, phone, message, response];
            // Append the chat log
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: `${chatLogSheetName}!A:E`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [newRow],
                },
            });
            return JSON.stringify({
                success: true,
                message: 'השיחה נרשמה בהצלחה',
                timestamp,
            });
        }
        catch (error) {
            console.error('Error in messageTool:', error);
            return JSON.stringify({
                error: 'שגיאה ברישום השיחה',
                details: error.message,
            });
        }
    },
});
//# sourceMappingURL=messageTool.js.map