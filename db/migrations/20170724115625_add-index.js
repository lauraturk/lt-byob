/*jshint esversion: 6 */
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('verbs'),
    knex.schema.dropTable('nouns'),
    knex.schema.dropTable('adjectives'),
    knex.schema.dropTable('adverbs'),

    knex.schema.createTable('words', (table) => {
      table.increments('id').primary();
      table.string('word');
      table.string('type');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('text_samples_words', (table) => {
      table.increments('id').primary();
      table.integer('text_id').unsigned();
      table.foreign('text_id').references('text_samples.id');
      table.integer('word_id').unsigned();
      table.foreign('word_id').references('words.id');
      table.integer('word_index').unsigned();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('text_samples_words'),
    knex.schema.dropTable('words'),

    knex.schema.createTable('verbs', (table) => {
      table.increments('id').primary();
      table.string('word');
      table.string('type');
      table.integer('text_id').unsigned();
      table.foreign('text_id').references('text_samples.id');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('adverbs', (table) => {
      table.increments('id').primary();
      table.string('word');
      table.string('type');
      table.integer('text_id').unsigned();
      table.foreign('text_id').references('text_samples.id');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('nouns', (table) => {
      table.increments('id').primary();
      table.string('word');
      table.string('type');
      table.integer('text_id').unsigned();
      table.foreign('text_id').references('text_samples.id');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('adjectives', (table) => {
      table.increments('id').primary();
      table.string('word');
      table.string('type');
      table.integer('text_id').unsigned();
      table.foreign('text_id').references('text_samples.id');
      table.timestamps(true, true);
    })
  ]);
};
