/**
 * @file Controllers for the /optionGroup routes: the groups of choices a
 * product can offer (e.g. flavors, toppings).
 */
import OptionGroup from '../models/optionGroup.model.js';

/**
 * GET /optionGroup - returns all option groups, sorted by title.
 * @param {import('express').Request} req - The request.
 * @param {import('express').Response} res - 200 with an array of option groups.
 * @param {import('express').NextFunction} next - Receives errors.
 */
const getOptionGroups = async (req, res,next) => {
    try {
        const groups = await OptionGroup.find().sort({ title: 1 });;
        res.status(200).json(groups);
    } catch (err) {
        next(err);
    }
};

/**
 * POST /optionGroup - creates an option group from the add-product page's
 * modal (admin only).
 * @param {import('express').Request} req - Body: the group's fields (validated by optionGroupJoiSchema).
 * @param {import('express').Response} res - 201 with the new group.
 * @param {import('express').NextFunction} next - Receives errors.
 */
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