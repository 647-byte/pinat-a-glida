/**
 * @file Main router: mounts each resource's router on its path.
 */
import { Router } from "express";
import routerProducts from "./product.route.js";
import routerOrders from "./order.route.js";
import routerUsers from "./user.route.js";
import routerUpload from "./upload.router.js";
import routerOptionGroup from './optionGroup.route.js';
const mainRouter = Router();
mainRouter.use('/optionGroup',routerOptionGroup);
mainRouter.use('/upload', routerUpload);
mainRouter.use('/products', routerProducts);
mainRouter.use('/orders', routerOrders);
mainRouter.use('/users', routerUsers);
export default mainRouter;