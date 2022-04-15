import Module from "./glue.js";

const arraySize = 10;

const makePtrOfArray = (myModule, arr) => {
  const arrayPtr = myModule._calloc(arr.length, 4);
  arr.forEach((n, idx) => {
    //console.log(n, idx);
    myModule.setValue(arrayPtr + idx * 4, n, "i32");
  });
  // for (let i = 1; i < arraySize + 1; i++) {
  //   //let rowsPtr = myModule._calloc(N, 4);
  //   myModule.setValue(arrayPtr + (i - 1) * 4, i, "i32");
  //   // for (let j = 0; j < N; j++) {
  //   //   myModule.setValue(rowsPtr + j * 4, sudokuMatrix[i][j], "i32");
  //   // }
  // }
  return arrayPtr;
};

// function printAllSubsetsRec(arr, n, v, sum) {
//   // If remaining sum is 0, then print all
//   // elements of current subset.
//   if (sum == 0) {
//     for (let x of v) console.log(x + " ");
//     console.log("<br>");
//     return;
//   }

//   // If no remaining elements,
//   if (n == 0) return;

//   // We consider two cases for every element.
//   // a) We do not include last element.
//   // b) We include last element in current subset.
//   printAllSubsetsRec(arr, n - 1, v, sum);
//   v.push(arr[n - 1]);
//   printAllSubsetsRec(arr, n - 1, v, sum - arr[n - 1]);
//   v.pop();
// }

// // Wrapper over printAllSubsetsRec()
// function printAllSubsets(arr, n, sum) {
//   let v = [];
//   printAllSubsetsRec(arr, n, v, sum);
// }

// // Driver code

// let arr = [1, 2, 3, 4, 5, 6];
// let sum = 13;
// let n = arr.length;
// printAllSubsets(arr, n, sum);

Module().then((mymod) => {
  var arr = [1, 2, 3, 4, 5];
  let arrPtr = makePtrOfArray(mymod, arr);
  let solver = mymod._printAllSubsets(arrPtr, arr.length, 6);
});
