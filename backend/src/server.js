const path = require('path');

// Load environment variables from backend/.env (when running from src)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
