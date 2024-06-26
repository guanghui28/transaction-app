import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const userResolver = {
	Query: {
		authUser: async (_, __, context) => {
			try {
				const user = await context.getUser();
				return user;
			} catch (error) {
				console.log(`Error in authUser: ${error.message}`);
				throw new Error(error.message);
			}
		},
		user: async (_, { userId }) => {
			try {
				const user = await User.findById(userId);
				return user;
			} catch (error) {
				console.log(`Error in user query: ${error.message}`);
				throw new Error(error.message);
			}
		},
	},
	Mutation: {
		signUp: async (_, { input }, context) => {
			try {
				const { username, name, password, gender } = input;
				if (!username || !name || !password || !gender) {
					throw new Error("All fields are required!");
				}

				const existingUser = await User.findOne({ username });
				if (existingUser) {
					throw new Error("username is already existed!");
				}

				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(password, salt);

				const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
				const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

				const newUser = new User({
					username,
					name,
					password: hashedPassword,
					gender,
					profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
				});

				await newUser.save();
				await context.login(newUser);

				return newUser;
			} catch (error) {
				console.log(`Error in signUp: `, error.message);
				throw new Error(error.message);
			}
		},

		login: async (_, { input }, context) => {
			try {
				const { username, password } = input;
				if (!username || !password) throw new Error("All fields are required!");
				const { user } = await context.authenticate("graphql-local", {
					username,
					password,
				});

				await context.login(user);
				return user;
			} catch (error) {
				console.log(`Error in login: `, error.message);
				throw new Error(error.message);
			}
		},

		logout: async (_, __, context) => {
			try {
				await context.logout();
				context.req.session.destroy((error) => {
					if (error) throw error;
				});
				context.res.clearCookie("connect.sid");
				return { message: "Logged out success!" };
			} catch (error) {
				console.log(`Error in logout: `, error.message);
				throw new Error(error.message);
			}
		},
	},
	User: {
		transactions: async (parent) => {
			try {
				const transactions = await Transaction.find({ userId: parent._id });
				return transactions;
			} catch (error) {
				console.log("Error in user.transactions resolver: ", error.message);
				throw new Error(error.message);
			}
		},
	},
};

export default userResolver;
