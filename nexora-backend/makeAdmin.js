require('dotenv').config();
const mongoose = require('mongoose');

const email = (process.argv[2] || '').toLowerCase().trim();

if (!email) {
    console.log('ایمیل را بدهید. مثال: node makeAdmin.js you@example.com');
    process.exit(1);
}

(async () => {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!uri) {
        console.log('آدرس دیتابیس در فایل .env پیدا نشد. اسم متغیر دیتابیس را در این اسکریپت بنویس.');
        process.exit(1);
    }

    await mongoose.connect(uri);

    const result = await mongoose.connection.db
        .collection('users')
        .updateOne({ email }, { $set: { role: 'admin' } });

    console.log(result);

    if (result.matchedCount === 0) console.log('کاربری با این ایمیل پیدا نشد');
    else console.log('انجام شد: این کاربر اکنون ادمین است');

    await mongoose.disconnect();
})().catch((err) => {
    console.error(err);
    process.exit(1);
});