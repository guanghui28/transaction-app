import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";

const transactionResolver = {
	Query: {
		transactions: async (_, __, context) => {
			try {
				if (!context.getUser()) {
					throw new Error("Unauthorized");
				}

				const userId = await context.getUser()._id;

				const transactions = await Transaction.find({ userId });
				return transactions;
			} catch (error) {
				console.log(`Error in transactions query: ${error.message}`);
				throw new Error(error.message);
			}
		},

		transaction: async (_, { transactionId }) => {
			try {
				const transaction = await Transaction.findById(transactionId);
				if (!transaction) {
					throw new Error("Transaction can't be found");
				}
				return transaction;
			} catch (error) {
				console.log(`Error in transaction query: ${error.message}`);
				throw new Error(error.message);
			}
		},
		categoryStatistics: async (_, __, context) => {
			try {
				if (!context.getUser()) {
					throw new Error("Unauthorized");
				}

				const userId = context.getUser()._id;
				const transactions = await Transaction.find({ userId });
				const categoryMap = {};

				transactions.forEach((transaction) => {
					if (!categoryMap[transaction.category]) {
						categoryMap[transaction.category] = 0;
					}
					categoryMap[transaction.category] += transaction.amount;
				});

				return Object.entries(categoryMap).map(([category, totalAmount]) => ({
					category,
					totalAmount,
				}));
			} catch (error) {
				console.log(`Error in categoryStatistics query: ${error.message}`);
				throw new Error(error.message);
			}
		},
	},
	Mutation: {
		createTransaction: async (_, { input }, context) => {
			try {
				const newTransaction = new Transaction({
					...input,
					userId: context.getUser()._id,
				});
				await newTransaction.save();
				return newTransaction;
			} catch (error) {
				console.log(`Error in createTransaction: ${error.message}`);
				throw new Error(error.message);
			}
		},
		updateTransaction: async (_, { input }, context) => {
			try {
				const updatedTransaction = await Transaction.findByIdAndUpdate(
					input.transactionId,
					input,
					{ new: true }
				);
				return updatedTransaction;
			} catch (error) {
				console.log(`Error in updateTransaction: ${error.message}`);
				throw new Error(error.message);
			}
		},
		deleteTransaction: async (_, { transactionId }, context) => {
			try {
				const deletedTransaction = await Transaction.findByIdAndDelete(
					transactionId
				);
				return deletedTransaction;
			} catch (error) {
				console.log(`Error in deleteTransaction: ${error.message}`);
				throw new Error(error.message);
			}
		},
	},
	Transaction: {
		user: async (parent) => {
			const userId = parent.userId;
			try {
				const user = await User.findById(userId);
				return user;
			} catch (error) {
				console.log(`Error in transaction.user: `, error.message);
				throw new Error(error.message);
			}
		},
	},
};

export default transactionResolver;
