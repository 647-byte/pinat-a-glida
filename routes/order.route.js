import { Router } from "express";
import orderSchema from '../validators/order.validator.js';
import { integrityCheck, integrityId } from "../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { getAllOrders, getOrderById, getUserOrders, getMyOrders, createOrder, updateOrderStatus } from "../controllers/order.controller.js";
import { orderHoursMiddleware } from "../middlewares/operatingHours.middleware.js";
import { env } from "../config/env.js";

const routerOrders = Router();
routerOrders.param("id", integrityId);
routerOrders.param("userId", integrityId);

routerOrders.get("/", authenticate, authorize("admin"), getAllOrders);
routerOrders.get("/my", authenticate, getMyOrders);
routerOrders.get("/user/:userId", authenticate, authorize("admin"), getUserOrders);
routerOrders.get("/:id", authenticate, getOrderById);
routerOrders.post("/", authenticate, orderHoursMiddleware(env.ORDER_OPENING_TIME, env.ORDER_CLOSING_TIME), integrityCheck(orderSchema), createOrder);
routerOrders.patch("/:id/status", authenticate, authorize("admin"), updateOrderStatus);

export default routerOrders;
