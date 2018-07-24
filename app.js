const express = require('express');
const path = require('path');
const cors = require('cors');
const yelp = require('yelp-fusion');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
  res.send("Luigi");
})

// Search should be using API key
// Then some search parameters
app.post('/search', (req, res) => {
  if (req.body.api_key == undefined){
    res.json({"Success": false, errors: "Please enter a valid API key"});
  }
  const client = yelp.client(req.body.api_key);    

  var params = {
    term: req.body.term,
    location: req.body.location
  }
  client.search(params).then(response => {
    res.json(response.jsonBody);
  }).catch(e => {
    var errors = [];
    if (req.body.term == undefined) errors.push("Please enter a valid term");
    if (req.body.location == undefined) errors.push("Please enter a valid location");
    res.json({"Success": false, errors});
  });
});


app.post('/businesses', (req, res) => {
  if (req.body.api_key == undefined){
    res.json({"Success": false, errors: "Please enter a valid API key"});
  }
  const client = yelp.client(req.body.api_key);
  var keys = Object.keys(req.body);
  var params = {};
  for(var key in req.body) {
    params[key] = req.body[key];
  }

  client.search(params).then(response => {
    res.json(response.jsonBody);
  }).catch(e => {
    var errors = [];
    var keys = Object.keys(req.body);

    for (var key in req.body) {
      if (req.body[key] === '') {
        errors.push(`Please enter a valid ${key}`);
      }
    }
    res.json({"Success": false, errors});
  });
});

// Excluding transactions
// app.post('/transaction', (req, res) => {
//   if (req.body.api_key == undefined){
//     res.json({"Success": false, errors: "Please enter a valid API key"});
//   }
//   const client = yelp.client(req.body.api_key);  

//   client.transactionSearch('delivery', {
//     location: 'san diego'
//   }).then(response => {
//     res.json({"Success": true, data: response.jsonBody});
//   }).catch(e => {
//     var errors = [];
//     if (req.body.transactionType == undefined) errors.push("Please enter a valid transaction");
//     if (req.body.location == undefined) errors.push("Please enter a valid location");
//     res.json({"Success": false, errors});
//   });
// })

app.post('/reviews', (req, res) => {
  if (req.body.api_key == undefined){
    res.json({"Success": false, errors: "Please enter a valid API key"});
  }
  const client = yelp.client(req.body.api_key);    
  
  client.reviews(req.body.business_id).then(response => {
    res.json(response.jsonBody);
  }).catch(e => {
    var errors = [];
    if (req.body.term == undefined) errors.push("Please enter a valid business id");
    res.json({"Success": false, errors});
  });
})

app.listen(PORT, () => {
  console.log("Server is listening on PORT ", PORT);
});