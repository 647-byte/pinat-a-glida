import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import uploadImageController from '../controllers/upload.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const routerUpload = express.Router();
routerUpload.post('/', authenticate, authorize("admin"), upload.single('imageUrl'), uploadImageController);
export default routerUpload;