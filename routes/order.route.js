import { Router } from "express";
import { getAllOrders } from "../controllers/order.controller.js";
const routerOrders = Router();
routerOrders.get("/", getAllOrders);
export default routerOrders;
