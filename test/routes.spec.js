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

  beforeEach((done) => {
    knex.seed.run()
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

  describe('API GET routes', () => {

    it('should return all text samples', (done) => {
      chai.request(server)
      .get('/api/v1/text_samples')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; //jshint ignore:line
        res.body.should.be.a('array');
        res.body[0].should.have.property('title');
        res.body[0].title.should.equal('Come Sundown');
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
        res.body[0].title.should.equal('Come Sundown');
        res.body[0].should.have.property('body');
        res.body[0].body.should.be.a('string');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return a 404 error for non-existent text_sample', (done) => {
      chai.request(server)
      .get('/api/v1/text_samples/45')
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
        res.body[0].word.should.equal('named');
        res.body[0].should.have.property('type');
        res.body[0].type.should.equal('VBD');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return a verb by id', (done) => {
      chai.request(server)
      .get('/api/v1/verbs/3')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; //jshint ignore:line
        res.body.should.be.a('array');
        res.body[0].should.have.property('word');
        res.body[0].word.should.equal('named');
        res.body[0].should.have.property('type');
        res.body[0].type.should.equal('VBD');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return a 404 error for non-existent verb', (done) => {
      chai.request(server)
      .get('/api/v1/verbs/45')
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
        res.body[0].word.should.equal('little');
        res.body[0].should.have.property('type');
        res.body[0].type.should.equal('RB');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return an adverb by id', (done) => {
      chai.request(server)
      .get('/api/v1/adverbs/2')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; //jshint ignore:line
        res.body.should.be.a('array');
        res.body[0].should.have.property('word');
        res.body[0].word.should.equal('little');
        res.body[0].should.have.property('type');
        res.body[0].type.should.equal('RB');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return a 404 error for non-existent adverb', (done) => {
      chai.request(server)
      .get('/api/v1/adverbs/45')
      .end((err, res) => {
        res.should.have.status(404);
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
        res.body[0].word.should.equal('biggest');
        res.body[0].should.have.property('type');
        res.body[0].type.should.equal('JJS');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return an adjective by id', (done) => {
      chai.request(server)
      .get('/api/v1/adjectives/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; //jshint ignore:line
        res.body.should.be.a('array');
        res.body[0].should.have.property('word');
        res.body[0].word.should.equal('biggest');
        res.body[0].should.have.property('type');
        res.body[0].type.should.equal('JJS');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return a 404 error for non-existent adjective', (done) => {
      chai.request(server)
      .get('/api/v1/adjectives/45')
      .end((err, res) => {
        res.should.have.status(404);
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
        res.body[0].word.should.equal('Come');
        res.body[0].should.have.property('type');
        res.body[0].type.should.equal('NNP');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return a noun by id', (done) => {
      chai.request(server)
      .get('/api/v1/nouns/3')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; //jshint ignore:line
        res.body.should.be.a('array');
        res.body[0].should.have.property('word');
        res.body[0].word.should.equal('Come');
        res.body[0].should.have.property('type');
        res.body[0].type.should.equal('NNP');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return a 404 error for non-existent noun', (done) => {
      chai.request(server)
      .get('/api/v1/nouns/45')
      .end((err, res) => {
        res.should.have.status(404);
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

    it('should change the word type', (done) => {
      chai.request(server)
      .patch('/api/v1/verbs/1')
      .send({type: 'PPP',
             token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxhdXJhIiwicGFzc3dvcmQiOiJhTG92ZVRoYXROZWl0aGVyQ2FuRGVueSIsImlhdCI6MTQ5OTk4MDAyOCwiZXhwIjoxNTAxMTg5NjI4fQ.LEUtAZbdq03tD9XCx-K2rsM4Lu1_V19UE5yHSvd2cxs"
            })
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json; //jshint ignore:line
        done();
      });
    });

    it('should change the text sample title', (done) => {
      chai.request(server)
      .patch('/api/v1/text_samples/1')
      .send({
        title: 'Playful Secrets',
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxhdXJhIiwicGFzc3dvcmQiOiJhTG92ZVRoYXROZWl0aGVyQ2FuRGVueSIsImlhdCI6MTQ5OTk4MDAyOCwiZXhwIjoxNTAxMTg5NjI4fQ.LEUtAZbdq03tD9XCx-K2rsM4Lu1_V19UE5yHSvd2cxs"        })
      .end((err, res) => {
        res.should.have.status(201);
        res.should.be.json; //jshint ignore:line
        done();
      });
    });

    it('should be able to delete a non-word', (done) => {
      chai.request(server)
      .delete('/api/v1/nouns/3')
      .end((err, res) => {
        res.should.have.status(202);
        res.body.should.have.property('message');
        res.body.message.should.equal('deleted!');
        res.should.be.json; //jshint ignore:line
        done();
      });
    });

    it('should handle error of deleting a non-word', (done) => {
      chai.request(server)
      .delete('/api/v1/nouns/98')
      .end((err, res) => {
        res.should.have.status(422);
        res.should.be.json; //jshint ignore:line
        done();
      });
    });

    it('should be able to delete a text sample', (done) => {
      chai.request(server)
      .delete('/api/v1/text_samples/1')
      .end((err, res) => {
        res.should.have.status(202);
        done();
      });
    });

    it('should handle error of deleting a text sample', (done) => {
      chai.request(server)
      .delete('/api/v1/text_samples/98')
      .end((err, res) => {
        res.should.have.status(422);
        done();
      });
    });

    it('should post a new word to a text sample', (done) => {
      chai.request(server)
      .post('/api/v1/text_samples/1/new')
      .send({
        "word": "run",
        "type": "VB",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxhdXJhIiwicGFzc3dvcmQiOiJhTG92ZVRoYXROZWl0aGVyQ2FuRGVueSIsImlhdCI6MTQ5OTk4MDAyOCwiZXhwIjoxNTAxMTg5NjI4fQ.LEUtAZbdq03tD9XCx-K2rsM4Lu1_V19UE5yHSvd2cxs"
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
    });

    it('should return an error code for bad content', (done) => {
      chai.request(server)
      .post('/api/v1/text_samples/:id/new')
      .send({
        "word": "balloon",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxhdXJhIiwicGFzc3dvcmQiOiJhTG92ZVRoYXROZWl0aGVyQ2FuRGVueSIsImlhdCI6MTQ5OTk4MDAyOCwiZXhwIjoxNTAxMTg5NjI4fQ.LEUtAZbdq03tD9XCx-K2rsM4Lu1_V19UE5yHSvd2cxs"
        })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
    });

    it('should post a text sample', (done) => {
      chai.request(server)
      .post('/api/v1/text_samples/new')
      .send({
        "body":" Lady Sophie’s Society Splash When Sophie, the least interesting of the Talbot sisters, lands her philandering brother-in-law backside-first in a goldfish pond in front of all society, she becomes the target of very public aristocratic scorn. Her only choice is to flee London, vowing to start a new life far from the aristocracy. Unfortunately, the carriage in which she stows away isn’t saving her from ruin . . . it’s filled with it. Rogue’s Reign of Ravishment! Kingscote, King, the Marquess of Eversley, has never met a woman he couldn’t charm, resulting in a reputation far worse than the truth, a general sense that he’s more pretty face than proper gentleman, and an irate summons home to the Scottish border. When King discovers stowaway Sophie, however, the journey becomes anything but boring. War? Or More? He thinks she’s trying to trick him into marriage. She wouldn’t have him if he were the last man on earth. But carriages bring close quarters, dark secrets, and unbearable temptation, making opposites altogether too attractive . . .",
        "title":"The Rogue Not Taken: Scandal & Scoundrel, Book I",
        "adjectives":[{"word":"least","type":"JJS"}],
        "nouns":[{"word":"Lady","type":"NNP"}],
        "adverbs":[{"word":"very","type":"RB"}],
        "verbs":[{"word":"s","type":"VBZ"}],
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxhdXJhIiwicGFzc3dvcmQiOiJhTG92ZVRoYXROZWl0aGVyQ2FuRGVueSIsImlhdCI6MTQ5OTk4MDAyOCwiZXhwIjoxNTAxMTg5NjI4fQ.LEUtAZbdq03tD9XCx-K2rsM4Lu1_V19UE5yHSvd2cxs"
      })
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
    });

    it('should return an error code for bad content', (done) => {
      chai.request(server)
      .post('/api/v1/text_samples/:id/new')
      .send({
        "body": "balloon",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxhdXJhIiwicGFzc3dvcmQiOiJhTG92ZVRoYXROZWl0aGVyQ2FuRGVueSIsImlhdCI6MTQ5OTk4MDAyOCwiZXhwIjoxNTAxMTg5NjI4fQ.LEUtAZbdq03tD9XCx-K2rsM4Lu1_V19UE5yHSvd2cxs"
        })
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
    });

  });
});
