//import { isAnyArrayBuffer } from "util/types";
import Module from "./glue.js";
import timeParticion from "./solutionJS.js";


//para que la cantidad de nueros en el arreglo sea
// el minimo entre ARRAY_Lngth y el numero mismo
const ARRAY_LENGTH = 20;

var mod = null;

document.getElementById("target").onkeypress = function (e) {
  e.preventDefault();
};
document.getElementById("target").onkeydown = function (e) {
  if (e.keyCode != 38 && e.keyCode != 40) e.preventDefault();
};
if (document.addEventListener)
  document.getElementById("target").addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );

const button = document.getElementById("calcBtn");
button.addEventListener("click", GenArray);

const tArray = document.getElementById("array");
tArray.addEventListener("onchange", Calculate);

const answers = {
  0: "Existing Subarrays!",
  1: "No subarrays available!",
  2: "Pls enter a valid positive integer",
};

const makePtrOfArray = (myModule, ogArray, arrLength, dims) => {
  var arrayPtr = null;
  // Si la dimension es 1, queremos ahcer un puntero con el TargetArray
  if (dims === 1) {
    arrayPtr = myModule._calloc(arrLength, 4);
    for (let i = 0; i < arrLength; i++) {
      myModule.setValue(arrayPtr + i * 4, ogArray[i], "i32");
    }
  }
  // Si la dimension es 2, queremos hacer un doble puntero para recibir los resultados (subarreglos)
  else {
    arrayPtr = myModule._calloc(arrLength, 4);
    for (let i = 0; i < arrLength; i++) {
      var rowsPtr = myModule._calloc(arrLength, 4);
      myModule.setValue(arrayPtr + i * 4, rowsPtr, "i32");
      for (let j = 0; j < arrLength; j++) {
        myModule.setValue(rowsPtr + j * 4, -1, "i32");
      }
    }
  }

  return arrayPtr;
};

const getArrayFromPtr = (myModule, resultArrPtr, resultArrLength) => {
  //let resultMatrix = matrix(9, 9);
  var arr = [];
  for (let i = 0; i < resultArrLength; i++) {
    arr.push([]);
    let rowsPtr = myModule.getValue(resultArrPtr + i * 4, "i32");
    for (let j = 0; j < resultArrLength; j++) {
      let val = myModule.getValue(rowsPtr + j * 4, "i32");
      if (val !== -1) {
        arr[i].push(val);
      }
    }
  }
  let final = arr.filter((val) => val.some((v) => true));
  return final;
};

function calcTargetArray(targetNum, inputLength) {
  var arr = [];
  var lenBound = Math.min(targetNum, inputLength);
  for (let i = 0; i < lenBound; i++) {
    arr.push(randomInteger(1, Math.max(1, targetNum - 1)));
  }
  return arr;
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CalculateC() {
  // Para calcular el tiempo de ejecucion
  var start = Date.now();
  // Primero obtenemos el Target Value (Suma) y el  largo deseado del arreglo a generar
  var targetNum = document.getElementById("target").value;
  var targetArray = "["+document.getElementById("array").innerHTML+"]";
  //console.log(targetArray)
  targetArray = JSON.parse(targetArray);
  // Hacemos el puntero del arreglo que va a representar al target Array
  let targetArrayPtr = makePtrOfArray(mod, targetArray, targetArray.length, 1);

  // Hacemos el puntero que va a contener al resultado (los subconjuntos)
  var amountOfSubs = (targetArray.length * (targetArray.length + 1)) / 2;
  let resultArrPtr = makePtrOfArray(mod, null, amountOfSubs, 2);

  // Le pasamos el puntero doble que recibe el resultado, arreglo target, largo del arreglo target, y Target Value
  // solver = 0, 1 o 2
  let solver = mod._printAllSubsets(
    resultArrPtr,
    targetArrayPtr,
    targetArray.length,
    targetNum
  );
  // Mostramos un string de confirmacion
  var answerString = answers[solver];
  document.getElementById("answerString").innerHTML = answerString;

  // Si el solver encontro Subarrays, entonces los mostramos
  if (solver === 0) {
    var finalArray = getArrayFromPtr(mod, resultArrPtr, amountOfSubs);
    ////console.log(finalArray);
    displayFinalArray(finalArray);
  }

  mod._freeMatrix(resultArrPtr, amountOfSubs);
  mod._free(targetArrayPtr);

  var duration = Date.now() - start;
  document.getElementById("wasmTime").innerHTML = duration;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const displayFinalArray = (arr) => {
  var results = document.getElementById("subarrays");
  removeAllChildNodes(results);
  arr.forEach((subArr) => {
    //console.log(subArr);
    results.innerHTML += `<p>${subArr}</p>`;
  });
};

Module().then((mymod) => {
  mod = mymod;
});

function GenArray(){
  console.log("GEN");
  // Primero obtenemos el Target Value (Suma) y el  largo deseado del arreglo a generar
  var targetNum = document.getElementById("target").value;
  var inputLength = document.getElementById("arrLength").value;
  // Luego calculamos aleatorio los elementos de ese arreglo y lo mostramos
  var targetArray = calcTargetArray(targetNum, inputLength);
  document.getElementById("array").innerHTML = targetArray;

  Calculate();
}

async function CalculateJS(){
  var start = Date.now();
  console.log("CalulcateJS");
  var tArray = "["+document.getElementById("array").innerHTML+"]";
  tArray = JSON.parse(tArray);
  console.log(tArray);
  var targetNum = document.getElementById("target").value;
  console.log(targetNum);
  var results = await timeParticion(tArray, targetNum);
  console.log(results);
  var subarrays = "";
  results[0].forEach((r) => {
    subarrays = subarrays + r.toString() + "<br>";
    console.log(subarrays)
  })
  document.getElementById("subarraysJS").innerHTML = subarrays;

  var duration = Date.now() - start;

  document.getElementById("jsTime").innerHTML = duration;
}

function Calculate(){
  CalculateC();
  CalculateJS();
}