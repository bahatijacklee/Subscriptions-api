import {Router} from 'express';

import authorize from '../middleware/auth.middleware.js';
import { getUser, getUsers } from '../controllers/user.controller.js';
const userRouter = Router();

// Define your user routes here
userRouter.get('/', getUsers); ;
userRouter.get('/:id', authorize, getUser);
userRouter.post('/', (req, res) => res.send({ body: { title: 'Create a new user' } }));
userRouter.put('/:id', (req, res) => res.send({ body: { title: `Update user with ID ${req.params.id}` } }));
userRouter.delete('/:id', authorize, (req, res) => res.send({ body: { title: `Delete user with ID ${req.params.id}` } }));

export default userRouter;