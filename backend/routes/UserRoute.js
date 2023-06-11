import express from 'express';
import {
    getUser,
    getUserById,
    createUser,
    editUser,
    deleteUser
} from '../controllers/UserController.js';
import { verifyUser, isAdmin } from '../middleware/AuthUser.js';

const router = express.Router();
router.get('/users', verifyUser, isAdmin, getUser);
router.get('/users/:id', verifyUser, isAdmin, getUserById);
router.post('/users', verifyUser, isAdmin,  createUser);
router.patch('/users/:id', verifyUser, isAdmin, editUser);
router.delete('/users/:id', verifyUser, isAdmin, deleteUser);


export default router;