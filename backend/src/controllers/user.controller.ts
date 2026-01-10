import { Request, Response } from 'express';
import User from '../models/user.model';

export const syncUser = async (req: Request, res: Response) => {
    try {
        const { userId, email, firstName, lastName, imageUrl } = req.body;

        // Check if auth is valid (userId from body should match auth token if strictly checking, 
        // but here we trust the body combined with requireAuth middleware protecting the route)
        // Actually, safer to use (req as any).auth.userId
        const authenticatedUserId = (req as any).auth.userId;

        if (!authenticatedUserId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!email) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let user = await User.findOne({ clerkId: authenticatedUserId });

        if (!user) {
            user = new User({
                clerkId: authenticatedUserId,
                email,
                firstName,
                lastName,
                imageUrl,
                role: 'user' // Default role
            });
            await user.save();
            console.log(`New user created: ${email}`);
        } else {
            // Update user details if changed
            user.email = email;
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.imageUrl = imageUrl || user.imageUrl;
            await user.save();
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ message: "Server error" });
    }
};
