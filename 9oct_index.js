// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function get_movie_info(agent) {
    const req = require ('request-promise-native');
    const API_KEY = '3cb4c13a';
    const parameters = request.body.queryResult.parameters;  //fetch the slot for the movie title
    var movie = parameters.movies;
    console.log ('movie: ' + movie);
    const url = `http://www.omdbapi.com/?t=${movie}&apikey=${API_KEY}`; //calls the API
    console.log (url);
    
    return req.get( url )
      .then( jsonBody => {
        var body = JSON.parse(jsonBody);  //parse the response
        console.log (body);
        var output = `${body.Title} is a ${body.Actors} starer ${body.Genre} movie, released in ${body.Year}. It was directed by ${body.Director}`;
        agent.add(output);  //writes back to the user
        return Promise.resolve( output ); 
      });
    }
    
      function get_synopsis(agent) {
    const req = require ('request-promise-native');
    const API_KEY = '3cb4c13a';
    var parameters = request.body.queryResult.parameters;  //fetch the slot for the movie title
    let movie = parameters.movies;
    console.log ('movie: ' + movie);
    let url = `http://www.omdbapi.com/?t=${movie}&apikey=${API_KEY}`; //calls the API
    console.log (url);
    
    const gotTitle = movie > 0;
    if (!gotTitle){
        let movie = request.body.queryResult.outputContexts[0].parameters.movies;  //fetch the slot for the movie title
        console.log (movie);
        // let movie = parameters.movies;
        let url = `http://www.omdbapi.com/?t=${movie}&apikey=${API_KEY}`; //calls the API
        return req.get( url )
      .then( jsonBody => {
        var body = JSON.parse(jsonBody);  //parse the response
        console.log (body);
        var output = `Here is the plot for ${body.Title}:\n${body.Plot}`;
        agent.add(output);  //writes back to the user
        return Promise.resolve( output ); 
      });
    }
    
    return req.get( url )
      .then( jsonBody => {
        var body = JSON.parse(jsonBody);  //parse the response
        console.log (body);
        var output = `Here is the plot for ${body.Title}:\n${body.Plot}`;
        agent.add(output);  //writes back to the user
        return Promise.resolve( output ); 
      });
    }
    

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('get_movie_info', get_movie_info);
  intentMap.set('get_synopsis' , get_synopsis);
  intentMap.set('get_movie_info_synopsis', get_synopsis);     // https://dialogflow.com/docs/fulfillment/webhook-slot-filling
  agent.handleRequest(intentMap);
});