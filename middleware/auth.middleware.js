import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
    // Authorization logic here
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        //verify token (implementation not shown here)
        const decoded = jwt.verify(token, JWT_SECRET);

        //check if user exists in DB (implementation not shown here)
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user;
        next();
    
    } catch (error) {
      res.status(401).json({ message: 'Not authorized', error: error.message });
    }
};

export default authorize;