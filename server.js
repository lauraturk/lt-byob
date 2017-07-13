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

if (!config.CLIENT_SECRET || !config.USERNAME || !config.PASSWORD) {
  throw 'Make sure you have a CLIENT_SECRET, USERNAME, and PASSWORD in your .env file';
}

app.set('secretKey', config.CLIENT_SECRET);

app.set('port', process.env.PORT || 3000);


app.post('/authenticate', (request, response) => {
  const user = request.body;

  if (user.username !== config.USERNAME || user.password !== config.PASSWORD) {
    response.status(403).send({
      success: false,
      message: 'Invalid Credentials'
    });
  }

  else {
    let token = jwt.sign(user, app.get('secretKey'), {
      expiresIn: 172800
    });

    response.json({
      success: true,
      username: user.username,
      token: token
  });
  }
});

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

  database('verbs').where('text_id', id).select().union(function () {
    this.select('*').from('adverbs').where('text_id', id).union(function () {
      this.select('*').from('adjectives').where('text_id', id).union(function () {
        this.select('*').from('nouns').where('text_id', id);
      });
    });
  })
  .then((data) => {
    if (data.length) {
      response.status(200).json(data);
    } else {
      resonse.status(404).json({'error': 'Error requesting stuff'});
    }
  })
  .catch((error) => console.log('error', error));
});

app.patch('/api/v1/text_samples/:id', (request, response) => {
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

app.patch('/api/v1/:table/:id', (request, response) => {
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

app.post('/api/v1/text_samples/:id/new', (request, response) => {
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


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
