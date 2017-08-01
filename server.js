/*jshint esversion: 6 */

const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const config = require('dotenv').config().parsed;
const jwt = require('jsonwebtoken');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'BYO-MadLib API';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.set('secretKey', process.env.CLIENT_SECRET);
app.set('port', process.env.PORT || 3000);

app.get('/api/v1/text_samples', (request, response) => {
  database('text_samples').select()
    .then((text_samples) => {
      if(text_samples.length) {
        response.status(200).json(text_samples);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  })
  .catch(() => {
    response.status(500).send({'Error':'500: Internal error retrieving specific resource.'});
  });
});

app.get('/api/v1/words', (request, response) => {
  database('words').select()
    .then((words) => {
      if(words.length) {
        response.status(200).json(words);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  })
  .catch(() => {
    response.status(500).send({'Error':'500: Internal error retrieving specific resource.'});
  });
});

app.get('/api/v1/text_samples/:id', (request, response) => {
  const { id } = request.params;

  database('text_samples').where('id', id).select()
    .then((word) => {
      if(word.length) {
        response.status(200).json(word);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  })
  .catch(() => {
    response.status(500).send({'Error':'500: Internal error retrieving specific resource.'});
  });
});

app.get('/api/v1/words/:id', (request, response) => {
  const { id } = request.params;

  database('words').where('id', id).select()
    .then((word) => {
      if(word.length) {
        response.status(200).json(word);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  })
  .catch(() => {
    response.status(500).send({'Error':'500: Internal error retrieving specific resource.'});
  });
});

app.get('/api/v1/adjectives', (request, response) => {
  database('words').where('type', 'like', 'JJ%').select()
    .then((adjectives) => {
      if(adjectives.length) {
        response.status(200).json(adjectives);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  })
  .catch(() => {
    response.status(500).send({'Error':'500: Internal error retrieving specific resource.'});
  });
});

app.get('/api/v1/adverbs', (request, response) => {
  database('words').where('type', 'like', 'RB%').select()
    .then((adverbs) => {
      if(adverbs.length) {
        response.status(200).json(adverbs);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  })
  .catch(() => {
    response.status(500).send({'Error':'500: Internal error retrieving specific resource.'});
  });
});

app.get('/api/v1/nouns', (request, response) => {
  database('words').where('type', 'like', 'NN%').select()
    .then((nouns) => {
      if(nouns.length) {
        response.status(200).json(nouns);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  })
  .catch(() => {
    response.status(500).send({'Error':'500: Internal error retrieving specific resource.'});
  });
});

app.get('/api/v1/verbs', (request, response) => {
  database('words').where('type', 'like', 'VB%').select()
    .then((verbs) => {
      if(verbs.length) {
        response.status(200).json(verbs);
      } else {
        response.status(404).json({error: '404: Resource not found'});
      }
  })
  .catch(() => {
    response.status(500).send({'Error':'500: Internal error retrieving specific resource.'});
  });
});

app.get('/api/v1/text_samples/:id/words', (request, response) => {
  const { id } = request.params;

  database('text_samples_words').where('text_id', id).select()
    .then((wordData) => {
      const allTheWords = [];

      wordData.forEach(word => {
        allTheWords.push(database('words').where('id', word.word_id).select()
        .then((data) => Object.assign({}, data[0], {index: word.word_index})));
      });
      return Promise.all(allTheWords);
    })
  .then((data) => {
    if (data.length) {
      response.status(200).json(data);
    } else {
      resonse.status(404).json({'error': 'There are no words...'});
    }
  })
  .catch((error) => console.log('error', error));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
