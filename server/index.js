const mustache = require('mustache-express');
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const apiRoute = express.Router();

// Define middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('client'));

// Define main API endpoint route
app.use('/api', apiRoute);
require('./routes/api')(apiRoute);

// Views
app.engine('mustache', mustache());
app.set('views', path.join(__dirname, '/../client/views'));

// Serve main index page
app.get('/', (req, res) => res.render('index.mustache'));

// Listen on port 3000
app.listen(port, (error) => {
  if (error) {
    console.error(error.stack);
  } else {
    console.info('==> 🌎  Listening on port %s.', port);
  }
});
