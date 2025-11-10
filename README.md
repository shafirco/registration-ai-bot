# A.B Deliveries - Registration & Chat Bot

פרויקט מערכת הרשמה עם בוט צ'אט חכם בעברית.

## מה יש בפרויקט?

```
registration-ai-bot/
├── server-python/          # שרת Python להרשמה (FastAPI)
├── server-node/           # שרת Node.js + בוט LangChain בעברית
├── frontend-web/          # אתר React עם בוט צ'אט
└── frontend-mobile/       # אפליקציית React Native עם בוט צ'אט
```

## תכונות

- 📝 מערכת הרשמה עם AI בעברית
- 💬 בוט צ'אט חכם (LangChain + GPT-4o-mini)
- 📊 אינטגרציה עם Google Sheets
- 📦 בדיקת סטטוס משלוחים
- 🌐 תמיכה ב-Web ו-Mobile

## התקנה מהירה

ראה קובץ [SETUP.md](SETUP.md) להוראות מלאות.

## טכנולוגיות

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

## מבנה הבוט

הבוט משתמש ב-LangChain עם 3 כלים:
1. **googleSheetsTool** - ניהול מידע לקוחות
2. **deliveryStatusTool** - בדיקת סטטוס משלוחים
3. **messageTool** - רישום שיחות

## הרצה

```bash
# 1. שרת הבוט
cd server-node
npm start

# 2. אתר
cd frontend-web
npm start

# 3. מובייל (אופציונלי)
cd frontend-mobile/frontendMobile
npm run android  # או ios
```

## License

MIT

