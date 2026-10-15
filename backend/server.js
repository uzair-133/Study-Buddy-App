require('dotenv').config()
const app = require('./src/app')
const ConnectToDb = require('./src/db/db')
ConnectToDb();


const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;

