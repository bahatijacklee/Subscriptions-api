import {Router} from 'express';
import {signUp, signIn, signOut} from '../controllers/auth.controller.js';

const authRouter = Router();


// Define your authentication routes here

//path: /api/v1/auth/sign-up(POST)
authRouter.post('/sign-up', signUp);

//path: /api/v1/auth/sign-in(POST)
authRouter.post('/sign-in', signIn);

//path: /api/v1/auth/sign-out(POST)
authRouter.post('/sign-out', signOut);


export default authRouter;