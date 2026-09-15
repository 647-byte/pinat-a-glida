import { Location, HDate, HebrewCalendar } from "@hebcal/core";
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
let arrDailyEvents = getDailyEvents();
let dateToday = new Date().toDateString();
const isShabbatOrHolidayNow = (space) => {
    let inEvent = false;
    const now = new Date();
    if (dateToday !== now.toDateString()) {
        arrDailyEvents = getDailyEvents();
        dateToday = new Date().toDateString();
    }
    for (const ev of arrDailyEvents) {
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