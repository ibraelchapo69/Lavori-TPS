var utenteNome = "";
var utenteEmail = "";

var queryString = window.location.search;
if (queryString !== "") {
    var qString = queryString.substring(1);
    var coppie = qString.split("&");

    for (var k = 0; k < coppie.length; k++) {
        var coppia = coppie[k].split("=");
        var chiave = coppia[0];
        var valore = coppia[1];

        if (chiave === "nome") {
            utenteNome = decodeURIComponent(valore);
            if (document.getElementById("nome-saluto")) {
                document.getElementById("nome-saluto").textContent = utenteNome;
            }
        } else if (chiave === "email") {
            utenteEmail = decodeURIComponent(valore);
        }
    }
}


var fileInput = document.getElementById("csv-file");
var fileNameDisplay = document.getElementById("file-name");
var btnLoadCsv = document.getElementById("btn-load-csv");

var prodottiPronti = [];

fileInput.onchange = function () {
    var file = this.files[0];
    if (!file) return;

    fileNameDisplay.textContent = file.name;
    btnLoadCsv.disabled = false;

    var reader = new FileReader();

    reader.onload = function (e) {
        var testo = e.target.result;
        var dati = parseCSV(testo);
        prodottiPronti = dati;
    };

    reader.readAsText(file);
};

function myTrim(str) {
    if (!str) return "";
    return str.replace(/^\s+|\s+$/g, '');
}

function parseCSV(testo) {
    var righe = testo.split("\n");
    var parsedProducts = [];

    var headerRow = righe[0].split(',');
    var headers = [];
    for (var h = 0; h < headerRow.length; h++) {
        headers.push(myTrim(headerRow[h].toLowerCase()));
    }

    for (var i = 1; i < righe.length; i++) {
        if (myTrim(righe[i]) === "") continue;

        var row = righe[i].split(',');
        var product = {};

        for (var j = 0; j < headers.length; j++) {
            var val = row[j];
            if (val !== undefined) {
                val = myTrim(val);
                var virgoletta = '"';
                if (val[0] === virgoletta && val[val.length - 1] === virgoletta) {
                    val = val.substring(1, val.length - 1);
                }
                product[headers[j]] = val;
            } else {
                product[headers[j]] = "";
            }
        }

        product.id = 'prod_' + i;
        parsedProducts.push(product);
    }

    return parsedProducts;
}

btnLoadCsv.onclick = function () {
    trasmettiTuttoAlCatalogo(prodottiPronti);
};

function trasmettiTuttoAlCatalogo(parsedProducts) {
    var url = "catalogo.html?";

    url += "nome=" + encodeURIComponent(utenteNome) + "&";
    url += "email=" + encodeURIComponent(utenteEmail) + "&";
    for (var i = 0; i < parsedProducts.length; i++) {
        var p = parsedProducts[i];

        for (var chiave in p) {
            var chiaveUnificata = "prod" + i + "_" + chiave;
            url += chiaveUnificata + "=" + encodeURIComponent(p[chiave]) + "&";
        }
    }

    url += "totProdotti=" + parsedProducts.length;

    window.location.href = url;
}
