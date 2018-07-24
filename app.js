const express = require('express');
const axios = require('axios');
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
    res.json({"success": false, errors: "Please enter a valid API key"});
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
    res.json({"success": false, errors});
  });
});


app.post('/businesses', (req, res) => {
  if (req.body.api_key == undefined){
    res.json({"success": false, errors: "Please enter a valid API key"});
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
    res.json({"success": false, errors});
  });
});

app.post('/businesses/matches', (req, res) => {
  if (req.body.api_key == undefined) {
    res.json({"success": false, errors: "Please enter a valid API key"});
  }

  var keys = Object.keys(req.body);
  var params = {};
  for(var key in req.body) {
    if (key !== "api_key") {
      params[key] = req.body[key];
    }
  }

  var options = {
    url: "https://api.yelp.com/v3/businesses/matches",
    method: "GET",
    params: params,
    headers: {
      "Authorization": "Bearer " + req.body.api_key
    }
  }

  axios(options).then(function(response) {
    res.json(response.data);
  }).catch(function(err) {
    var errors = [];
    var keys = Object.keys(req.body);

    for (var key in req.body) {
      if (req.body[key] === '') {
        errors.push(`Please enter a valid ${key}`);
      }
    }
    res.json({"success": false, errors});
  });
  
});

app.post('/businesses/details', (req, res) =>{
  if (req.body.api_key == undefined) {
    res.json({"success": false, errors: "Please enter a valid API key"});
  }

  const options = {
    method: 'GET',
    url: 'https://api.yelp.com/v3/businesses/' + req.body.id,
    headers: {
      'Authorization': 'Bearer ' + req.body.api_key
    }
  }
  axios(options).then(function(response){
    res.json(response.data);
  }).catch(function(error) {
    var errors = [];
    var keys = Object.keys(req.body);

    for (var key in req.body) {
      if (req.body[key] === '') {
        errors.push(`Please enter a valid ${key}`);
      }
    }
    res.json({"success": false, errors});
  });
})

// Excluding transactions
// app.post('/transaction', (req, res) => {
//   if (req.body.api_key == undefined){
//     res.json({"success": false, errors: "Please enter a valid API key"});
//   }
//   const client = yelp.client(req.body.api_key);  

//   client.transactionSearch('delivery', {
//     location: 'san diego'
//   }).then(response => {
//     res.json({"success": true, data: response.jsonBody});
//   }).catch(e => {
//     var errors = [];
//     if (req.body.transactionType == undefined) errors.push("Please enter a valid transaction");
//     if (req.body.location == undefined) errors.push("Please enter a valid location");
//     res.json({"success": false, errors});
//   });
// })

app.post('/reviews', (req, res) => {
  if (req.body.api_key == undefined){
    res.json({"success": false, errors: "Please enter a valid API key"});
  }
  const client = yelp.client(req.body.api_key);    
  
  client.reviews(req.body.business_id).then(response => {
    res.json(response.jsonBody);
  }).catch(e => {
    var errors = [];
    if (req.body.term == undefined) errors.push("Please enter a valid business id");
    res.json({"success": false, errors});
  });
});

app.listen(PORT, () => {
  console.log("Server is listening on PORT ", PORT);
});