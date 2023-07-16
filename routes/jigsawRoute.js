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

const router = express.Router();
import auth from "../middleware/auth.js"

router.get('/search', getJigsawsBySearch);
router.get('/', getJigsaws);
router.get('/:id', getJigsaw);

router.post('/', auth,  createJigsaw);
router.patch('/:id', auth, updateJigsaw);
router.delete('/:id', auth, deleteJigsaw);
router.patch('/:id/likeJigsaw', auth, likeJigsaw);
router.post('/:id/commentJigsaw',auth, commentJigsaw);

export default router;