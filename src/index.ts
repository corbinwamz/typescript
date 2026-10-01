/// <reference path="./types/express.d.ts" />
import "dotenv/config";
import express, { response } from "express"; 
import { hashPassword, comparePassword } from "./utils/password";
import { findUserByEmail, findUserById, updateUser, findAllUsers } from "./db/prisma";
import { addUser } from "./db/prisma";
import { User } from "./generated/prisma/client";
import { hash } from "node:crypto";
import { PublicUser, UpdateProfileBody } from "./types/user";
import { NewUser } from "./types/user"
import { generateToken } from "./utils/jwt";
import { authMiddleware } from "./middleware/auth";

const app = express();
app.use(express.json());

const PORT: number = 3000;

// Tuple: a fixed-length array where each position has its own type.
type LoginResult = [PublicUser, string];

function buildLoginResult(user: User): LoginResult {
    const { hashedPassword: _, ...rest } = user;
    return [rest, generateToken(user.id)];
}

app.get("/", (req,res) => {
    res.send("Hello");
});

app.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await findUserByEmail(email);
        if (user != null) {
            res.status(409).json({
                success: false,
                message: "email already exists"
            })
            return;
        } 
        const hashedPassword = await hashPassword(password);
        const newUser: NewUser = {
            email: email,
            username: username,
            hashedPassword: hashedPassword
        }
        const addedUser = await addUser(newUser);
        const { hashedPassword: _, ...rest } = addedUser;
        const publicUser: PublicUser = rest;
        res.status(201).json({
            success: true,
            message: "User added to database",
            data: publicUser
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "User failed to add to database",
        })
    }
})

app.post("/login", async (req,res) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Missing email or password"
            })
            return;
        }
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Wrong email or password",
            })
            return;
        }
        const hashedPassword = user.hashedPassword;
        const validPassword = await comparePassword(password, hashedPassword);
        if (validPassword === false) {
            res.status(401).json({
                success: false,
                message: "Wrong email or password",
            })
            return;
        }
        const [publicUser, token] = buildLoginResult(user);
        res.status(200).json({
            success: true,
            message: "Authentication successful",
            data: publicUser, token
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "failed to lookup email",
        })
    }
})

app.get("/users", authMiddleware, async (req, res) => {
    try {
        const users: PublicUser[] = await findAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "failed to load users" });
    }
})

app.get("/profile", authMiddleware, async (req,res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid user"
            })
            return;
        }
        const userData = await findUserById(user.userId);
        if (!userData) {
            res.status(404).json({
                success: false,
                message: "Invalid user"
            })
            return;
        }
        const { hashedPassword: _, ...rest } = userData;
        const publicUser: PublicUser = rest;

        res.status(200).json({
            success: true,
            message: "Authentication successful",
            data: publicUser
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "failed to load profile",
        })
    }
})

app.put("/profile", authMiddleware, async (req,res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Invalid user"
            })
            return;
        }
        const { username, email } = req.body;
        if (username !== undefined && typeof username !== "string" || email !== undefined && typeof email !== "string") {
            res.status(409).json({
                success: false,
                message: "Invalid input"
            })
            return;
        }
        const userData = await findUserById(userId);
        if (!userData) {
            res.status(401).json({
                success: false,
                message: "Invalid user"
            })
            return;
        }
        let updatedProfile: UpdateProfileBody = {}
        if (!username && !email) {
            res.status(400).json({
                success: false,
                message: "Input not provided"
            })
            return;
        }
        if (username) {
            updatedProfile.username = username;
        }
        if (email) {
            const emailData = await findUserByEmail(email);
            if (emailData && emailData?.id!=userId) {
                res.status(409).json({
                    success: false,
                    message: "Email already in use"
                })
                return;
            }
            updatedProfile.email = email;
        }
        const updatedUser = await updateUser(userId, updatedProfile);
        const { hashedPassword: _, ...rest } = updatedUser;
        const publicUser: PublicUser = rest;
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: publicUser
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "failed to update profile",
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// (async () => {
//     const hash = await hashPassword("mypassword");
//     console.log(`hash: ${hash}`);
//     console.log(await comparePassword("mypassword", hash));
//     console.log(await comparePassword("wronghash", hash));
// })();