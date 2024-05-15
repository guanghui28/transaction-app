import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`Connect DB success at host ${conn.connection.host}`);
	} catch (error) {
		console.log(`Error happens when connecting DB!`);
	}
};

export default connectDB;
