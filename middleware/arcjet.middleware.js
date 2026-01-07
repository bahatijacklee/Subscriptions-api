import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 1});

        if (decision.isDenied()) {
            // Handle rate limiting
            if (decision.reason.isRateLimit()) return res.status(429).json({ error: 'Too many requests. Please try again later.' });

            // Handle bot detection
            if (decision.reason.isBot()) return res.status(403).json({ error: 'Access denied. Bot traffic is not allowed.' });
            // Handle other denials
            return res.status(403).json({ error: 'Access denied.' });
        }

        next();
    } catch (error) {
        console.error(`Arcjet middleware error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;