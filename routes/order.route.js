import { Router } from "express";
import { getAllOrders,getOrderById,getUserOrders,createOrder,updateOrderStatus } from "../controllers/order.controller.js";
const routerOrders = Router();
routerOrders.get("/", getAllOrders);
routerOrders.get("/:id", getOrderById);
routerOrders.get("/user/:userId", getUserOrders);
routerOrders.post("/", createOrder);
routerOrders.patch("/:id/status", updateOrderStatus);
export default routerOrders;
