# הדרכת התקנה והפעלה

## דרישות

- Node.js (v18+)
- Python 3.8+
- npm
- חשבון OpenAI עם API Key

## שלב 1: התקנת חבילות

### Server Node (הבוט):
```bash
cd server-node
npm install
```

### Frontend Web:
```bash
cd frontend-web
npm install
```

### Frontend Mobile (אופציונלי):
```bash
cd frontend-mobile/frontendMobile
npm install
```

### Server Python (אופציונלי):
```bash
cd server-python
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

## שלב 2: הגדרת קובץ .env

צור קובץ `.env` בתיקיית `server-node/`:

```env
# חובה!
OPENAI_API_KEY=sk-your-openai-key-here

# אופציונלי (לGoogle Sheets)
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### איך לקבל OpenAI API Key?
1. לך ל-https://platform.openai.com/api-keys
2. צור API Key חדש
3. העתק והדבק ל-.env

### Google Sheets (אופציונלי)
אם רוצה אינטגרציה עם Google Sheets:
1. צור Google Cloud Project
2. הפעל Google Sheets API
3. צור Service Account
4. שתף את ה-Spreadsheet עם ה-Service Account
5. העתק את ה-JSON Key ל-.env

## שלב 3: קומפילציה של TypeScript

**חשוב!** הבוט כתוב ב-TypeScript וצריך לקמפל אותו:

```bash
cd server-node
npm run build
```

זה יוצר תיקיית `dist/` עם קבצי JavaScript.

**כל פעם שמשנים קוד ב-`agent/`**, צריך לרוץ:
```bash
npm run build
```

## שלב 4: הפעלה

### הרץ את שרת הבוט (חובה!):
```bash
cd server-node
npm start
```

אמור לראות: `🚀 Node server running on port 4000`

### הרץ את האתר:
בטרמינל נפרד:
```bash
cd frontend-web
npm start
```

האתר יפתח ב-`http://localhost:3000`

תראה כפתור צף 💬 בפינה ימין למטה!

### הרץ מובייל (אופציונלי):
בטרמינל נפרד:
```bash
cd frontend-mobile/frontendMobile
npm run android  # או npm run ios
```

**חשוב למובייל:** שנה את כתובת השרת בקובץ:
`components/ChatBot.tsx` שורה 95

- Android Emulator: `http://10.0.2.2:4000/agent/chat`
- iOS Simulator: `http://localhost:4000/agent/chat`
- מכשיר פיזי: `http://YOUR_IP:4000/agent/chat`

## בדיקה מהירה

אחרי שהשרת רץ, נסה:
```bash
curl http://localhost:4000/random-message
```

אמור לקבל תשובה JSON בעברית.

## פתרון בעיות

### 1. הבוט לא מגיב / שגיאה
```bash
# בדוק שהשרת רץ
curl http://localhost:4000/random-message

# קומפל את TypeScript מחדש
cd server-node
npm run build

# אתחל את השרת
npm start
```

### 2. חסר .env
```bash
cd server-node
# צור קובץ .env עם OPENAI_API_KEY
```

### 3. שגיאות בקומפילציה
```bash
cd server-node
npm install
npm run build
```

### 4. הכפתור לא מופיע באתר
- רענן את העמוד
- פתח Console (F12) וחפש שגיאות

## תזרים עבודה רגיל

1. **פתח 2 טרמינלים:**
   - טרמינל 1: `cd server-node && npm start`
   - טרמינל 2: `cd frontend-web && npm start`

2. **אם משנה קוד בבוט:**
   ```bash
   cd server-node
   npm run build
   # Ctrl+C בטרמינל השרת
   npm start
   ```

3. **אם משנה קוד באתר:**
   - שמירה תעדכן אוטומטית (Hot Reload)

## מה הבוט יודע?

- ✅ לדבר עברית בלבד
- ✅ לבדוק סטטוס משלוחים (12345, 67890)
- ✅ לשמור מידע לקוחות ב-Google Sheets
- ✅ לרשום שיחות
- ✅ לעודד הזמנות חדשות

## נתונים לדוגמה

משלוחים לבדיקה:
- מספר משלוח: **12345** (בדרך)
- מספר משלוח: **67890** (נמסר)

## סיכום מהיר

```bash
# התקנה (פעם אחת)
cd server-node && npm install
cd ../frontend-web && npm install

# צור .env עם OPENAI_API_KEY

# קומפל (פעם אחת או אחרי שינויים ב-agent/)
cd server-node && npm run build

# הרצה (כל פעם)
Terminal 1: cd server-node && npm start
Terminal 2: cd frontend-web && npm start

# גלוש ל: http://localhost:3000
# לחץ על 💬
```

זהו! 🚀

