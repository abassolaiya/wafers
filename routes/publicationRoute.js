import express, { request } from "express";
import { 
    getPublications, 
    getPublicationsBySearch, 
    getPublication, 
    createPublication, 
    updatePublication, 
    likePublication, 
    commentPublication, 
    deletePublication } from "../controllers/publicationController.js"

const router = express.Router();
import auth from "../middleware/auth.js"

router.get('/search', getPublicationsBySearch);
router.get('/', getPublications);
router.get('/:id', getPublication);

router.post('/', auth,  createPublication);
router.patch('/:id', auth, updatePublication);
router.delete('/:id', auth, deletePublication);
router.patch('/:id/likePublication', auth, likePublication);
router.post('/:id/commentPublication',auth, commentPublication);

export default router;