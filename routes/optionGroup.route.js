/**
 * @file Routes for /optionGroup. Public: GET /. Admin: POST /.
 */
import { Router } from "express";
import { createOptionGroup, getOptionGroups } from '../controllers/optionGroup.controller.js';
import optionGroupJoiSchema from "../validators/optionGroup.validator.js";
import { integrityCheck} from "../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
const routerOptionGroup=Router();
routerOptionGroup.get('/', getOptionGroups);
routerOptionGroup.post('/', authenticate, authorize("admin"), integrityCheck(optionGroupJoiSchema), createOptionGroup);
export default routerOptionGroup;