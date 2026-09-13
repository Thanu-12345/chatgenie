const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    createUser,
    findUserByEmail
} = require("../models/userModel");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        findUserByEmail(email, async (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error."
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Email already registered."
                });
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            createUser(
                name,
                email,
                hashedPassword,
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Registration failed."
                        });
                    }

                    res.status(201).json({
                        message: "Registration successful.",
                        userId: result.insertId
                    });
                }
            );
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

const login = (req, res) => {
    const { email, password } = req.body;

    findUserByEmail(email, async (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error."
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
};

module.exports = {
    register,
    login
};