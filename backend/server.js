require('dotenv').config()
const app = require('./src/app')
require('./src/db/redis')
// const cluster = require('node:cluster')
// const os = require('node:os')
const ConnectToDb = require('./src/db/db')
ConnectToDb();


// const totalCPUs = os.cpus().length;
// console.log(totalCPUs)
const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;

