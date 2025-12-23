import express from 'express';
const router = express.Router();

import { getAllUsers, createUser, updateUser, deleteUser, getUserById, deleteAll } from '../controllers/controller.js';

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users', updateUser);
router.delete('/users', deleteUser);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteAll);



export default router;