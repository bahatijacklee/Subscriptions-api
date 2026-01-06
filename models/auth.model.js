import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({});

export const Auth = mongoose.model('Auth', authSchema);

export default Auth;