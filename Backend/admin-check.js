// Quick utility: Check admin users and optionally reset password
// Usage:
//   node admin-check.js              — list all users and show who is admin
//   node admin-check.js reset EMAIL NEWPASSWORD  — reset a user's password

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const action = process.argv[2];

    if (action === 'reset') {
        // Reset password mode
        const email = process.argv[3];
        const newPassword = process.argv[4];

        if (!email || !newPassword) {
            console.log('Usage: node admin-check.js reset <email> <newpassword>');
            process.exit(1);
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`No user found with email: ${email}`);
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        console.log(`Password reset successfully for: ${user.name} (${user.email})`);
        console.log(`Admin: ${user.isAdmin ? 'YES' : 'No'}`);
    } else {
        // List all users mode
        const users = await User.find().select('-password').sort({ createdAt: 1 });

        if (users.length === 0) {
            console.log('No users found in database. The first person to register will become admin.');
        } else {
            console.log(`Found ${users.length} user(s):\n`);
            users.forEach((u, i) => {
                console.log(`${i + 1}. ${u.name}`);
                console.log(`   Email:   ${u.email}`);
                console.log(`   Role:    ${u.isAdmin ? 'ADMIN' : 'User'}`);
                console.log(`   Joined:  ${u.createdAt.toLocaleDateString()}`);
                console.log('');
            });
        }
    }

    await mongoose.disconnect();
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
