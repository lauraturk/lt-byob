const data = require('../../../data/cleanData')


  const createTextSample = (knex, text_sample) => {
    return knex('text_samples').insert({
      title: text_sample.title,
      body: text_sample.body
    }, 'id')
    .then(text_sampleId => {
      let posPromises = [];

      text_sample.adjectives.forEach(adjective => {
        posPromises.push(
          createAdjective(knex, {
            word: adjective.word,
            type: adjective.type,
            text_id: text_sampleId[0]
          })
        )
      });

      text_sample.nouns.forEach(noun => {
        posPromises.push(
          createNoun(knex, {
            word: noun.word,
            type: noun.type,
            text_id: text_sampleId[0]
          })
        )
      });

      text_sample.verbs.forEach(verb => {
        posPromises.push(
          createVerb(knex, {
            word: verb.word,
            type: verb.type,
            text_id: text_sampleId[0]
          })
        )
      });

      text_sample.adverbs.forEach(adverb => {
        posPromises.push(
          createAdjective(knex, {
            word: adverb.word,
            type: adverb.type,
            text_id: text_sampleId[0]
          })
        )
      });

      return Promise.all(posPromises)
    })
  };

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
      let textSamplePromises = [];

      data.text_samples.forEach(text_sample => {
        textSamplePromises.push(createTextSample(knex, text_sample));
      });

      return Promise.all(textSamplePromises);
    })
  .catch(error => console.log(`Error seeding data ${error}`))
};
