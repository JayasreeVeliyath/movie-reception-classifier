const TrainingData = require('./training_data.json')
const natural = require('natural')
const BrainJs = require('brain.js')

function buildWordBook(data) {
  const tokenisedArray = data.map(item => {
    const tokens = item.review.split(' ');
    return tokens.map(token => natural.PorterStemmer.stem(token))
  })
  const flattenedArray = [].concat.apply([], tokenisedArray)
  return flattenedArray.filter((item, pos, self) => self.indexOf(item) == pos)
}

const wordBook = buildWordBook(TrainingData)

function cipherReview (review) {
  const reviewTokens = review.split(' ')
  const cipheredReview = wordBook.map(word => reviewTokens.includes(word) ? 1 : 0)
  return cipheredReview;
}

const buildCipheredReviewAndResult = TrainingData.map(data => {
  const cipheredReview = cipherReview(data.review)
  return {input: cipheredReview, output: data.perception}
})

const network = new BrainJs.NeuralNetwork()
network.train(buildCipheredReviewAndResult)

const cipheredReview = cipherReview("Emotional movie about the bond between humans and dogs"); // Positive
//const cipheredReview = cipherReview("You don't need a woman to make a good movie"); // Negative
let prediction = network.run(cipheredReview);
if(prediction.positive >= prediction.negative) {
    console.log("Positive Reception");
}
else {
    console.log("Negative Reception");
}