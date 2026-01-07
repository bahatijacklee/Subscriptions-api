import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './Middleware/error.middleware.js';
import arcjetMiddleware from './middleware/arcjet.middleware.js';


import subscriptionRouter from './Routes/subscription.routes.js';
import userRouter from './Routes/user.routes.js';
import authRouter from './Routes/auth.routes.js';


const app = express();

// Middleware to parse JSON bodies
app.use (express.json());

// Middleware to parse URL-encoded bodies
app.use (express.urlencoded({ extended: false }));

// Middleware to parse cookies
app.use(cookieParser());
// Arcjet middleware (security checks first)
app.use(arcjetMiddleware);
// Error handling middleware
app.use(errorMiddleware);

// Mount routers
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);


app.get ('/', (req, res) => {
    res.send ({ body: 'welcome to the subscription service'});
})

app.get('/health', (req, res) => {
    res.send ({ status: 'OK' });
})

app.listen (PORT, async () => {
    console.log (`Server is running on port ${PORT}`);

    // Connect to the database
    await connectDB();
})

export default app;