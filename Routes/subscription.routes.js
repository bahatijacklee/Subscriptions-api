import {Router} from 'express';
import authorize from '../middleware/auth.middleware.js';
import { createSubscription } from '../controllers/subscription.controller.js';
const subscriptionRouter = Router();

// Define your subscription routes here
subscriptionRouter.get('/', (req, res) => res.send({ body: { title: 'Get all subscriptions' } }));
subscriptionRouter.get('/:id', (req, res) => res.send({ body: { title: `Get subscription with ID ${req.params.id}` } }));
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', (req, res) => res.send({ body: { title: `Update subscription with ID ${req.params.id}` } }));
subscriptionRouter.delete('/:id', (req, res) => res.send({ body: { title: `Delete subscription with ID ${req.params.id}` } }));
subscriptionRouter.get('/user/:id', (req, res) => res.send({ body: { title: `Get all user subscriptions` } }));
subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ body: { title: `Cancel subscription with ID ${req.params.id}` } }));
subscriptionRouter.put('/upcoming-renewals', (req, res) => res.send({ body: { title: `GET upcoming renewals` } }));

export default subscriptionRouter;