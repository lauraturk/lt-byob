/*jshint esversion: 6 */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

  describe('GET routes', () => {
    beforeEach((done) => {
      knex.seed.run();
      done();
    });

    it('should return all text samples', () => {
      chai.request(server)
      .get('api/v1/text_samples')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; //jshint ignore:line
        res.body.should.be.a('array');
        res.body[0].should.have.property('title');
        res.body[0].title.should.equal('Serenity Harbor: A Heartwarming Small Town Romance (Haven Point)');
        res.body[0].should.have.property('body');
        res.body[0].body.should.be.a('string');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return all verbs', () => {
      chai.request(server)
      .get('api/v1/verbs')
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

    it('should return all adverbs', () => {
      chai.request(server)
      .get('api/v1/adverbs')
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

    it('should return all adjectives', () => {
      chai.request(server)
      .get('api/v1/adjectives')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json; //jshint ignore:line
        res.body.should.be.a('array');
        res.body[0].should.have.property('word');
        res.body[0].word.should.equal('idyllic');
        res.body[0].should.have.property('type');
        res.body[0].type.should.equal('JJ');
        res.body[0].should.have.property('id');
        done();
      });
    });

    it('should return all nouns', () => {
      chai.request(server)
      .get('api/v1/nouns')
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

    // it.only('should return a specific noun', () => {
    //   chai.request(server)
    //   .get('api/v1/sad')
    //   .end((err, res) => {
    //     res.should.have.status(200);
    //     res.should.be.json; //jshint ignore:line
    //     res.body.should.be.a('array');
    //     res.body[0].should.have.property('word');
    //     res.body[0].word.should.equal('Come');
    //     res.body[0].should.have.property('type');
    //     res.body[0].type.should.equal('NNP');
    //     res.body[0].should.have.property('id');
    //     done();
    //   });
    // });

  });
