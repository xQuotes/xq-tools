var firstToUpperCase = function (word) {
  var arr = word[0].toUpperCase()
  arr = arr + word.slice(1)
  return arr
}

module.exports = {
  firstToUpperCase
}