/**
 * @file Routes for /users.
 * Public:   POST /register, POST /login (rate-limited against password guessing).
 * Signed in: GET /me, PATCH /me.
 * Admin:    GET /, GET /:id, DELETE /:id, PATCH /:id/role.
 * Every :id is checked to be a valid MongoDB id before reaching a controller.
 */
import { Router } from "express";
import { register, login, getMe, updateMe, getAllUsers, getUserById, deleteUser, changeRole } from "../controllers/user.controller.js";
import { integrityCheck, integrityId } from "../middlewares/validate.middleware.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { registerSchema, loginSchema, updateUserSchema, roleSchema } from "../validators/user.validator.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const routerUsers = Router();
routerUsers.param("id", integrityId);

routerUsers.post("/register", authLimiter, integrityCheck(registerSchema), register);
routerUsers.post("/login", authLimiter, integrityCheck(loginSchema), login);

routerUsers.get("/me", authenticate, getMe);
routerUsers.patch("/me", authenticate, integrityCheck(updateUserSchema), updateMe);

routerUsers.get("/", authenticate, authorize("admin"), getAllUsers);
routerUsers.get("/:id", authenticate, authorize("admin"), getUserById);
routerUsers.delete("/:id", authenticate, authorize("admin"), deleteUser);
routerUsers.patch("/:id/role", authenticate, authorize("admin"), integrityCheck(roleSchema), changeRole);

export default routerUsers;