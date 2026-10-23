import { Router } from "express";
import {createOptionGroup,getOptionGroups} from '../controllers/optionGroupController.js';
import optionGroupJoiSchema from "../validators/optionGroupSchema.validator.js";
import { integrityCheck} from "../middlewares/validate.middleware.js";
const routerOptionGroup=Router();
routerOptionGroup.get('/', getOptionGroups);
routerOptionGroup.post('/',integrityCheck(optionGroupJoiSchema), createOptionGroup);
export default routerOptionGroup;