import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'));
