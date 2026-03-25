const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postbackRoute = require('./routes/postback');
const authRoute = require('./routes/auth');
const walletRoute = require('./routes/wallet');
const adminRoute = require('./routes/admin');
const offersRoute = require('./routes/offers');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/postback', postbackRoute);
app.use('/api/auth', authRoute);
app.use('/api/wallet', walletRoute);
app.use('/api/admin', adminRoute);
app.use('/api/offers', offersRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'));

app.listen(process.env.PORT, () => {
  console.log('Server running');
});
