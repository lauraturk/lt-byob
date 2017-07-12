# Build Your Own Backend - BYO-MadLib
#### A practice RESTful API that collects and parses book blurbs culled from Amazon's Best of the Month Romance Novel.

[Original Assignment](http://frontend.turing.io/projects/build-your-own-backend.html)

## End Points

### GET
* '/api/v1/text_samples' : returns a json response of all the original book blurb and book title
* '/api/v1/nouns' : returns a json response of all words labeled as Nouns (NN)
* '/api/v1/adjectives' : returns a json response of all words labeled as Adjectives (JJ)
* '/api/v1/adverbs' : returns a json response of all words labeled as Adverbs (RB)
* '/api/v1/verbs' : returns a json response of all words labeled as Verbs (VB)
* '/api/v1/:table/:id' : where :table parameter can be text_samples, verbs, nouns, adjectives, or adverbs to return a single resource by id

### DELETE
* '/api/v1/:table/:id' : where :table parament can be verbs, nouns, adjectives, or adverbs to delete a non-word or wrong word in database
* '/api/v1/text_samples/:id' : delete a single text sample and all related words

## Resources

#### Word Type Key:
##### Adjectives
* JJ - Adjective
* JJR - Adjective, comparative
* JJS - Adjective, superlative
##### Nouns
* NN - Noun, singular or mass
* NNS - Noun, plural
* NNP - Proper noun, singular
* NNPS - Proper noun, plural
##### Adverbs
* RB - Adverb
* RBR - Adverb, comparative
* RBS - Adverb, superlative
##### Verbs
* VB - Verb, base form
* VBD - Verb, past tense
* VBG - Verb, gerund or present participle
* VBN - Verb, past participle
* VBP - Verb, non-3rd person singular present
* VBZ - Verb, 3rd person singular present

##### More Resources
* [Amazon Books](https://www.amazon.com/books-used-books-textbooks/b/ref=nav_shopall_bo_t3?ie=UTF8&node=283155)
* [Text Processing.com(API)](http://text-processing.com/docs/tag.html)
* [Penn Treebank Tags](http://web.mit.edu/6.863/www/PennTreebankTags.html#ADJP)
* [Tutorial for setting up TDD test environment](http://mherman.org/blog/2016/04/28/test-driven-development-with-node/#.WWQ1M2RKXEY)
* [References for testing, knex, express](http://frontend.turing.io/lessons/)
