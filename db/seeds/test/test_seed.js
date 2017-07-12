/*jshint esversion: 6 */

const data = require('../../../data/cleanData');

const createAdjective = (knex, adjective) => {
  return knex('adjectives').insert(adjective);
};

const createNoun = (knex, noun) => {
  return knex('nouns').insert(noun);
};

const createVerb = (knex, verb) => {
  return knex('verbs').insert(verb);
};

const createAdverb = (knex, adverb) => {
  return knex('adverbs').insert(adverb);
};


  // Deletes ALL existing entries
exports.seed = (knex, Promise) => {
  return knex('verbs').del()
    .then(() => knex('adjectives').del())
    .then(() => knex('nouns').del())
    .then(() => knex('adverbs').del())
    .then(() => knex('text_samples').del())
    .then(() => {
      return Promise.all([
        knex('text_samples').insert({
          title: data.text_samples[0].title,
          body: data.text_samples[0].body,
          id: 1
        }, 'id')
        .then(text_sampleId => {

          let posPromises = [];

          posPromises.push(createAdjective(knex, {
            word: data.text_samples[0].adjectives[0].word,
            type: data.text_samples[0].adjectives[0].type,
            text_id: text_sampleId[0],
            id: 1
          })
        );

          posPromises.push(createAdverb(knex, {
            word: data.text_samples[0].adverbs[0].word,
            type: data.text_samples[0].adverbs[0].type,
            text_id: text_sampleId[0],
            id: 2
          })
        );

          posPromises.push(createVerb(knex, {
            word: data.text_samples[0].verbs[0].word,
            type: data.text_samples[0].verbs[0].type,
            text_id: text_sampleId[0],
            id: 3
          })
        );

          posPromises.push(createNoun(knex, {
            word: data.text_samples[0].nouns[0].word,
            type: data.text_samples[0].nouns[0].type,
            text_id: text_sampleId[0],
            id: 3
          })
        );

        return Promise.all(posPromises);
      })
    ])
    .then(console.log('test seeding complete!'))
    .catch(error => console.log(`Error seeding test data: ${error}`));
  })
    .catch(error => console.log(`Error seeding test data: ${error}`));
  };
