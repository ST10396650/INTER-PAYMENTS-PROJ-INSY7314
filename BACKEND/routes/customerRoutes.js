// this is the express router file for handling customer authentication and profile. 
// routes/customerRoutes.js
const express = require('express');
const router = express.Router();

const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  logoutCustomer
} = require('../controllers/customerController');

const { authenticate, isCustomer } = require('../middleware/auth');

//public routes to allow customer to login and register
//POST /api/customer/register
router.post('/register', registerCustomer); //uses customer controller register function.

//POST /api/customer/login
router.post('/login', loginCustomer); //uses customer controller login function.


//these routes below are not public so they require authentication to be used
//GET /api/customer/profile
router.get('/profile', authenticate, isCustomer, getCustomerProfile); //authenticates, validates customer, returns details

//POST /api/customer/logout
router.post('/logout', authenticate, isCustomer, logoutCustomer); //authenticates, validates customer, logs out customer

module.exports = router; 