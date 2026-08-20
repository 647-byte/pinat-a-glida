import { Router } from "express";
import { getAllProducts } from "../controllers/products.controller.js";
const routerProducts=Router();
routerProducts.get("/",getAllProducts);
export default routerProducts;