# Build Your Own Backend - BYO-MadLib
#### A practice RESTful API that collects and parses book blurbs culled from Amazon's Best of the Month Romance Novel.

[Original Assignment](http://frontend.turing.io/projects/build-your-own-backend.html)

## End Points

### GET
* '/api/v1/text_samples' : returns a json response of all the original book blurb and book title
* '/api/v1/nouns' : returns a json response of all words labeled as Nouns (NN)
* '/api/v1/adjectives' : returns a json response of all words labeled as Adjectives (JJ)
* '/api/v1/adverbs' : returns a json response of all words labeled as Adverbs (RB)
* '/api/v1/verbs' : returns a json response of all words labeled as verbs (VB)

#### Word Type Key:

* JJ - Adjective
* JJR - Adjective, comparative
* JJS - Adjective, superlative

* NN - Noun, singular or mass
* NNS - Noun, plural
* NNP - Proper noun, singular
* NNPS - Proper noun, plural

* RB - Adverb
* RBR - Adverb, comparative
* RBS - Adverb, superlative

* VB - Verb, base form
* VBD - Verb, past tense
* VBG - Verb, gerund or present participle
* VBN - Verb, past participle
* VBP - Verb, non-3rd person singular present
* VBZ - Verb, 3rd person singular present


## Resources
* [Amazon Books](https://www.amazon.com/books-used-books-textbooks/b/ref=nav_shopall_bo_t3?ie=UTF8&node=283155)
* [Text Processing.com(API)](http://text-processing.com/docs/tag.html)
* [Penn Treebank Tags](http://web.mit.edu/6.863/www/PennTreebankTags.html#ADJP)
