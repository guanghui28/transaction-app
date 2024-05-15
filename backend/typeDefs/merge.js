import { mergeTypeDefs } from "@graphql-tools/merge";
import transactionTypeDef from "./transactionTypeDef.js";
import userTypeDef from "./userTypeDef.js";

const mergedTypeDefs = mergeTypeDefs([transactionTypeDef, userTypeDef]);

export default mergedTypeDefs;
