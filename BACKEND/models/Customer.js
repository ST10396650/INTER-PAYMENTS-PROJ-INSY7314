const mongoose = require('mongoose'); //this is the library that helps us to interact with mongodb
const crypto = require('crypto'); //it is a node.js library used for encryption & hashing.

// Encryption configuration
const algorithm = 'aes-256-cbc'; //this is an algorithm used for encrypting and decrypting data.
//generates a random encrytion key
const encryptionKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex').slice(0, 32);

const iv = crypto.randomBytes(16); //this makes sure that the encrypted data is not the same, ehrn encryted again

// Encryption helper functions
const encrypt = (text) => {
  //takes the algorithm, encryption key and iv and uses the cipher object in crypto to mix the data  
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(text); // here we are using the object and then now it mixes/encryps the data you want to encrypt
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex'); //returns a string to make sure that the data is not readable
};

//this function now does the opposite of the above method, by breaking it down and reverting it
//back to the original text
const decrypt = (text) => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encryptionKey), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const customerSchema = new mongoose.Schema({
    customer_id: {
    type: String,
    required: [true, 'Customer ID is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^CUST[0-9]{4,6}$/, 'Customer ID must be in format CUST followed by 4-6 digits']
  },

  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s\-']+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes']
  },
  id_number: {
    type: String,
    required: [true, 'ID number is required'],
    unique: true,
    // encrypted
    set: encrypt
  },
  account_number: {
    type: String,
    required: [true, 'Account number is required'],
    unique: true,
    
    set: encrypt
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    select: false // password must not be shown by default
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  last_login: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// makes sure that the system is fast when lookinh for these fields
customerSchema.index({ username: 1 });
customerSchema.index({ account_number: 1 });
customerSchema.index({ role_id: 1 });
employeeSchema.index({ customer_id: 1 });

// decrypting the id number for when it is needed
customerSchema.methods.getDecryptedIdNumber = function() {
  return decrypt(this.id_number);
};

// decrypting the acc number for when it is needed
customerSchema.methods.getDecryptedAccountNumber = function() {
  return decrypt(this.account_number);
};

// this is virtual method for making the account numbers to only show the last four digits 
// in the ui 
customerSchema.virtual('masked_account_number').get(function() {
  const decrypted = decrypt(this.account_number);
  const lastFour = decrypted.slice(-4);
  return '****' + lastFour;
});

const Customer = mongoose.model('Customer', customerSchema); //creating the table

module.exports = Customer; //accessible to all files in project