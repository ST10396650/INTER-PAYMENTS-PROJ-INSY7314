import React from 'react'; // Import React to create components
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { Helmet } from 'react-helmet-async'; // Import Helmet for managing document head (title, meta tags, etc.)
import LoginForm from '../components/Forms/LoginForm'; // Import the LoginForm component which handles user login

// Login component definition
const Login = () => {
    return (
        <>
            {/* Helmet component used to modify the head of the document */}
            <Helmet>
                <title>Login - International Payments Portal</title> {/* Sets the title for the page */}
                <meta name="description" content="Login to your international payments account" /> {/* Sets meta description for SEO */}
            </Helmet>

            {/* Render the LoginForm component, which will contain the form logic for logging in */}
            <LoginForm />
        </>
    )
}

export default Login; // Export the Login component for use in other parts of the application
