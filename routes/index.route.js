import { Router } from "express";
import routerProducts from "./product.route.js";
import routerOrders from "./order.route.js"
import routerUpload from "./upload.router.js";
const mainRouter = Router();
mainRouter.use('/upload',routerUpload);
mainRouter.use('/products', routerProducts);
mainRouter.use('/orders', routerOrders);
export default mainRouter;