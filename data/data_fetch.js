/*jshint esversion: 6 */

const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const FormData = require('form-data');
const fetch = require('node-fetch');

class SetData {
  constructor(){
    this.dataSet = {};
  }

  cleanResponseData(responseBody) {
    const text = responseBody.text;
    // console.log(responseBody.text, 'response body')

    const re = new RegExp('[A-Za-z]', 'g');

    const punctuationRemove = text.split(" ").reduce((accu, word, index) => {
      re.test(word) ? accu.push(`${word}/${index}`) : undefined; //jshint ignore:line
      return accu;
    }, []);

    const adjectiveFilter = punctuationRemove.filter(word => word.includes('/JJ')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.adjectives.push({word: splitWord[0], type: splitWord[1], index: splitWord[2]});
      return acc;
    }, {adjectives: []});

    const nounFilter = punctuationRemove.filter(word => word.includes('/NN')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.nouns.push({word: splitWord[0], type: splitWord[1], index: splitWord[2]});
      return acc;
    }, {nouns: []});

    const adverbFilter = punctuationRemove.filter(word => word.includes('/RB')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.adverbs.push({word: splitWord[0], type: splitWord[1], index: splitWord[2]});
      return acc;
    }, {adverbs: []});

    const verbFilter = punctuationRemove.filter(word => word.includes('/VB')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.verbs.push({word: splitWord[0], type: splitWord[1], index: splitWord[2]});
      return acc;
    }, {verbs: []});

    this.dataSet = Object.assign(this.dataSet, nounFilter, adverbFilter, verbFilter);
    console.log(this.dataSet);
  }

  parseBlurb(result){
    this.dataSet = Object.assign(this.dataSet, result);

    const formData = new FormData();

    formData.append('text', result.body);
    formData.append('output', 'tagged');

    fetch(`http://text-processing.com/api/tag/`, {
      method: "POST",
      body: formData
    })
    .then((response) => response.json())
    .then(data => this.cleanResponseData(data))
    .catch((error) => console.log("fetch failed", error));
  }

  findSingleBook(){
    nightmare.goto('https://www.amazon.com/gp/product/B01N6HKIN8/ref=s9_acsd_top_hd_bw_bN_c_x_1_w?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-11&pf_rd_r=VAAKNTE9NPRVGT953F6H&pf_rd_t=101&pf_rd_p=f08784a5-1fcb-51c0-b6f4-090a91f84a4c&pf_rd_i=23')
      .evaluate(() => {
      const title = document.getElementById('productTitle').innerText;

      const iframeSection = document.querySelector('#iframeContent');

      const pBlurb = iframeSection.contentWindow.document.body.querySelectorAll('p');

      let reducedBlurbs = '';

      pBlurb.forEach(blurb => {
        reducedBlurbs +=` ${blurb.innerText}`;
      });
      return { body: reducedBlurbs, title: title };
    })
    .end()
    .then((result) => this.parseBlurb(result))
    .catch((error) => console.log('search failed', error));
  }
}

const newData = new SetData();

newData.findSingleBook();

module.exports = SetData;
