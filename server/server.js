const app = require('./app');
const { setupDatabase } = require('./models/db');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize DB and start listening
setupDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 VMS Express Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start VMS server:', err);
});
