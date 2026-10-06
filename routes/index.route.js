import { Router } from "express";
import routerProducts from "./product.route.js";
import routerOrders from "./order.route.js";
import routerUsers from "./user.route.js";
const mainRouter = Router();
mainRouter.use('/products', routerProducts);
mainRouter.use('/orders', routerOrders);
mainRouter.use('/users', routerUsers);
export default mainRouter;