var express = require('express');
var router = express.Router();
var async = require("async");

var watson = require('watson-developer-cloud');
var alchemy_language = watson.alchemy_language({
  api_key: process.env.API_KEY
})

var concat = function (convo, referance) {
  var newData = [];
  for (i = 0; i < convo.length; i++) {
    for (j = 0; j < referance.length; j++) {
      if (convo[i].text == referance[j].text) {
        newData.push(referance[j]);
      }
    }
  }
  return newData;
}

router.get('/', function (req, res, next) {

  var calls = [];

  var parameters = {
    url: 'https://www.nytimes.com/2017/03/07/technology/uber-travis-kalanick.html?rref=collection%2Fsectioncollection%2Ftechnology&action=click&contentCollection=technology&region=rank&module=package&version=highlights&contentPlacement=1&pgtype=sectionfront'
    , showSourceText: 1
    , sentiment: 1
  };

  var parameters1 = {
    url: 'http://www.vanityfair.com/news/2014/12/uber-travis-kalanick-controversy'
    , showSourceText: 1
    , sentiment: 1
  };

  [parameters, parameters1].forEach(function(param) {
    calls.push(function(callback) {
      alchemy_language.keywords(param, function (err, response) {
        callback(err, response);
      });
    }
  )});

  async.parallel(calls, function(err, result) {
//    concat(result[0], result[1]);
    console.log(result);
    res.render('index', { title: "Comparing Two Article's Keywords", data: JSON.stringify(result) })
  });

});

module.exports = router;
