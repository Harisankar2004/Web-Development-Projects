const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Temporary storage for submissions
const submissions = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Render form page
app.get('/', (req, res) => {
  res.render('task2', { errors: {}, data: {} });
});

// Handle form submission
app.post('/submit', (req, res) => {
  const data = req.body;
  const errors = {};

  // 1️⃣ Validate Full Name
  if (!data.fullName || !/^[A-Za-z ]{2,}$/.test(data.fullName.trim())) {
    errors.fullName = 'Full name must contain only letters and spaces (min 2 chars).';
  }

  // 2️⃣ Validate Email
  if (!data.email || !/^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data.email.trim())) {
    errors.email = 'Enter a valid email (cannot start with number).';
  }

  // 3️⃣ Validate DOB
  if (data.dob) {
    const dobDate = new Date(data.dob);
    const today = new Date();
    if (dobDate > today) {
      errors.dob = 'Date of birth cannot be in the future.';
    }
  }

  // 4️⃣ Validate Subscription Email (only if subscribed)
  if (data.subscribe) {
    if (!data.subscriptionEmail || !/^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(data.subscriptionEmail.trim())) {
      errors.subscriptionEmail = 'Enter a valid subscription email.';
    }
  }

  // If there are validation errors, re-render the form
  if (Object.keys(errors).length > 0) {
    return res.render('task2', { errors, data });
  }

  // Store valid data and show success
  submissions.push(data);
  res.render('success', { data });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
