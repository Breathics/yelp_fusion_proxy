const express = require('express');
const path = require('path');
const yelp = require('yelp-fusion');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res) => {
  res.send("Luigi");
})

// Search should be using Access Token
// Then some search parameters
app.post('/search', (req, res) => {
  if (req.body.access_token == undefined){
    res.json({"Success": false, errors: "Please enter a valid access token"});
  }
  const client = yelp.client(req.body.access_token);    

  var params = {
    term: req.body.term,
    location: req.body.location
  }
  client.search(params).then(response => {
    // console.log(response.jsonBody.businesses[0].name);
    // res.json(response.jsonBody.businesses[0].name);
    res.json({"Success": true, data: response.jsonBody})
  }).catch(e => {
    var errors = [];
    if (req.body.term == undefined) errors.push("Please enter a valid term");
    if (req.body.location == undefined) errors.push("Please enter a valid location");
    res.json({"Success": false, errors});
  });
})

// app.post('/transaction', (req, res) => {
//   if (req.body.access_token == undefined){
//     res.json({"Success": false, errors: "Please enter a valid access token"});
//   }
//   const client = yelp.client(req.body.access_token);  
  
//   console.log('this is the req.body', req.body);

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
  if (req.body.access_token == undefined){
    res.json({"Success": false, errors: "Please enter a valid access token"});
  }
  const client = yelp.client(req.body.access_token);    
  
  client.reviews(req.body.business_id).then(response => {
    res.json({"Success": true, data: response.jsonBody});
  }).catch(e => {
    var errors = [];
    if (req.body.term == undefined) errors.push("Please enter a valid business id");
    res.json({"Success": false, errors});
  });
})

app.listen(PORT, () => {
  console.log("Server is listening on PORT ", PORT);
});