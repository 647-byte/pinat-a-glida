import { Router } from "express";
import { getAllProducts,getSpecificProduct,addProduct,deleteProduct,updateProduct } from "../controllers/products.controller.js";
const routerProducts=Router();
routerProducts.get("/",getAllProducts);
routerProducts.get("/:id",getSpecificProduct);
routerProducts.post("/",addProduct);
routerProducts.delete("/:id",deleteProduct);
routerProducts.put("/:id",updateProduct);
export default routerProducts;