import { Router } from "express";
import { getAllProducts,getSpecificProduct,addProduct } from "../controllers/products.controller.js";
const routerProducts=Router();
routerProducts.get("/",getAllProducts);
routerProducts.get("/:id",getSpecificProduct);
routerProducts.post("/",addProduct);
export default routerProducts;