import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minlength: [2, 'Subscription name must be at least 2 characters'],
        maxlength: [100, 'Subscription name cannot be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    currecny: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'Ksh'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'technology', 'finance', 'politics', 'entertainment', 'productivity', 'education', 'health', 'other'],
       required: true,
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'canceled', 'paused'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator:(value) => value < new Date(),
            message: 'Start date cannot be in the future'
        },
    },
    renewalDate: {
        type: Date,  
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date'
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }, 


},{ timestamps: true });

//auto calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods ={
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate());
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    };
    //auto-update the sattus if renewal date has passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    next();
});


export const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;