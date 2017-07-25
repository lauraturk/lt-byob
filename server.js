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

if (!process.env.CLIENT_SECRET || !process.env.USERNAME || !process.env.PASSWORD) {
  throw 'Make sure you have a CLIENT_SECRET, USERNAME, and PASSWORD in your .env file';
}

app.set('secretKey', process.env.CLIENT_SECRET);

app.set('port', process.env.PORT || 3000);

const checkAuth = (request, response, next) => {
  const token = request.body.token || request.param('token') || request.headers.authorization;

  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {
      if (error) {
        return response.status(403).send({
          success: false,
          message: 'Invalid authorization token.'
        });
      }
      else {
        request.decoded = decoded;
        next();
      }
    });
  }

  else {
    return response.status(403).send({
      success: false,
      message: 'You must be authorized to hit this endpoint'
    });
  }
};

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

app.get('/api/v1/adjectives', (request, response) => {
  database('adjectives').select()
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
  database('adverbs').select()
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
  database('nouns').select()
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
  database('verbs').select()
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

app.get('/api/v1/:table/?word=example', (request, response) => {
  const { table } = request.params;

  database(`${table}`).where('word', request.query.word).select()
    .then((word) => {
      if(word.length) {
        response.status(200).json({word: word[0]});
      } else {
        response.status(404).json({'error': 'That word does not exist, sadly'});
      }
    })
    .catch((error) => console.log('500: Internal server error', error));
});

app.get('/api/v1/:table/:id', (request, response) => {
  const { id } = request.params;

  const { table } = request.params;

  database(`${table}`).where('id', id).select()
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

app.get('/api/v1/text_samples/:id/words', (request, response) => {
  const { id } = request.params;

  database('text_samples_words').where('text_id', id).select()
    .then((wordData) => {
      const allTheWords = [];
      
      wordData.forEach(word => {
        allTheWords.push(database('words').where('id', word.word_id).select()
        .then((data) => Object.assign({}, data[0], {index: word.word_index})))
      });
      return Promise.all(allTheWords)
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

app.patch('/api/v1/text_samples/:id', checkAuth, (request, response) => {
  const { id } = request.params;

  const { title } = request.body;

  database('text_samples').where('id', id).update({ 'title': title })
  .then((data) => {
    return response.status(201).json({ 'data': data, 'message': 'title changed!'});
  })
  .catch((error) => {
    return response.status(422).json({'error': error});
  });
});

app.patch('/api/v1/:table/:id', checkAuth, (request, response) => {
  const { id } = request.params;

  const { table } = request.params;

  const { type } = request.body;

  database(`${table}`).where('id', id).update({ 'type': type })
    .then((data) => {
      return response.status(201).json({ 'data': data, 'message': 'success!'});
    })
    .catch((error) => {
      return response.status(422).json({ 'error': error });
  });
});

app.delete('/api/v1/text_samples/:id', (request, response) => {
  const { id } = request.params;

  database('nouns').where('text_id', id).del()
   .then(() => database('verbs').where('text_id', id).del())
   .then(() => database('adverbs').where('text_id', id).del())
   .then(() => database('adjectives').where('text_id', id).del())
   .then(() => database('text_samples').where('id', id).del())
  .then((data) => {
    if(data > 0) {
      response.status(202).json({ 'message': 'deleted!' });
    } else {
      response.status(422).json({ 'error': 'nothing to delete' });
    }
  })
  .catch(() => {
    return response.status(500).json({ 'error': '500: Internal error'});
  });
});

app.delete('/api/v1/:table/:id', (request, response) => {
  const { id } = request.params;

  const { table } = request.params;

  database(`${table}`).where('id', id).del()
    .then((data) => {
      if(data > 0) {
        return response.status(202).json({ 'message': 'deleted!' });
      } else {
        return response.status(422).json({ 'error': 'nothing to delete'});
      }
    })
    .catch(() => {
      return response.status(500).json({ 'error': '500: Internal error deleting resource' });
    });
});

app.post('/api/v1/text_samples/:id/new', checkAuth, (request, response) => {
  const { id } = request.params;

  const { word } = request.body;
  const { type } = request.body;

  if(!word || !type) {
    response.status(400).json({'error': 'You do not have the right parameters'});
  }

  let table;

  if(type.includes('NN')) {
    table = 'nouns';
  } else if(type.includes('JJ')) {
    table = 'adjectives';
  } else if(type.includes('VB')) {
    table = 'verbs';
  } else if(type.includes('RB')) {
    table = 'adverbs';
  }

  database(table).insert({ word, type, 'text_id': id })
    .then(() => response.status(201).json({ 'message': 'word added!' }))
    .catch((error) => response.status(500).json(error));
});

app.post('/api/v1/text_samples/new', checkAuth, (request, response) => {
  const { title, body, adjectives, adverbs, verbs, nouns } = request.body;

  if(!title || !body || !adjectives || !adverbs || !verbs || !nouns) {
    response.status(400).json({'error': 'You do not have the right parameters'});
  }

  database('text_samples').insert({ title: title, body: body }, 'id')
    .then((text_sampleId) => {
      let posPromises = [];

      const createAdjective = (database, adjective) => {
        return database('adjectives').insert(adjective);
      };

      const createNoun = (database, noun) => {
        return database('nouns').insert(noun);
      };

      const createVerb = (database, verb) => {
        return database('verbs').insert(verb);
      };

      const createAdverb = (database, adverb) => {
        return database('adverbs').insert(adverb);
      };

      adjectives.forEach(adjective => {
        posPromises.push(
          createAdjective(database, {
            word: adjective.word,
            type: adjective.type,
            text_id: text_sampleId[0]
          })
        );
      });

      nouns.forEach(noun => {
        posPromises.push(
          createNoun(database, {
            word: noun.word,
            type: noun.type,
            text_id: text_sampleId[0]
          })
        );
      });

      verbs.forEach(verb => {
        posPromises.push(
          createVerb(database, {
            word: verb.word,
            type: verb.type,
            text_id: text_sampleId[0]
          })
        );
      });

      adverbs.forEach(adverb => {
        posPromises.push(
          createAdverb(database, {
            word: adverb.word,
            type: adverb.type,
            text_id: text_sampleId[0]
          })
        );
      });

      return Promise.all(posPromises);
    })
    .then((data) => response.status(201).json({'message': 'new test sample entered!'}))
    .catch((error) => response.status(500).json({'error': error}));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
