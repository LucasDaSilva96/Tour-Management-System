// Import nodemailer module
const nodemailer = require('nodemailer');

// Create nodemailer transport configuration
const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io', // SMTP host
  port: 2525, // Port number
  secure: false, // Secure connection (false for non-SSL)
  auth: {
    user: process.env.EMAIL_USER, // Email user
    pass: process.env.EMAIL_PASS, // Email password
  },
});

// Function to send welcome email to new users
// TODO Create a prettier html page & change the a href value ↓
exports.sendWelcomeMail = async (user) => {
  try {
    // Send welcome email
    await transport.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_USER}>`,
      to: `${user.email}`,
      subject: `Welcome to the team ${user.name}`,
      text: `Welcome ${user.name}. You are now allowed to log in to Sandgrund's booking system.`,
      html: `<h1>Welcome ${user.name}</h1> <br/>
      <p>You have now access to Sandgrund's booking system</p> <br/>
      <a href="http://localhost:8000/api/v1/users">Go to the booking system</a>`,
    });
    console.log('Welcome email sent✅'); // Log success message
  } catch (err) {
    throw new Error(err); // Throw error if email sending fails
  }
};

// Function to send password reset email to users
exports.sendResetPasswordMail = async (user, resetUrl) => {
  try {
    // Send password reset email
    await transport.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_USER}>`, // Sender email
      to: `${user.email}`, // Recipient email
      subject: `Forgot your password?`, // Email subject
      text: `Submit a PATCH request with your new password
             and passwordConfirm to: ${resetUrl}.\nIf you didn't forgot your password, please ignore this email.`,
      html: `<h1>Forgot your password?</h1> <br/>
      <p>Submit a PATCH request with your new password
             and passwordConfirm to: <a href=${resetUrl}>Reset password</a>.\nIf you didn't forgot your password, please ignore this email.</p>`,
    });
    console.log('Reset password email sent✅'); // Log success message
  } catch (err) {
    throw new Error(err); // Throw error if email sending fails
  }
};
