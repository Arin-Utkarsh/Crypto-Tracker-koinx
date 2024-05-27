// index.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Trade = require('./models/Trade');

const app = express();
const upload = multer({ dest: 'uploads/' });


const bodyParser = require('body-parser');
app.use(bodyParser.json());

// mongoose.connect('mongodb://127.0.0.1:27017/crypto-trades', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://arinutkarsh55:96ZcnMo6sZJAzzrE@cluster0.aqufvxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
 { useNewUrlParser: true, useUnifiedTopology: true });


app.post('/upload', upload.single('file'), (req, res) => {
  const fileRows = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      const [baseCoin, quoteCoin] = row.Market.split('/');
      fileRows.push({
        userId: parseInt(row.User_ID),
        utcTime: new Date(row.UTC_Time),
        operation: row.Operation,
        market: row.Market,
        baseCoin,
        quoteCoin,
        amount: parseFloat(row['Buy/Sell Amount']),
        price: parseFloat(row.Price),
      });
    })
    .on('end', () => {
      Trade.insertMany(fileRows)
        .then(() => {
          fs.unlinkSync(req.file.path);
          res.send('File successfully processed and data stored in database.');
        })
        .catch((error) => {
          res.status(500).send('Error storing data: ' + error.message);
        });
    });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.post('/balance', async (req, res) => {
    const timestamp = new Date(req.body.timestamp);
    const trades = await Trade.find({ utcTime: { $lte: timestamp } });
  
    const balances = trades.reduce((acc, trade) => {

      const baseCoin = trade.baseCoin;
      const amount = trade.amount;
      const operation = trade.operation;

      if (!acc[baseCoin]) {
        acc[baseCoin] = 0;
      }

      if (operation === 'Buy') {
        acc[baseCoin] += amount;
      } else {
        acc[baseCoin] -= amount;
      }

      return acc;
    }, {});
     
    res.json(balances);
  });
  