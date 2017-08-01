/*jshint esversion: 6 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client Routes', () => {
  before((done) => {
    knex.migrate.latest()
    .then(() => {
      done();
    });
  });

  it('should return an error code if endpoint does not exist', (done) => {
    chai.request(server)
    .get('/sad')
    .end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });
});

describe('API GET routes', () => {
  before((done) => {
    knex.migrate.latest()
    .then(() => {
      done();
    });
  });

  beforeEach((done) => {
    knex.seed.run()
    .then(() => {
      done();
    });
  });

  afterEach((done) => {
    knex.seed.run()
    .then(() => {
      done();
    });
  });

  it('should return all text samples', (done) => {
    chai.request(server)
    .get('/api/v1/text_samples')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json; //jshint ignore:line
      res.body.should.be.a('array');
      res.body[0].should.have.property('title');
      res.body[0].title.should.equal('Stay');
      res.body[0].should.have.property('body');
      res.body[0].body.should.be.a('string');
      res.body[0].should.have.property('id');
      done();
    });
  });

  it('should return a text sample by id', (done) => {
    chai.request(server)
    .get('/api/v1/text_samples/1')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json; //jshint ignore:line
      res.body.should.be.a('array');
      res.body[0].should.have.property('title');
      res.body[0].title.should.equal('Stay');
      res.body[0].should.have.property('body');
      res.body[0].body.should.be.a('string');
      res.body[0].should.have.property('id');
      done();
    });
  });

  it('should return a 404 error for non-existent text_sample', (done) => {
    chai.request(server)
    .get('/api/v1/text_samples/208')
    .end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });

  it('should return all verbs', (done) => {
    chai.request(server)
    .get('/api/v1/verbs')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json; //jshint ignore:line
      res.body.should.be.a('array');
      res.body[0].should.have.property('word');
      res.body[0].word.should.equal('met');
      res.body[0].should.have.property('type');
      res.body[0].type.should.include('VB');
      res.body[0].should.have.property('id');
      done();
    });
  });

  it('should return a word by id', (done) => {
    chai.request(server)
    .get('/api/v1/words/3')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json; //jshint ignore:line
      res.body.should.be.a('array');
      res.body[0].should.have.property('word');
      res.body[0].word.should.equal('only');
      res.body[0].should.have.property('type');
      res.body[0].type.should.include('JJ');
      res.body[0].should.have.property('id');
      done();
    });
  });

  it('should return a 404 error for non-existent word', (done) => {
    chai.request(server)
    .get('/api/v1/words/945')
    .end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });

  it('should return all adverbs', (done) => {
    chai.request(server)
    .get('/api/v1/adverbs')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json; //jshint ignore:line
      res.body.should.be.a('array');
      res.body[0].should.have.property('word');
      res.body[0].word.should.equal('even');
      res.body[0].should.have.property('type');
      res.body[0].type.should.include('RB');
      res.body[0].should.have.property('id');
      done();
    });
  });

  it('should return all adjectives', (done) => {
    chai.request(server)
    .get('/api/v1/adjectives')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json; //jshint ignore:line
      res.body.should.be.a('array');
      res.body[0].should.have.property('word');
      res.body[0].word.should.equal('only');
      res.body[0].should.have.property('type');
      res.body[0].type.should.include('JJ');
      res.body[0].should.have.property('id');
      done();
    });
  });

  it('should return all nouns', (done) => {
    chai.request(server)
    .get('/api/v1/nouns')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json; //jshint ignore:line
      res.body.should.be.a('array');
      res.body[0].should.have.property('word');
      res.body[0].word.should.equal('Can');
      res.body[0].should.have.property('type');
      res.body[0].type.should.include('NN');
      res.body[0].should.have.property('id');
      done();
    });
  });

  it('should return all the words from a text_sample', (done) => {
    chai.request(server)
    .get('/api/v1/text_samples/1/words')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json; //jshint ignore:line
      res.body.should.be.a('array');
      res.body.length.should.equal(4);
      done();
    });
  });
});
