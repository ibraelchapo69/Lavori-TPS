function generaNumeri() {
const arr = [];
const arr1 = [];
let somma = 0;
let max = -Infinity;
let min = Infinity;
let n = 0;

for (let i = 0; i < 100; i++) {
n = Math.floor(Math.random() * 201) - 100;
arr[i] = n;
somma += n;
if (n > max) max = n;
if (n < min) min = n;
}

let media = somma / arr.length;

for (let i = 0; i < arr.length; i++) {
if (arr[i] > 50){
arr1.push(arr[i]);
}
}

document.getElementById("media").innerHTML = media;
document.getElementById("max").innerHTML = max;
document.getElementById("min").innerHTML = min;


let vettoreHTML = "";
for (let i = 0; i < arr.length; i++) {
vettoreHTML += arr[i] + " ";
}
document.getElementById("vettore").innerHTML = vettoreHTML;


let grigliaHTML = "";
for (let i = 0; i < arr1.length; i++) {
grigliaHTML += arr1[i] + " ";
}
document.getElementById("griglia").innerHTML = grigliaHTML;
}