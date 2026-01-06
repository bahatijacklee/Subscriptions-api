import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import User from '../models/user.model.js';

export const signUp = async (req, res, next) => {
    // Signup logic here
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Your signup logic, e.g., creating a new user
        const { name, email, password } = req.body;

        //check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists with this email');
            error.status = 409;
            throw error;
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user
        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }], { session });

        //generate JWT token for user (implementation not shown here)
        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });  


        //commit transaction
        await session.commitTransaction();
        session.endSession();

        //pass data to response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {token, user: newUsers[0]}
        });
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

}


export const signIn = async (req, res, next) => {
    // Signin logic here
    try {
        const {email, password} = req.body;

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Invalid email or password');
            error.status = 404;
            throw error;
        }
        //compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid email or password');
            error.status = 401;
            throw error;
        }
        //generate JWT token for user
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: { token, user }
        });
    } catch (error) {
       next(error); 
    }
}

export const signOut = async (req, res, next) => {
    // Signout logic here
}

