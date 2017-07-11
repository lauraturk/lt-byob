/*jshint esversion: 6 */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'BYO-MadLib API';

app.get('/api/v1/text_samples', (request, response) => {
  database('text_samples').select()
    .then((text_samples) => {
      if(text_samples.length) {
        response.status(200).json(text_samples);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  });
});

app.get('/api/v1/adjectives', (request, response) => {
  database('adjectives').select()
    .then((adjectives) => {
      if(adjectives.length) {
        response.status(200).json(adjectives);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  });
});

app.get('/api/v1/adverbs', (request, response) => {
  database('adverbs').select()
    .then((adverbs) => {
      if(adverbs.length) {
        response.status(200).json(adverbs);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  });
});

app.get('/api/v1/nouns', (request, response) => {
  database('nouns').select()
    .then((nouns) => {
      if(nouns.length) {
        response.status(200).json(nouns);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  });
});

app.get('/api/v1/verbs', (request, response) => {
  database('verbs').select()
    .then((verbs) => {
      if(verbs.length) {
        response.status(200).json(verbs);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
