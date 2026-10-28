import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // basic validation

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are important!"})
        }

        // check if user exists already

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: "user already exists!" });
        }

        // create user

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false,
        });

        res.status(201).json({
            message: "User registered",
            user: { id: user._id, email: user.email, username: user.username }
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        
        // checking if the user already exixts
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if(!user) return res.status(400).json({
            message: "User not found"
        });


        // compare passwords
        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({
            message: "Invalid Credentials"
        })

        res.status(200).json({
            message: "USer Logged in",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }
        })

    } catch (error) {
        res.status(500).json({
            messsage: "Internal Server Error"
        })
    }
}

// Login user
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body ?? {};

//         // Validate required fields
//         if (
//             typeof email !== "string" ||
//             typeof password !== "string" ||
//             !email.trim() ||
//             !password
//         ) {
//             return res.status(400).json({
//                 message: "Email and password are required"
//             });
//         }

//         // Find user
//         const user = await User.findOne({
//             email: email.trim().toLowerCase()
//         });

//         if (!user) {
//             return res.status(401).json({
//                 message: "Invalid email or password"
//             });
//         }

//         // Compare password with stored hash
//         const isMatch = await user.comparePassword(password);

//         if (!isMatch) {
//             return res.status(401).json({
//                 message: "Invalid email or password"
//             });
//         }

//         return res.status(200).json({
//             message: "User logged in successfully",
//             user: {
//                 id: user._id,
//                 username: user.username,
//                 email: user.email
//             }
//         });

//     } catch (error) {
//         console.error("Login error:", error);

//         return res.status(500).json({
//             message: "Internal server error"
//         });
//     }
// };

const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({
            email
        });

        if(!user) return res.status(404).json({
            message: "User not found"
        });

        res.status(200).json({
            message: "Logout Successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error
        });
    }
}

export {
    registerUser,
    loginUser,
    logoutUser
};