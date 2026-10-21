import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import uploadImageController from '../controllers/upload.controller.js';
const routerUpload = express.Router();
routerUpload.post('/', upload.single('imageUrl'),uploadImageController);
export default routerUpload;