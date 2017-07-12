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
  select('*').from('verbs').where('text_id', request.params.id)
  // database('text_samples').join('adjectives', 'text_samples.id', '=', ).where('text_id', request.params.id)
  // database('verbs').where('text_id', request.params.id).select()
  // database('adverbs').where('text_id', request.params.id).select()
  // database('adjectives').where('text_id', request.params.id).select()
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

app.patch('/api/v1/:table/:id', (request, response) => {
  // console.log(request);
  const { id } = request.params;

  const { table } = request.params;

  const { type } = request.body;

  database(`${table}`).where('id', id).update({ type: type })
    .then((data) => {
      return response.status(201).json({ 'data': data, 'message': "success!"});
    })
    .catch((error) => {
      return response.status(422).json({ 'error': error });
  });
});

app.delete('/api/v1/:table/:id', (request, response) => {
  const { id } = request.params;

  const { table } = request.params;

  database(`${table}`).where('id', id).delete()
    .then((data) => {
      if(data) {
        return response.status(200).json({ 'message': 'deleted!' });
      } else {
        return response.status(422).json({ 'error': 'nothing to delete'});
      }
    })
    .catch(() => {
      return response.status(500).json({ 'error': '500: Internal error deleting resource' });
    });
});

app.delete('/api/v1/text_samples/:id', (request, response) => {
  const { id } = request.params;

  database('text_samples').where('id', id).delete()
    .then((data) => {
      if(data) {
        return response.status(200).json({ 'message': 'text deleted!' });
      } else {
        return response.status(422).json({ 'error': 'nothing to delete'});
      }
    })
    .catch(() => {
      return response.status(500).json({ 'error': '500: Internal error deleting resource' });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
