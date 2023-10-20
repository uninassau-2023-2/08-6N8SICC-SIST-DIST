const app = require('./App.js')
require('dotenv/config')

const PORT = 3000;

app.listen(PORT, () => {
    return console.log(`App on in port ${PORT}`)
})