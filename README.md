# Build Your Own Backend - BYO-MadLib
#### A practice RESTful API that collects and parses book blurbs culled from Amazon's *Best of the Month* Romance Novel Section. Every text sample is parsed and every word is tagged with a part of speech. This API gives you access to four major categories of parts of speech: Nouns, Adverbs, Adjectives, and Verbs. Might there be a heaving bosom or a rakish cad to stir your heart? 

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
* '/api/v1/:table/:id' : where :table parameter can be verbs, nouns, adjectives, or adverbs to delete a non-word or wrong word in database
* '/api/v1/text_samples/:id' : delete a single text sample and all related words

### PATCH - JWT authorization required
* '/api/v1/:table/:id : where :table parameter can be verbs, nouns, adjectives, or adverbs. Pass a json body of { "type" : "<new word type>" } to change the Word type according ot the list below. Ojo: Does not alter the table a word is in, changes should remain w/ in the relative word family (e.g. NN -> NNS)
* '/api/v1/text_samples/:id : Pass a json body of { "title": "<new title>" } to change the title of a text sample

### POST - JWT authorization required
* '/api/v1/text_samples/new' : In order to add a text sample and its subsequent words, Pass a json body with the properties of title (string), text (string), adjectives, nouns, adverbs, verbs (each an array of objects with {word: < word (string) >, type: < type (string)>}). Text samples can be webscraped and formatted by requiring and instantiating SetData from 'data/data_fetch.js' In data_fetch.js, change the url in line 69 to the URL of a specific book (Romance preferred) from Amazon.com (check first if the book description is formatted with < p > tags, not every book is!). Run ```node data/data_fetch.js``` and the formatted text and all the parsed and tagged words will console log.
* '/api/v1/text_samples/:id/new' : where :id is the text_sample the word is from. Pass a json object {"word": < word >, "type": < type > } Type must be one of the types listed below.

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
