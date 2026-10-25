/**
 * @file Opening-hours middlewares. The site is closed on Shabbat and holidays
 * (times from @hebcal/core for Tel Aviv), and orders are accepted only
 * during opening hours. Both respond with type "not_activity", which the
 * client shows as the "site closed" notice.
 */
import { Location, HDate, HebrewCalendar } from "@hebcal/core";
/**
 * Returns the candle-lighting and havdalah events from 3 days ago to
 * tomorrow, enough to cover a holiday that started before today.
 * @returns {Array<Object>} The Hebrew calendar events.
 */
const getDailyEvents = () => {
    const now = new Date();
    const startHebrewDate = new HDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000));
    const endHebrewDate = new HDate(new Date(now.getTime() + 24 * 60 * 60 * 1000));
    const location = Location.lookup("Tel Aviv");
    const obj = {
        start: startHebrewDate,
        end: endHebrewDate,
        candlelighting: true,
        location: location,
        il: true
    }
    return HebrewCalendar.calendar(obj);
}
/** Today's events, calculated once a day (see isShabbatOrHolidayNow). */
let arrDailyEvents = getDailyEvents();
let dateToday = new Date().toDateString();
/**
 * Tells whether now is during Shabbat or a holiday, between candle lighting
 * and havdalah, widened by a margin on both sides.
 * @param {number} space - Margin in milliseconds.
 * @returns {boolean} True during Shabbat or a holiday.
 */
const isShabbatOrHolidayNow = (space) => {
    let inEvent = false;
    const now = new Date();
    if (dateToday !== now.toDateString()) {
        arrDailyEvents = getDailyEvents();
        dateToday = new Date().toDateString();
    }
    for (const ev of arrDailyEvents) {
        if (!ev.eventTime) continue;
        const time = ev.eventTime.getTime();
        const nowTime = new Date().getTime();
        if (ev.constructor.name === "CandleLightingEvent") {
            if (nowTime + space >= time)
                inEvent = true;
            else return inEvent;

        }
        if (ev.constructor.name === "HavdalahEvent") {
            if (time + space >= nowTime) {
                return true;
            }
            inEvent = false;
        }
    }
    return inEvent;
}
/**
 * Blocks every request during Shabbat and holidays (with a 15-minute margin).
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - The response.
 * @param {import('express').NextFunction} next - Continues, or receives a 403 "not_activity" error.
 */
const operatingHoursMiddleware = (req, res, next) => {
    try {
        const space = 15 * 60 * 1000;
        if (isShabbatOrHolidayNow(space)) {
            const error = new Error("האתר אינו פעיל בשבתות וחגים");
            error.status = 403;
            error.type = "not_activity";
            return next(error);
        }
        next();
    }
    catch (err) {
        next(err);
    }
}
/**
 * Creates a middleware that accepts orders only between the opening and
 * closing times, and not within an hour of Shabbat or a holiday.
 * Times are compared in the server's time zone (set TZ on the server).
 * @param {string} [timeOpening="10:00"] - Opening time, HH:MM.
 * @param {string} [timeClosed="22:00"] - Closing time, HH:MM.
 * @returns {import('express').RequestHandler} The middleware.
 */
const orderHoursMiddleware = (timeOpening="10:00", timeClosed="22:00") => {
    return (req, res, next) => {
        try {
            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5);
            const space = 60 * 60 * 1000;
            if (currentTime < timeOpening || currentTime >= timeClosed || isShabbatOrHolidayNow(space)) {
                const error = new Error(`שעות הפעילות הינן ${timeOpening}-${timeClosed}`);
                error.status = 403;
                error.type = "not_activity";
                return next(error);
            }
            next();
        } catch (err) {
            next(err);
        }
    }
}
export {operatingHoursMiddleware,orderHoursMiddleware};