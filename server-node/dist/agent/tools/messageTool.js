"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTool = void 0;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const config_js_1 = require("../config.js");
// Tool for logging chat messages to Google Sheets
exports.messageTool = new tools_1.DynamicStructuredTool({
    name: 'messageTool',
    description: `כלי לרישום שיחות צ'אט ב-Google Sheets.
  השתמש בכלי זה כדי:
  - לרשום הודעות מלקוחות
  - לתעד את השיחה לצורך מעקב עתידי
  - לשמור היסטוריית תקשורת עם הלקוח`,
    schema: zod_1.z.object({
        name: zod_1.z.string().describe('שם הלקוח'),
        phone: zod_1.z.string().describe('מספר הטלפון של הלקוח'),
        message: zod_1.z.string().describe('ההודעה מהלקוח'),
        response: zod_1.z.string().describe('התשובה שניתנה ללקוח'),
    }),
    func: async ({ name, phone, message, response }) => {
        try {
            const sheets = await (0, config_js_1.getGoogleSheetsClient)();
            const { spreadsheetId, chatLogSheetName } = config_js_1.GOOGLE_SHEETS_CONFIG;
            if (!spreadsheetId) {
                console.log('Google Spreadsheet ID is not configured - logging to console only');
                console.log(`Chat Log: ${new Date().toISOString()} | ${name} (${phone}): ${message} -> ${response}`);
                return JSON.stringify({
                    success: true,
                    message: 'השיחה נרשמה מקומית (Google Sheets לא מוגדר)',
                    logged_to: 'console'
                });
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
                message: 'השיחה נרשמה בהצלחה ב-Google Sheets',
                timestamp,
            });
        }
        catch (error) {
            console.error('Error in messageTool:', error);
            // Fallback to console logging
            console.log(`Chat Log (fallback): ${new Date().toISOString()} | ${name} (${phone}): ${message} -> ${response}`);
            return JSON.stringify({
                success: true,
                message: 'השיחה נרשמה מקומית (Google Sheets לא זמין)',
                details: error.message,
                logged_to: 'console'
            });
        }
    },
});
//# sourceMappingURL=messageTool.js.map