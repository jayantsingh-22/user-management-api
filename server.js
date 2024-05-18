const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const listRoutes = require('./routes/listRoutes');
const userRoutes = require('./routes/userRoutes');
const emailRoutes = require('./routes/emailRoutes');

dotenv.config({ path: './config.env' });
const app = express();
const port = 3000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).then(() => console.log('DB connection succesful!'));


app.use(express.json());
app.use('/api/lists', listRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});