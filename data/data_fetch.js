const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const FormData = require('form-data');
const fetch = require('node-fetch');

const cleanTitle = require('./cleanData')
const cleanResponseData = require('./cleanData')

class SetData {
  constructor(){
    this.dataSet = {}
  }

  cleanResponseData(responseBody) {
    const text = responseBody.text

    const re = new RegExp('[A-Za-z]', 'g')

    const punctuationRemove = text.split(" ").filter(word => re.test(word));

    const adjectiveFilter = punctuationRemove.filter(word => word.includes('/JJ')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.adjectives.push({word: splitWord[0], type: splitWord[1]});
      return acc
    }, {adjectives: []});

    const nounFilter = punctuationRemove.filter(word => word.includes('/NN')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.nouns.push({word: splitWord[0], type: splitWord[1]});
      return acc
    }, {nouns: []});

    const adverbFilter = punctuationRemove.filter(word => word.includes('/RB')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.adverbs.push({word: splitWord[0], type: splitWord[1]});
      return acc
    }, {adverbs: []});

    const verbFilter = punctuationRemove.filter(word => word.includes('/VB')).reduce((acc, word) => {
      const splitWord = word.split('/');
      acc.verbs.push({word: splitWord[0], type: splitWord[1]});
      return acc
    }, {verbs: []});

    this.dataSet = Object.assign(this.dataSet, adjectiveFilter, nounFilter, adverbFilter, verbFilter);
    console.log(this.dataSet)
  }

  parseBlurb(result){
    console.log(result);
    this.dataSet = Object.assign(this.dataSet, result)

    const formData = new FormData()

    formData.append('text', result.text)
    formData.append('output', 'tagged')

    fetch(`http://text-processing.com/api/tag/`, {
      method: "POST",
      body: formData
    })
    .then((response) => response.json())
    .then(data => this.cleanResponseData(data))
    .catch((error) => console.log("fetch failed", error))
  }

  findSingleBook(){
    nightmare.goto('https://www.amazon.com/gp/product/037379939X/ref=s9_acsd_ri_bw_c_x_3_w?ie=UTF8&pd_rd_r=SSZE2RHC14TSQW0N7BHB&pd_rd_w=dobJT&pd_rd_wg=nAdo9&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-3&pf_rd_r=SSZE2RHC14TSQW0N7BHB&pf_rd_r=SSZE2RHC14TSQW0N7BHB&pf_rd_t=101&pf_rd_p=a1277808-1403-4540-81ee-a5610c0d5c83&pf_rd_p=a1277808-1403-4540-81ee-a5610c0d5c83&pf_rd_i=4919320011')
      .evaluate(() => {
      const title = document.getElementById('productTitle').innerText;

      const iframeSection = document.querySelector('#bookDesc_iframe')

      const pBlurb = iframeSection.contentWindow.document.body.querySelectorAll('p')

      let reducedBlurbs = '';

      pBlurb.forEach(blurb => {
        reducedBlurbs +=` ${blurb.innerText}`
      })
      return { text: reducedBlurbs, title: title }
    })
    .end()
    .then((result) => this.parseBlurb(result))
    .catch((error) => console.log('search failed', error));
  }
}

module.exports = SetData
