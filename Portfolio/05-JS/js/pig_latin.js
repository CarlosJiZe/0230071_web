/*
Pig Latin
*/

window.onload = function() {
  // Asigna el evento al botón al hacer clic
  document.getElementById('btn').onclick = function() {
    var inputText = document.getElementById('txtVal').value; // Obtiene el texto del input
    var pigLatinText = igpayAtinlay(inputText); // Convierte el texto a Pig Latin
    document.getElementById('pigLatLbl').textContent = pigLatinText; // Muestra el resultado
  };
};

function igpayAtinlay(str) {
  // TODO: Initialize the word array properly
  var returnArray = [],
    wordArray = str.split(" ");
  // TODO: make sure that the output is being properly built to produce the desired result.
  for (var i = 0; i < wordArray.length; i++) {
    var word = wordArray[i];
    var beginning = word.charAt(0);

    if (/[aeiouAEIOU]/.test(beginning)) {
      returnArray.push(word+"way");
      continue;
    }

    var consonantCluster = beginning;
    var restOfWord = "";

    for (var ii = 1; ii < word.length; ii++) {
      if (/[aeiouAEIOU]/.test(word.charAt(ii))) {
        restOfWord = word.slice(ii);
        break;
      } else {
        consonantCluster += word.charAt(ii);
      }
    }
    returnArray.push(restOfWord + consonantCluster + "ay");
  }
  return returnArray.join(" ");
}


console.log(igpayAtinlay("pizza")); // "izzapay"
console.log(igpayAtinlay("apple")); // "appleway"
console.log(igpayAtinlay("happy meal")); // "appyhay ealmay"


