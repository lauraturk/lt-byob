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

    const re = new RegExp('[A-Za-z]', 'g');

    const punctuationRemove = text.split(" ").filter(word => re.test(word));

    const adjectiveFilter = punctuationRemove.filter(word => word.includes('/JJ')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.adjectives.push({word: splitWord[0], type: splitWord[1]});
      return acc;
    }, {adjectives: []});

    const nounFilter = punctuationRemove.filter(word => word.includes('/NN')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.nouns.push({word: splitWord[0], type: splitWord[1]});
      return acc;
    }, {nouns: []});

    const adverbFilter = punctuationRemove.filter(word => word.includes('/RB')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.adverbs.push({word: splitWord[0], type: splitWord[1]});
      return acc;
    }, {adverbs: []});

    const verbFilter = punctuationRemove.filter(word => word.includes('/VB')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.verbs.push({word: splitWord[0], type: splitWord[1]});
      return acc;
    }, {verbs: []});

    this.dataSet = Object.assign(this.dataSet, adjectiveFilter, nounFilter, adverbFilter, verbFilter);
    console.log(JSON.stringify(this.dataSet));
  }

  parseBlurb(result){
    this.dataSet = Object.assign(this.dataSet, result);

    const formData = new FormData();

    formData.append('text', result.text);
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
    nightmare.goto('https://www.amazon.com/gp/product/0062379410/ref=s9_acsd_simh_bw_c_x_3_w?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-8&pf_rd_r=W8QZTJHQ7RD4MSEHK6Y5&pf_rd_r=W8QZTJHQ7RD4MSEHK6Y5&pf_rd_t=101&pf_rd_p=0f07e705-9582-40bf-8f76-570b3c066756&pf_rd_p=0f07e705-9582-40bf-8f76-570b3c066756&pf_rd_i=23')
      .evaluate(() => {
      const title = document.getElementById('productTitle').innerText;

      const iframeSection = document.querySelector('#bookDesc_iframe');

      const pBlurb = iframeSection.contentWindow.document.body.querySelectorAll('p');

      let reducedBlurbs = '';

      pBlurb.forEach(blurb => {
        reducedBlurbs +=` ${blurb.innerText}`;
      });
      return { text: reducedBlurbs, title: title };
    })
    .end()
    .then((result) => this.parseBlurb(result))
    .catch((error) => console.log('search failed', error));
  }
}

const newData = new SetData();

newData.findSingleBook();

module.exports = SetData;
