import express, { request } from "express";
import upload from "../utils/multer.js";
import { 
    getPublications, 
    getPublicationsBySearch, 
    getPublication, 
    getPublications4,
    createPublication, 
    updatePublication, 
    likePublication, 
    commentPublication, 
    deletePublication } from "../controllers/publicationController.js"

const router = express.Router();
import auth from "../middleware/auth.js"

router.get('/search', getPublicationsBySearch);
router.get('/', getPublications);
router.get('/four/', getPublications4);
router.get('/:id', getPublication);

router.post('/', upload.single('avatar'),  createPublication);
router.patch('/:id', updatePublication);
router.delete('/:id', deletePublication);
router.patch('/:id/likePublication', auth, likePublication);
router.post('/:id/commentPublication',auth, commentPublication);

export default router;