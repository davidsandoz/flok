/**
 * Twitter Stream Controller
 *
 * @copyright  Nothing Interactive 2015
 */
'use strict';

var http = require('http');
var Twit = require('twit');
var activeConfig = require('../../../../backend/Config.js');

exports.start = function() {

    var T = new Twit({
        consumer_key: activeConfig.twitter.consumerKey,
        consumer_secret: activeConfig.twitter.consumerSecret,
        access_token: activeConfig.twitter.accessToken,
        access_token_secret: activeConfig.twitter.accessTokenSecret
    });

    console.log("Listening for tweets from @NothingAgency.");
    var stream = T.stream('user', {});

    stream.on('connect', function(request) {
        console.log('Connected to Twitter API');
    });

    stream.on('disconnect', function(message) {
        console.log('Disconnected from Twitter API. Message: ' + message);
    });

    stream.on('reconnect', function(request, response, connectInterval) {
        console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
    });

    stream.on('error', function(error) {
        console.log('Error with the Twitter API: ' + error.message);
    });

    stream.on('tweet', function(tweet) {
        var tweetDate = new Date(Date.parse(tweet.created_at.replace(/( \+)/, ' UTC$1')));

        var event = {
            timestamp: tweetDate.toISOString(),
            provider: 'twitter',
            sourceId: tweet.id_str,
            link: 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str,
            title: 'tweeted',
            message: {
                content: '<p>' + tweet.text + '</p>',
                format: 'html'
            },
            author: {
                name: tweet.user.name
            }
        };

        var data = {
            version: '0.0.3',
            events: [event]
        };

        var dataString = JSON.stringify(data);

        var headers = {
            'Authorization': 'FlokApiKey ' + activeConfig.twitter.flokApiKey,
            'Content-Type': 'application/json',
            'Content-Length': dataString.length
        };

        var options = {
            host: 'localhost',
            port: 3000,
            path: '/api/activity',
            method: 'POST',
            headers: headers
        };

        var req = http.request(options, function(res) {
            res.setEncoding('utf-8');

            var responseString = '';

            res.on('data', function(data) {
                responseString += data;
            });

            res.on('end', function() {
                var resultObject = JSON.parse(responseString);
            });
        });

        req.on('error', function(err) {
            console.log('Twitter stream http request error', err);
        });

        req.write(dataString);
        req.end();
    });
};
