/*jshint esversion: 6 */

const data = require('../../../data/cleanTestData');

const createWord = (knex, word, textSampleId, wordIndex) => {
  return knex('words').returning('id').insert(word)
    .then((wordId) => {
      let wordIdentifier = wordId[0];
      return knex('text_samples_words').insert({
        text_id: textSampleId,
        word_id: wordId[0],
        word_index: parseInt(wordIndex)
      });
    });
};

const createTextSample = (knex, text_sample) => {
  return knex('text_samples')
    .returning('id')
    .insert({
    title: text_sample.title,
    body: text_sample.body,
    id: 1
  })
  .then(text_sampleId => {
    let textSampleId = text_sampleId[0];
    let wordPromises = [];

    text_sample.words.forEach((word, index) => {
      wordPromises.push(createWord(knex, { word: word.word, type: word.type, id: index }, textSampleId, word.index));
    });

    return Promise.all(wordPromises);
  });
};

exports.seed = (knex, Promise) => {
  return knex('text_samples_words').del()
    .then(() => knex('words').del())
    .then(() => knex('text_samples').del())
    .then(() => {
      let textSamplePromises = [];

      data.text_samples.forEach(text_sample => {
        textSamplePromises.push(createTextSample(knex, text_sample));
      });

      return Promise.all(textSamplePromises);
    })
  .catch(error => console.log(`Error seeding data ${error}`));
};
