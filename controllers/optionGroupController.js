import OptionGroup from '../models/optionGroup.js';

// שליפת כל קבוצות התוספות הקיימות במערכת
const getOptionGroups = async (req, res,next) => {
    try {
        const groups = await OptionGroup.find().sort({ title: 1 });;
        res.status(200).json(groups);
    } catch (err) {
        next(err);
    }
};

// יצירת קבוצת תוספות חדשה (דרך המודאל בממשק ניהול)
const createOptionGroup = async (req, res,next) => {
    try {
        const newGroup = new OptionGroup(req.body);
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (err) {
        next(err);
    }
};
export {getOptionGroups,createOptionGroup}