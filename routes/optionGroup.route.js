import { Router } from "express";
import { createOptionGroup, getOptionGroups } from '../controllers/optionGroup.controller.js';
import optionGroupJoiSchema from "../validators/optionGroup.validator.js";
import { integrityCheck} from "../middlewares/validate.middleware.js";
const routerOptionGroup=Router();
routerOptionGroup.get('/', getOptionGroups);
routerOptionGroup.post('/',integrityCheck(optionGroupJoiSchema), createOptionGroup);
export default routerOptionGroup;