import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
	query GetTransactions {
		transactions {
			_id
			description
			paymentType
			category
			amount
			location
			date
		}
	}
`;

export const GET_TRANSACTION = gql`
	query GetTransaction($transactionId: ID!) {
		transaction(transactionId: $transactionId) {
			_id
			description
			paymentType
			category
			amount
			location
			date
			user {
				name
				username
				profilePicture
			}
		}
	}
`;

export const GET_TRANSACTIONS_STATISTICS = gql`
	query GetTransactionsStatistics {
		categoryStatistics {
			category
			totalAmount
		}
	}
`;
