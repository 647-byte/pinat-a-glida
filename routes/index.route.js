import { Router } from "express";
import routerProducts from "./product.route.js";
const mainRouter=Router();
mainRouter.use('/products',routerProducts);
export default mainRouter;