/*jshint esversion: 6 */

const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const FormData = require('form-data');
const fetch = require('node-fetch');

let blurb = {body: "Conquering a supernatural realm turned out to be easier than getting over a broken heart. But her initial victory has made Ivy a target for revenge, forcing her to reunite with the dangerous—and dangerously sexy—Adrian. Ivy isn't sure which will be harder: finding the hallowed weapon that will repair the crumbling walls between the demon and human realms, or resisting Adrian, who's decided that come hell or high water, he will make Ivy his.",
title: "The Sweetest Burn"}

class SetData {
  constructor(){
    this.dataSet = {};
  }

  cleanResponseData(responseBody) {
    const text = responseBody.text;

    const re  = new RegExp(/([A-Za-z][^\x27\x53\x22])\w+/ig)

    const punctuationRemove = text.split(" ").reduce((accu, word, index) => {
      re.test(word) ? accu.push(`${word}/${index}`) : undefined; //jshint ignore:line
      return accu;
    }, []);

    const wordFilter = punctuationRemove.filter(word => {
      return word.includes('/JJ') || word.includes('/NN') || word.includes('/RB') || word.includes('/VB')
    }).reduce((acc, word) => {
      const splitWord = word.split('/');
      if(splitWord[0] === 't' || splitWord[0] === 's' || splitWord[0] === 'll' || splitWord[0] === "ve" || splitWord[0] === "d"){
        return acc;
      }
      acc.words.push({word: splitWord[0], type: splitWord[1], index: splitWord[2]});
      return acc;
    }, {words: []})

    // const nounFilter = punctuationRemove.filter(word => word.includes('/NN')).reduce((acc, word) => {
    //   const splitWord = word.split('/');
    //
    //   if(splitWord[0] === 't' || splitWord[0] === 's' || splitWord[0] === 'll' || splitWord[0] === "ve" || splitWord[0] === "d"){
    //     return acc;
    //   }
    //   acc.nouns.push({word: splitWord[0], type: splitWord[1], index: splitWord[2]});
    //   return acc;
    // }, {nouns: []});
    //
    // const adverbFilter = punctuationRemove.filter(word => word.includes('/RB')).reduce((acc, word) => {
    //   const splitWord = word.split('/');
    //   if(splitWord[0] === 't' || splitWord[0] === 's' || splitWord[0] === 'll' || splitWord[0] === "ve" || splitWord[0] === "d"){
    //     return acc;
    //   }
    //   acc.adverbs.push({word: splitWord[0], type: splitWord[1], index: splitWord[2]});
    //   return acc;
    // }, {adverbs: []});
    //
    // const verbFilter = punctuationRemove.filter(word => word.includes('/VB')).reduce((acc, word) => {
    //   const splitWord = word.split('/');
    //
    //   if(splitWord[0] === 't' || splitWord[0] === 's' || splitWord[0] === 'll' || splitWord[0] === "ve" || splitWord[0] === "d"){
    //     return acc;
    //   }
    //   acc.verbs.push({word: splitWord[0], type: splitWord[1], index: splitWord[2]});
    //   return acc;
    // }, {verbs: []});

    this.dataSet = Object.assign(this.dataSet, wordFilter);
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

  // findSingleBook(){
  //   nightmare.goto('https://www.amazon.com/gp/product/B01N6HKIN8/ref=s9_acsd_top_hd_bw_bN_c_x_1_w?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=merchandised-search-11&pf_rd_r=VAAKNTE9NPRVGT953F6H&pf_rd_t=101&pf_rd_p=f08784a5-1fcb-51c0-b6f4-090a91f84a4c&pf_rd_i=23')
  //     .evaluate(() => {
  //     const title = document.getElementById('productTitle').innerText;
  //
  //     const iframeSection = document.querySelector('#iframeContent');
  //
  //     const pBlurb = iframeSection.contentWindow.document.body.querySelectorAll('p');
  //
  //     let reducedBlurbs = '';
  //
  //     pBlurb.forEach(blurb => {
  //       reducedBlurbs +=` ${blurb.innerText}`;
  //     });
  //     return { body: reducedBlurbs, title: title };
  //   })
  //   .end()
  //   .then((result) => this.parseBlurb(result))
  //   .catch((error) => console.log('search failed', error));
  // }
}

const newData = new SetData();

newData.parseBlurb(blurb);




module.exports = SetData;
