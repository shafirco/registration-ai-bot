# מדריך בוט צ'אט למובייל - A.B Deliveries

## מה נוסף?

בוט צ'אט זהה לגמרי לגרסת האתר, מותאם למובייל! 💬📱

## תכונות הבוט במובייל

✅ **כפתור צף** - בפינה ימין למטה  
✅ **חלון מלא** - פותח מודאל על כל המסך  
✅ **תמיכה בעברית** - מדבר רק עברית  
✅ **שמירת נתונים** - AsyncStorage שומר שם וטלפון  
✅ **אנימציות חלקות** - חוויית משתמש מעולה  
✅ **תמיכה ב-iOS ו-Android**  

## התקנה

### 1. התקן את החבילה החסרה

```bash
cd frontend-mobile/frontendMobile
npm install @react-native-async-storage/async-storage
```

### 2. הרץ את האפליקציה

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web (לבדיקה):**
```bash
npm run web
```

## ⚠️ חשוב! חיבור לשרת

הבוט צריך להתחבר לשרת Node.js שלך על פורט 4000.

### כתובות לפי מכשיר:

בקובץ `components/ChatBot.tsx`, שורה 95, יש להחליף את הכתובת:

#### Android Emulator:
```typescript
const response = await fetch('http://10.0.2.2:4000/agent/chat', {
```

#### iOS Simulator:
```typescript
const response = await fetch('http://localhost:4000/agent/chat', {
```

#### מכשיר פיזי (שני המכשיר והמחשב על אותה רשת):
```typescript
// מצא את ה-IP של המחשב שלך (ipconfig / ifconfig)
const response = await fetch('http://192.168.1.100:4000/agent/chat', {
```

**איך למצוא את ה-IP של המחשב?**

Windows:
```bash
ipconfig
# חפש IPv4 Address
```

Mac/Linux:
```bash
ifconfig
# או
ip addr show
```

## הרצת השרת

**לפני שמריצים את האפליקציה, יש להריץ את שרת הבוט:**

```bash
cd server-node
npm start
```

אמור לראות:
```
🚀 Node server running on port 4000
```

## מבנה הקבצים

```
frontend-mobile/frontendMobile/
├── components/
│   └── ChatBot.tsx              ← קומפוננט הבוט
├── app/(tabs)/
│   └── index.tsx                ← (עודכן - כולל את הבוט)
├── package.json                 ← (עודכן - AsyncStorage)
└── CHATBOT_MOBILE_GUIDE.md     ← מדריך זה
```

## איך זה עובד?

1. **כפתור צף** מופיע בפינה ימין למטה
2. **לחיצה** פותחת מודאל מלא
3. **פעם ראשונה** - משתמש מזין שם וטלפון
4. **AsyncStorage** שומר את הפרטים
5. **שיחה** - הודעות נשלחות לשרת ומוצגות

## דוגמאות לבדיקה

נסה להקליד:
- "שלום!"
- "אני רוצה לבדוק משלוח 12345"
- "מה המחיר למשלוח?"

## פתרון בעיות

### 1. הבוט לא מופיע
```bash
# ודא שהתקנת את החבילה
npm install @react-native-async-storage/async-storage

# נקה cache
npm start -- --clear
```

### 2. שגיאת Network Request Failed
- ✅ ודא ששרת הבוט רץ על פורט 4000
- ✅ בדוק את הכתובת ב-`ChatBot.tsx` שורה 95
- ✅ במכשיר פיזי - ודא ששני המכשירים על אותה רשת
- ✅ במכשיר פיזי - כבה חומת אש אם צריך

### 3. אין תגובה מהבוט
- ✅ בדוק את לוגים בטרמינל של השרת
- ✅ ודא שה-.env מוגדר נכון
- ✅ בדוק שיש OPENAI_API_KEY

### 4. בעיות ב-AsyncStorage
```bash
# Android - נקה את האפליקציה
adb shell pm clear com.anonymous.frontendmobile

# iOS - מחק את האפליקציה והתקן מחדש
```

## בדיקת חיבור לשרת

לפני שמתחילים:

```bash
# בדוק ששרת הבוט רץ
curl http://localhost:4000/random-message

# או מהמכשיר (החלף את ה-IP)
curl http://YOUR_COMPUTER_IP:4000/random-message
```

אם מקבל JSON - השרת עובד! ✅

## הבדלים מגרסת האתר

### Web Version:
- `localStorage` לשמירת נתונים
- `position: fixed` לכפתור
- מתאים למסכים רחבים

### Mobile Version:
- `AsyncStorage` לשמירת נתונים
- `Modal` בשביל חלון הצ'אט
- `KeyboardAvoidingView` למקלדת
- מתאים למסכי טאצ'
- אנימציות Native

## איפוס הבוט

לחץ על כפתור 🔄 בכותרת כדי:
- למחוק שם וטלפון
- לאפס את השיחה
- להתחיל מחדש

## טיפים למפתחים

### 1. Debug Mode
הוסף console.log לראות מה קורה:

```typescript
console.log('Sending message:', userMessage);
console.log('Response:', data);
```

### 2. בדיקה על Web
```bash
npm run web
```
טוב לבדיקות מהירות!

### 3. Hot Reload
שינויים בקוד יתעדכנו אוטומטית בזמן פיתוח.

## התאמה אישית

### שינוי צבעים

ערוך `components/ChatBot.tsx`:

```typescript
chatButtonInner: {
  backgroundColor: '#4a90e2', // ← שנה כאן
},
chatHeader: {
  backgroundColor: '#4a90e2', // ← שנה כאן
},
```

### שינוי גובה החלון

```typescript
chatWindow: {
  height: '90%', // ← שנה כאן (70%, 80%, 100%)
},
```

### שינוי הודעות מהירות

```typescript
<TouchableOpacity
  style={styles.quickButton}
  onPress={() => setQuickMessage('ההודעה שלך כאן')}
>
  <Text style={styles.quickButtonText}>📦 הטקסט על הכפתור</Text>
</TouchableOpacity>
```

## אבטחה

**חשוב:** אל תשמור מפתחות API באפליקציה!
- ✅ כל הבקשות עוברות דרך השרת
- ✅ המפתחות נשארים ב-.env בשרת
- ✅ האפליקציה רק שולחת הודעות

## זרימת נתונים

```
משתמש לוחץ על הכפתור
    ↓
מזין שם וטלפון (פעם אחת)
    ↓
AsyncStorage שומר
    ↓
כותב הודעה
    ↓
שליחה ל-server-node/agent/chat
    ↓
LangChain + GPT-4o-mini
    ↓
תשובה בעברית
    ↓
הצגה באפליקציה
```

## Performance

הבוט מותאם ל:
- ⚡ טעינה מהירה
- 📱 חיסכון בסוללה
- 🎨 אנימציות חלקות
- 💾 שימוש מינימלי בזיכרון

## תמיכה בפלטפורמות

- ✅ Android (Emulator & Physical)
- ✅ iOS (Simulator & Physical)
- ✅ Web (דרך Expo)

## בשלב Production

כשמפרסמים:
1. החלף את כתובת ה-API לכתובת אמיתית
2. הוסף אימות משתמשים
3. הוסף error tracking (Sentry)
4. הוסף analytics
5. בדוק ביצועים

---

**הבוט מוכן לשימוש! 🚀**

הרץ:
1. `server-node/npm start` (פורט 4000)
2. `frontendMobile/npm run android` או `npm run ios`

ותיהנה מבוט עברית חכם במובייל! 🎉

