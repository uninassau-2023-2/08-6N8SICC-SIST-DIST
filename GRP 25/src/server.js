
const app = require('./app');
require('dotenv').config();
process.env.TZ = 'America/Sao_Paulo'


const PORT = process.env.PORT || 3333

app.listen(3333, () => console.log('TESTE RUNNING',Date()));