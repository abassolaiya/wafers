import express, { request } from "express";
import { 
    getJigsaws, 
    getJigsawsBySearch, 
    getJigsaw, 
    createJigsaw, 
    updateJigsaw, 
    likeJigsaw, 
    commentJigsaw, 
    deleteJigsaw } from "../controllers/jigsawController.js";

import upload from "../utils/multer.js";

const router = express.Router();
import auth from "../middleware/auth.js"

router.get('/search', getJigsawsBySearch);
router.get('/', getJigsaws);
router.get('/four', getJigsaws);
router.get('/:id', getJigsaw);

router.post('/', upload.single('avatar'),  createJigsaw);
router.patch('/:id', updateJigsaw);
router.delete('/:id', deleteJigsaw);
router.patch('/:id/likeJigsaw', auth, likeJigsaw);
router.post('/:id/commentJigsaw',auth, commentJigsaw);

export default router;