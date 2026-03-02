// Quick utility: Check a user and make them admin + optionally reset password
// Usage: node admin-fix.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const TARGET_EMAIL = 'tanvirdewan2006@gmail.com';
const NEW_PASSWORD = null; // Set a new password here if you want to reset it, e.g. 'MyNewPass123'

async function main() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!\n');

    // Find the user
    const user = await User.findOne({ email: TARGET_EMAIL });

    if (!user) {
        console.log(`No user found with email: ${TARGET_EMAIL}`);
        console.log('\nAll users in database:');
        const allUsers = await User.find().select('name email isAdmin');
        if (allUsers.length === 0) {
            console.log('  (no users exist yet)');
        } else {
            allUsers.forEach(u => console.log(`  - ${u.email} | ${u.name} | Admin: ${u.isAdmin}`));
        }
        await mongoose.disconnect();
        return;
    }

    console.log('User found:');
    console.log(`  Name:    ${user.name}`);
    console.log(`  Email:   ${user.email}`);
    console.log(`  Admin:   ${user.isAdmin}`);
    console.log('');

    // Make admin if not already
    if (!user.isAdmin) {
        user.isAdmin = true;
        await user.save();
        console.log('>> User has been promoted to ADMIN');
    } else {
        console.log('>> User is already an admin');
    }

    // Reset password if specified
    if (NEW_PASSWORD) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(NEW_PASSWORD, salt);
        await user.save();
        console.log(`>> Password has been reset to: ${NEW_PASSWORD}`);
    }

    console.log('\nDone! Log out and log back in to get a fresh JWT token with admin access.');
    await mongoose.disconnect();
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
