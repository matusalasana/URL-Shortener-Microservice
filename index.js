require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require("url");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let urlDatabase = [];
let counter = 1;


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;

  // Validate URL format
  let hostname;
  try {
    hostname = new URL(originalUrl).hostname;
  } catch (err) {
    return res.json({ error: "invalid url" });
  }

  // DNS lookup validation
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    const shortUrl = counter++;

    urlDatabase.push({
      original_url: originalUrl,
      short_url: shortUrl
    });

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
