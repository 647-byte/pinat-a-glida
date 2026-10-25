/**
 * @file Hebrew messages for Joi validation errors.
 * Joi's built-in messages are in English and use the field's key
 * (e.g. "price" must be greater than or equal to 0). This module turns each
 * error detail into a Hebrew message with a readable field name, so the
 * client can show it to the user as is.
 */

/**
 * Hebrew display names for the fields used in the validators.
 * A key can be a field name ('price') or a path without array indexes
 * ('size.price') for a field whose meaning depends on where it appears.
 */
const FIELD_LABELS = {
    // Users
    name: 'שם',
    email: 'אימייל',
    password: 'סיסמה',
    phone: 'טלפון',
    role: 'תפקיד',
    // Products
    price: 'מחיר',
    'size.name': 'שם הגודל',
    'size.price': 'מחיר הגודל',
    'size.maxChoices': 'מספר הבחירות בגודל',
    description: 'תיאור',
    imageUrl: 'תמונה',
    isAvailable: 'זמינות',
    quantity: 'כמות',
    size: 'גדלים',
    options: 'קבוצות תוספות',
    isPopular: 'מוצר פופולרי',
    // Option groups
    title: 'שם הקבוצה',
    isMust: 'בחירת חובה',
    maxChoices: 'מספר בחירות',
    pricePer: 'מחיר לבחירה נוספת',
    limitedBySize: 'הגבלה לפי גודל',
    choices: 'בחירות',
    // Orders
    items: 'פריטים',
    'items.size.name': 'גודל',
    productId: 'מוצר',
    optionId: 'קבוצת תוספות',
    selectedChoices: 'בחירות',
    customerDetails: 'פרטי לקוח',
    firstName: 'שם פרטי',
    lastName: 'שם משפחה',
    address: 'כתובת',
    city: 'עיר',
    street: 'רחוב',
    numberHouse: 'מספר בית',
    comments: 'הערות'
};

/**
 * Message builders by Joi error type. Each gets the field's Hebrew name and
 * the error context (e.g. context.limit for min rules).
 * @type {Object<string, function(string, Object): string>}
 */
const MESSAGES = {
    'any.required': (label) => `השדה "${label}" הוא חובה`,
    'any.only': (label) => `הערך בשדה "${label}" אינו מותר`,
    'string.base': (label) => `השדה "${label}" חייב להיות טקסט`,
    'string.empty': (label) => `השדה "${label}" לא יכול להיות ריק`,
    'string.min': (label, { limit }) => `השדה "${label}" חייב להכיל לפחות ${limit} תווים`,
    'string.email': () => 'כתובת האימייל אינה תקינה',
    'string.pattern.base': (label) => `השדה "${label}" אינו בפורמט תקין`,
    'string.hex': (label) => `המזהה בשדה "${label}" אינו תקין`,
    'string.length': (label) => `המזהה בשדה "${label}" אינו תקין`,
    'number.base': (label) => `השדה "${label}" חייב להיות מספר`,
    'number.min': (label, { limit }) => `השדה "${label}" חייב להיות ${limit} או יותר`,
    'number.integer': (label) => `השדה "${label}" חייב להיות מספר שלם`,
    'boolean.base': (label) => `השדה "${label}" חייב להיות כן או לא`,
    'array.base': (label) => `השדה "${label}" חייב להיות רשימה`,
    'array.min': (label, { limit }) => `השדה "${label}" חייב להכיל לפחות ${limit} ערכים`,
    'array.unique': (label) => `יש כפילות בשדה "${label}"`,
    'object.base': (label) => `השדה "${label}" אינו תקין`,
    'object.min': () => 'יש לשלוח לפחות שדה אחד לעדכון',
    'object.unknown': (label) => `השדה "${label}" אינו מוכר`
};

/**
 * Returns the Hebrew name of the field an error refers to. The most specific
 * name wins: first the full path without array indexes, then the field's own
 * key. Keys without a Hebrew name are returned as is.
 * @example getFieldLabel(['size', 0, 'price']) // 'size.price' -> 'מחיר הגודל'
 * @example getFieldLabel(['price'])            // 'price'      -> 'מחיר'
 * @param {Array<string|number>} path - The error's path in the body (not empty).
 * @returns {string} The field's display name.
 */
const getFieldLabel = (path) => {
    const keys = path.filter(part => typeof part === 'string');
    const fullPath = keys.join('.');
    const key = keys[keys.length - 1];
    return FIELD_LABELS[fullPath] ?? FIELD_LABELS[key] ?? key;
};

/**
 * Translates one Joi error detail into Hebrew. Unknown error types get a
 * general "invalid field" message rather than Joi's English one, and errors
 * on the whole body (e.g. a missing body) get a general request message.
 * @param {{ type: string, path: Array<string|number>, context?: Object }} detail - A Joi error detail.
 * @returns {string} The Hebrew message.
 */
const translateDetail = ({ type, path, context = {} }) => {
    if (path.length === 0 && type !== 'object.min') return 'לא נשלחו נתונים תקינים';
    const label = getFieldLabel(path);
    const buildMessage = MESSAGES[type];
    return buildMessage ? buildMessage(label, context) : `השדה "${label}" אינו תקין`;
};

/**
 * Builds one Hebrew message from all the details of a Joi validation error.
 * Repeated messages (e.g. the same rule failing in two sizes) appear once.
 * @param {import('joi').ValidationError} error - The error returned by schema.validate.
 * @returns {string} The messages, joined with a comma and a new line.
 */
const formatValidationError = (error) => {
    const messages = error.details.map(translateDetail);
    return [...new Set(messages)].join(',\n');
};

export { formatValidationError };