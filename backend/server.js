require('dotenv').config()
const app = require('./src/app')
const ConnectToDb = require('./src/db/db')
ConnectToDb();


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})