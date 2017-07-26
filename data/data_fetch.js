/*jshint esversion: 6 */

const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const FormData = require('form-data');
const fetch = require('node-fetch');

let blurb = {body: 'Working as an informant for the DEA, Victoria Monzelle is used to living on the edge. But she\'s not a big fan of getting kidnapped. And definitely not by a bunch of bad boy witches with fancy-colored fire to shoot at people. So when Adam Dunne shows up and claims to be a witch enforcer, she\'s not going to put her life in his hands based on his word, no matter how smooth and smart and beautifully Irish his words sound. But on the run from a tribunal of witches, she isn\'t going to make it far. . . Before she knows it, Adam\'s word is all that stands between her and execution. Sophisticated, just-gotta-ruffle-him Adam has vowed to make her his one eternal mate, -RT Book Reviews on Marked, 4.5 Stars Top Pick. But Tori isn\'t interested in being anyone\'s pity date. And if they think she\'s unpredictable now, they should see what\'s coming next . . . "Hot and fast from beginning to end." -Kate Douglas on Fated', title: 'witchshit'}

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
