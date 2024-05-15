import Transaction from "../models/transactionModel.js";

const transactionResolver = {
	Query: {
		transactions: async (_, _, context) => {
			try {
				if (!context.gerUser()) {
					throw new Error("Unauthorized");
				}

				const userId = await context.getUser()._id;

				const transactions = await Transaction.find({ userId });
				return transactions;
			} catch (error) {
				console.log(`Error in transactions query: ${error.message}`);
				throw new Error("Internal Server Error");
			}
		},

		transaction: async (_, { transactionId }, context) => {
			try {
				const transaction = await Transaction.findById(transactionId);
				return transaction;
			} catch (error) {
				console.log(`Error in transaction query: ${error.message}`);
				throw new Error("Internal Server Error");
			}
		},
		// TODO => ADD CATEGORY STATS
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
				throw new Error("Internal Server Error");
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
				throw new Error("Internal Server Error");
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
				throw new Error("Internal Server Error");
			}
		},
	},
};

export default transactionResolver;
