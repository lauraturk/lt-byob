# Build Your Own Backend - BYO-MadLib
#### A practice RESTful API that collects and parses book blurbs culled from Amazon's *Best of the Month* Romance Novel Section and Good Reads Romance novels. Every text sample is parsed and every word is tagged with its part of speech using textprocessing.com's API. This API gives you access to text samples and their corresponding four major categories of parts of speech: Nouns, Adverbs, Adjectives, and Verbs. Might there be a heaving bosom or a rakish cad to stir your heart? 

[Original Assignment](http://frontend.turing.io/projects/build-your-own-backend.html)

## End Points

### GET
* '/api/v1/text_samples' : returns a json response of all the original book blurb and book title
* '/api/v1/words' : returns a json response of all words
* '/api/v1/text_samples/:id' : returns a json response a specific text_sample
* '/api/v1/words/:id' : returns a json response of a single word
* '/api/v1/verbs' : returns a json response of all words labeled as Verbs
* '/api/v1/adverbs' : returns a json response of all words labeled as Adverbs
* '/api/v1/adjectives' : returns a json response of all words labeled as Adjectives
* '/api/v1/nouns' : returns a json response of all words labeled as Nouns
* '/api/v1/:text_samples/:id/words' : returns a json response of all the words for a given text sample by text sample id

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
