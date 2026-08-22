import { Router } from "express";
import { getAllProducts,getSpecificProduct,addProduct,deleteProduct } from "../controllers/products.controller.js";
const routerProducts=Router();
routerProducts.get("/",getAllProducts);
routerProducts.get("/:id",getSpecificProduct);
routerProducts.post("/",addProduct);
routerProducts.delete("/:id",deleteProduct);
export default routerProducts;