import { Router } from "express";
import { getAllProducts,getSpecificProduct } from "../controllers/products.controller.js";
const routerProducts=Router();
routerProducts.get("/",getAllProducts);
routerProducts.get("/:id",getSpecificProduct);
export default routerProducts;