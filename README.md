# INTER-PAYMENTS-PROJ-INSY7314

## Overview
This is a secure payment portal for customers of a bank. This portal allows customers to make international payments, track their transactions history, and manage their account. The system ensures high security through password hashing, ssl encryption, and input validation with RegEx patterns.

## Features
### Customer Features:
#### Registration:
Customers can register with their personal details that include name, ID, account number, username, and password.
#### Login:
Customers can log in  and authenticate via JWT Tokens, with session management.
#### Dashboard: 
After login, customers can view their dashboard with options such as display transactions, edit transactions and make payments.
#### Logout:
A secure logout option
#### Making International Payments: 
Customers can make payments by entering the amount, selecting the currency, choosing the provider(SWIFT), the swift code, and beneficiary bank details.
##### Review and Confirm Transactions: 
Customers can review the payment details before confirming the transaction. They will also receive a success or failure message after the transaction.
#### View Transaction History:
Customers can view all past transactions, the details, including status, amount , date, and currency.
Customers can filter the transactions.

## Security
#### Password Hashing and Salting:
All passwords are hashed and salted to ensure security.
#### Input Validation: 
All user inputs are validated using RegEx patterns to prevent SQL injection and other attacks.
#### SSL Encryption: 
All traffic between the user and the portal is encrypted with SSL to prevent data injection.
#### Session Mangement:
JWT tokens are used for session management, ensuring secure user authentication.

## Technologies Used
#### Frontend:
React.js
#### Backend:
Node.js, Express(for handling APIs)
#### Database:
MongoDB
#### Security: 
JWT for authentication, bcrypt for hashing passwords
#### SSL:
For secure communication
#### Others:
RegEx for input Validation

## Setup and Installation
#### Prerequisites:
1. Node.js installed
2. React.js setup
3. SSL certificate

#### Steps:
1. Clone the repository
2. Navigate into the project folder
3. Install the dependencies
4. Start the development server

## Running with SSL
1. Ensure that your SSL certificate and key are available.
2. Configure your Express server to use SSL certificates for encrypted traffic.
3. Start the server.

## Project Video
//Youtube video link

## Future Improvements
Implement the employee side.


