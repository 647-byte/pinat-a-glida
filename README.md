<div dir="rtl">

# 🍦 פינתה גלידה – שרת (API)

שרת ה-API של אתר "פינתה גלידה": חנות אונליין לגלידות, קינוחים ומאכלים.
השרת מנהל משתמשים והתחברות, מוצרים וקבוצות תוספות, הזמנות, העלאת תמונות ושעות פעילות (כולל סגירה בשבתות וחגים).

---

## תוכן עניינים
- [טכנולוגיות](#טכנולוגיות)
- [מבנה הפרויקט](#מבנה-הפרויקט)
- [התקנה והרצה](#התקנה-והרצה)
- [משתני סביבה](#משתני-סביבה)
- [מבנה המידע (MongoDB)](#מבנה-המידע-mongodb)
- [הרשאות והתחברות](#הרשאות-והתחברות)
- [נקודות קצה (API)](#נקודות-קצה-api)
- [חישוב מחירים ומלאי](#חישוב-מחירים-ומלאי)
- [בדיקת נתונים והודעות שגיאה](#בדיקת-נתונים-והודעות-שגיאה)
- [שעות פעילות](#שעות-פעילות)
- [אבטחה](#אבטחה)
- [סקריפטים](#סקריפטים)
- [העלאה לשרת (Render)](#העלאה-לשרת-render)

---

## טכנולוגיות

| תחום | ספרייה |
|---|---|
| שרת | Node.js, ‏Express 5 |
| מסד נתונים | MongoDB Atlas, ‏Mongoose |
| בדיקת נתונים | Joi |
| התחברות | JSON Web Token (`jsonwebtoken`), הצפנת סיסמאות עם `bcrypt` |
| העלאת תמונות | Multer, ‏Cloudinary (`multer-storage-cloudinary`) |
| לוח שנה עברי | `@hebcal/core` (זמני שבתות וחגים) |
| הגבלת קצב בקשות | `express-rate-limit` |
| גישה מהדפדפן | `cors` |

הפרויקט כתוב ב-ES Modules (`"type": "module"`).

---

## מבנה הפרויקט

</div>

```
pinat-a-glida/
├── app.js                  # Entry point: middlewares, routes, server start
├── config/
│   ├── db.js               # MongoDB connection
│   ├── env.js              # All environment variables in one place
│   └── cloudinary.js       # Cloudinary client
├── routes/                 # URL → middlewares → controller
│   ├── index.route.js
│   ├── user.route.js
│   ├── product.route.js
│   ├── optionGroup.route.js
│   ├── order.route.js
│   └── upload.router.js
├── controllers/            # Request handlers
├── services/               # Business logic (order pricing, user lookups)
├── models/                 # Mongoose schemas
├── validators/             # Joi schemas + Hebrew validation messages
├── middlewares/            # Auth, validation, errors, rate limits, opening hours, upload
├── utils/token.js          # JWT creation
└── scripts/                # One-time scripts (admin seed, data migration)
```

<div dir="rtl">

**זרימת בקשה:** ‏`route` ← בדיקת התחברות והרשאה ← בדיקת נתונים (Joi) ← `controller` ← (`service`) ← `model`.
כל שגיאה, בכל שלב, עוברת ל-`errorHandler` ומוחזרת ללקוח בפורמט אחיד.

---

## התקנה והרצה

**דרישות:** ‏Node.js בגרסה 20.6 ומעלה (בשביל `--env-file`), וחשבונות ב-MongoDB Atlas וב-Cloudinary.

1. התקנת החבילות:

</div>

```bash
npm install
```

<div dir="rtl">

2. יצירת קובץ בשם `.env` בתיקייה הראשית (ליד `app.js`), עם התוכן הבא. במקום כל ערך לדוגמה כותבים את הערך האמיתי (הסבר על כל משתנה בסעיף [משתני סביבה](#משתני-סביבה)):

</div>

```env
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>
PORT=5000
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
ORDER_OPENING_TIME=10:00
ORDER_CLOSING_TIME=22:00
CLIENT_URL=http://127.0.0.1:5500
ADMIN_NAME=<admin-name>
ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD=<admin-password>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

<div dir="rtl">

3. יצירת משתמש מנהל ראשון (פעם אחת):

</div>

```bash
npm run seed
```

<div dir="rtl">

4. הרצת השרת בפיתוח (נטען מחדש בכל שמירה):

</div>

```bash
npm run dev
```

<div dir="rtl">

כשהשרת עולה מופיעות ההודעות `success` (חיבור למסד הנתונים) ו-`server running <PORT>`.

---

## משתני סביבה

הקובץ `.env` **לא** עולה ל-GitHub (הוא מופיע ב-`.gitignore`). כל המשתנים נקראים במקום אחד: `config/env.js`.

| משתנה | תיאור | דוגמה |
|---|---|---|
| `MONGO_URL` | כתובת החיבור ל-MongoDB Atlas | `mongodb+srv://...` |
| `PORT` | הפורט שהשרת מאזין לו | `5000` |
| `JWT_SECRET` | מפתח סודי לחתימת הטוקנים | מחרוזת ארוכה ואקראית |
| `JWT_EXPIRES_IN` | תוקף הטוקן | `7d` |
| `ORDER_OPENING_TIME` | שעת פתיחה להזמנות | `10:00` |
| `ORDER_CLOSING_TIME` | שעת סגירה להזמנות | `22:00` |
| `CLIENT_URL` | כתובת אתר הלקוח (CORS), בלי `/` בסוף | `http://127.0.0.1:5500` |
| `ADMIN_NAME` | שם המנהל הראשון (לסקריפט `seed`) | |
| `ADMIN_EMAIL` | אימייל המנהל הראשון | |
| `ADMIN_PASSWORD` | סיסמת המנהל הראשון | |
| `CLOUDINARY_CLOUD_NAME` | שם החשבון ב-Cloudinary | |
| `CLOUDINARY_API_KEY` | מפתח ה-API של Cloudinary | |
| `CLOUDINARY_API_SECRET` | הסוד של Cloudinary | |

---

## מבנה המידע (MongoDB)

ארבעה אוספים (collections) ב-MongoDB Atlas. המודלים נמצאים בתיקייה `models`, ולכל אוסף יש גם `createdAt` ו-`updatedAt` אוטומטיים.

### `users` – משתמשים

| שדה | סוג | הערות |
|---|---|---|
| `name` | String | חובה |
| `email` | String | חובה, ייחודי, נשמר באותיות קטנות |
| `password` | String | חובה, מוצפן ב-bcrypt (`pre('save')`), לא נשלח ללקוח (`toJSON`) |
| `phone` | String | לא חובה |
| `role` | String | `customer` (ברירת מחדל) או `admin` |

### `optiongroups` – קבוצות תוספות

| שדה | סוג | הערות |
|---|---|---|
| `title` | String | חובה, למשל "טעמים", "תוספות" |
| `choices` | [String] | הבחירות בקבוצה |
| `maxChoices` | Number | כמה בחירות כלולות במחיר |
| `pricePer` | Number | מחיר לכל בחירה נוספת |
| `isMust` | Boolean | האם חובה לבחור לפחות אחת |
| `limitedBySize` | Boolean | האם מספר הבחירות נקבע לפי הגודל |

### `products` – מוצרים

| שדה | סוג | הערות |
|---|---|---|
| `name` | String | חובה, ייחודי |
| `price` | Number | מחיר בסיס |
| `description` | String | |
| `imageUrl` | String | חובה, כתובת התמונה ב-Cloudinary |
| `size` | [{ name, price, maxChoices }] | גדלים, אם יש |
| `options` | [ObjectId → `optiongroups`] | קבוצות התוספות של המוצר |
| `quantity` | Number / null | מלאי. `null` למוצר שלא נספר ביחידות |
| `isAvailable` | Boolean | זמין או אזל |
| `isPopular` | Boolean | מוצג בדף הבית |

### `orders` – הזמנות

| שדה | סוג | הערות |
|---|---|---|
| `userId` | ObjectId → `users` | הלקוחה שהזמינה |
| `items` | [פריט] | לכל פריט: `productId` (← `products`), שם, מחיר ליחידה, כמות, גודל ובחירות |
| `customerDetails` | אובייקט | שם פרטי ומשפחה, טלפון, וכתובת (עיר, רחוב, מספר בית) |
| `totalPrice` | Number | מחושב בשרת |
| `comments` | String | לא חובה |
| `statusOrder` | String | `pending`, ‏`preparing`, ‏`on_the_way`, ‏`delivered` |

### הקשרים בין האוספים

</div>

```
users ──< orders >── products >──< optiongroups
 (a user has many orders; an order has many products;
  a product has many option groups, and a group can belong to many products)
```

<div dir="rtl">

- **מוצר ← קבוצות תוספות:** קשר של רבים-לרבים, דרך מערך המזהים `options` (ושליפה עם `populate`).
- **הזמנה ← משתמש:** כל הזמנה שייכת למשתמש אחד (`userId`).
- **הזמנה ← מוצרים:** כל פריט מצביע על מוצר (`productId`), אבל **שומר גם עותק** של השם, המחיר, הגודל והבחירות. כך הזמנות ישנות נשארות נכונות גם אם המוצר שונה או נמחק.

---

## הרשאות והתחברות

- אחרי הרשמה או התחברות, השרת מחזיר `{ user, token }`.
- בכל בקשה שדורשת התחברות, הלקוח שולח: `Authorization: Bearer <token>`.
- הטוקן מכיל את מזהה המשתמש ואת התפקיד שלו. **התפקיד נקרא מחדש ממסד הנתונים בכל בקשה,** כך ששינוי תפקיד נכנס לתוקף מיד.
- יש שני תפקידים: `customer` (לקוח) ו-`admin` (מנהל). בהרשמה התפקיד הוא תמיד `customer`.
- הסיסמה מוצפנת לפני השמירה (bcrypt), ולעולם לא נשלחת ללקוח.

---

## נקודות קצה (API)

**מקרא:** 🌐 ציבורי · 🔑 משתמש מחובר · 👑 מנהל בלבד

### משתמשים – `/users`

| שיטה | נתיב | הרשאה | תיאור |
|---|---|---|---|
| POST | `/users/register` | 🌐 | הרשמה (שם, אימייל, סיסמה, טלפון אופציונלי) |
| POST | `/users/login` | 🌐 | התחברות |
| GET | `/users/me` | 🔑 | הפרטים שלי |
| PATCH | `/users/me` | 🔑 | עדכון הפרטים שלי |
| GET | `/users` | 👑 | כל המשתמשים, מהחדש לישן |
| GET | `/users/:id` | 👑 | משתמש אחד |
| DELETE | `/users/:id` | 👑 | מחיקת לקוח (לא מנהל, ולא משתמש שיש לו הזמנות) |
| PATCH | `/users/:id/role` | 👑 | שינוי תפקיד (לא של עצמך) |

### מוצרים – `/products`

| שיטה | נתיב | הרשאה | תיאור |
|---|---|---|---|
| GET | `/products` | 🌐 | כל המוצרים, עם קבוצות התוספות שלהם |
| GET | `/products/popular` | 🌐 | המוצרים הפופולריים לדף הבית |
| GET | `/products/:id` | 🌐 | מוצר אחד |
| POST | `/products` | 👑 | הוספת מוצר |
| PUT | `/products/:id` | 👑 | עדכון מוצר |
| PATCH | `/products/:id` | 👑 | עדכון מלאי: `quantity` **מתווסף** למלאי הקיים, או `isAvailable` למוצר בלי כמות |
| DELETE | `/products/:id` | 👑 | מחיקת מוצר |

### קבוצות תוספות – `/optionGroup`

| שיטה | נתיב | הרשאה | תיאור |
|---|---|---|---|
| GET | `/optionGroup` | 🌐 | כל הקבוצות (למשל: טעמים, תוספות) |
| POST | `/optionGroup` | 👑 | יצירת קבוצה |

### הזמנות – `/orders`

| שיטה | נתיב | הרשאה | תיאור |
|---|---|---|---|
| POST | `/orders` | 🔑 | ביצוע הזמנה, רק בשעות הפעילות |
| GET | `/orders/my` | 🔑 | ההזמנות שלי, מהחדשה לישנה |
| GET | `/orders/:id` | 🔑 | הזמנה אחת (לקוחה רואה רק את שלה) |
| GET | `/orders` | 👑 | כל ההזמנות |
| GET | `/orders/user/:userId` | 👑 | ההזמנות של משתמש |
| PATCH | `/orders/:id/status` | 👑 | עדכון סטטוס: `pending`, ‏`preparing`, ‏`on_the_way`, ‏`delivered` |

### העלאת תמונות – `/upload`

| שיטה | נתיב | הרשאה | תיאור |
|---|---|---|---|
| POST | `/upload` | 👑 | העלאת תמונה אחת בשדה `imageUrl` (jpg, ‏jpeg, ‏png, ‏webp, עד 5MB). מחזיר `{ imageUrl }` מ-Cloudinary |

**דוגמה: גוף בקשה להזמנה.** הלקוח שולח רק את הבחירות, בלי מחירים:

</div>

```json
{
  "items": [
    {
      "productId": "665f1c2e8b3a4d0012ab34cd",
      "quantity": 2,
      "size": { "name": "קופסה קטנה (חצי קילו)" },
      "options": [
        { "optionId": "665f1c2e8b3a4d0012ab3500", "selectedChoices": ["וניל", "שוקולד"] }
      ]
    }
  ],
  "customerDetails": {
    "firstName": "דינה",
    "lastName": "כהן",
    "phone": "0501234567",
    "address": { "city": "ירושלים", "street": "הרצל", "numberHouse": "3" }
  },
  "comments": "בלי קצפת"
}
```

<div dir="rtl">

---

## חישוב מחירים ומלאי

כל המחירים מחושבים **בשרת** (`services/order.service.js`), ולא נלקחים מהלקוח:

1. **מחיר בסיס:** מחיר המוצר, או מחיר הגודל שנבחר אם למוצר יש גדלים.
2. **תוספות:** בכל קבוצה, `maxChoices` בחירות כלולות במחיר, וכל בחירה נוספת עולה `pricePer`.
3. **הגבלה לפי גודל:** בקבוצה עם `limitedBySize` (למשל טעמים), מספר הבחירות נקבע לפי `maxChoices` של הגודל שנבחר.
4. **בדיקות:** המוצר קיים וזמין, הגודל והבחירות קיימים, נבחרו קבוצות החובה, ויש מספיק מלאי.
5. **מלאי:** אחרי שההזמנה נשמרת, המלאי יורד. מוצר שהמלאי שלו הגיע ל-0 מסומן "אזל". מוצר עם `quantity: null` הוא מוצר בלי ניהול כמות, כי הוא לא נספר ביחידות (למשל גלידה במשקל או שייק). את הזמינות שלו המנהלת מסמנת ידנית: "במלאי" או "אזל".

כל פריט בהזמנה שומר עותק של שם המוצר, המחיר, הגודל והבחירות. לכן הזמנות ישנות נשארות נכונות גם אם המוצר שונה או נמחק.

---

## בדיקת נתונים והודעות שגיאה

- כל גוף בקשה נבדק עם סכמת Joi (בתיקייה `validators`), דרך `integrityCheck`.
- **הודעות הבדיקה בעברית,** עם שם השדה בעברית (`validators/validationMessages.js`). למשל: `השדה "מחיר הגודל" חייב להיות 0 או יותר`.
- כל מזהה בנתיב (`:id`) נבדק כמזהה MongoDB תקין לפני שמגיעים ל-controller.

**כל שגיאה מוחזרת באותו פורמט:**

</div>

```json
{ "success": false, "type": "validation_error", "message": "השדה \"שם\" הוא חובה" }
```

<div dir="rtl">

| `type` | סטטוס | מתי |
|---|---|---|
| `validation_error` | 400 | נתונים לא תקינים (Joi) |
| `bad_request` | 400 | בקשה לא תקינה (מזהה, מוצר, מלאי וכו') |
| `unauthorized` | 401 | לא מחוברים, או שהטוקן לא תקף |
| `forbidden` | 403 | אין הרשאה |
| `not_activity` | 403 | מחוץ לשעות הפעילות, או בשבת וחג |
| `not_found` | 404 | הפריט או הנתיב לא נמצאו |
| `conflict` | 409 | אימייל שכבר רשום |
| `too_many_requests` | 429 | יותר מדי בקשות |
| `server error` | 500 | שגיאה פנימית. הלקוח מקבל הודעה כללית, והפרטים נרשמים בקונסול של השרת |

---

## שעות פעילות

- **שבתות וחגים:** כל האתר סגור, מ-15 דקות לפני הדלקת נרות ועד 15 דקות אחרי ההבדלה, לפי זמני תל אביב (`@hebcal/core`).
- **הזמנות:** מתקבלות רק בין `ORDER_OPENING_TIME` ל-`ORDER_CLOSING_TIME`, ולא בשעה שלפני כניסת שבת או חג.
- בשני המקרים התשובה היא `type: "not_activity"`, והלקוח מציג הודעת "האתר סגור".

---

## אבטחה

- סיסמאות מוצפנות עם bcrypt, ולא נשלחות ללקוח אף פעם.
- כל פעולות הניהול מוגנות ב-`authenticate` + ‏`authorize("admin")`.
- **הגבלת קצב:** עד 300 בקשות ב-15 דקות לכל כתובת IP, ועד 10 ניסיונות **כושלים** של התחברות או הרשמה ב-15 דקות.
- **CORS:** רק אתר הלקוח (`CLIENT_URL`) יכול לפנות לשרת מהדפדפן.
- שגיאות פנימיות לא חושפות פרטים טכניים ללקוח.
- הסודות נמצאים רק ב-`.env`, שלא עולה ל-GitHub.

---

## סקריפטים

| פקודה | מה עושה |
|---|---|
| `npm start` | הרצת השרת בייצור (בלי `.env`. המשתנים מגיעים מהגדרות השרת) |
| `npm run dev` | הרצה בפיתוח, עם `.env` וטעינה מחדש בכל שמירה |
| `npm run seed` | יצירת המנהל הראשון, או קידום משתמש קיים למנהל. בטוח להריץ שוב |
| `npm run migrate:size-limits` | הגירה חד-פעמית: מסמנת את קבוצת "טעמים" כמוגבלת לפי גודל |

---

## העלאה לשרת (Render)

1. יוצרים ב-Render שירות חדש מסוג **Web Service**, ומחברים אותו לריפו ב-GitHub.
2. בשדה פקודת ההתקנה (**Build Command**) כותבים: `npm install`
3. בשדה פקודת ההפעלה (**Start Command**) כותבים: `npm start`
4. בלשונית **Environment** מגדירים את כל המשתנים מהטבלה למעלה, ובנוסף:
   - המשתנה `TZ` עם הערך `Asia/Jerusalem`, כדי ששעות ההזמנה יחושבו לפי שעון ישראל.
   - המשתנה `CLIENT_URL` עם הכתובת של אתר הלקוח אחרי ההעלאה, בלי `/` בסוף.
5. ב-MongoDB Atlas, תחת **Network Access**, מאפשרים גישה מהשרת של Render.
6. אחרי ההעלאה, מעדכנים את `SERVER_URL` בקובץ `config.js` של הלקוח לכתובת השרת ב-Render.

</div>
