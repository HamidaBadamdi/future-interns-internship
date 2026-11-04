
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please log in."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token is missing."
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured.");

        return res.status(500).json({
            success: false,
            message: "Authentication is not configured."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: "leadflow-api",
            audience: "leadflow-client"
        });

        if (
            decoded.role !== "admin" ||
            typeof decoded.sub !== "string"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        req.admin = {
            id: decoded.sub,
            role: decoded.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please log in again."
        });
    }
};

module.exports = authMiddleware;
