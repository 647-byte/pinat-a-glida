import { Router } from "express";
import { getAllOrders,getOrderById,getUserOrders } from "../controllers/order.controller.js";
const routerOrders = Router();
routerOrders.get("/", getAllOrders);
routerOrders.get("/:id", getOrderById);
routerOrders.get("/user/:userId", getUserOrders);
export default routerOrders;
