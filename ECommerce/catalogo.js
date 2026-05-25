var prodotti = [];
var carrello = [];

var utenteNome = "";
var utenteEmail = "";
var totProdotti = 0;

var queryString = window.location.search;
var tutteLeVariabili = [];

if (queryString !== "") {
    var qString = queryString.substring(1);
    var coppie = qString.split("&");

    for (var k = 0; k < coppie.length; k++) {
        var arrayTemporaneo = coppie[k].split("=");
        if (arrayTemporaneo.length > 1) {
            var chiave = arrayTemporaneo[0];
            var valore = decodeURIComponent(arrayTemporaneo[1]);

            if (chiave === "nome") { utenteNome = valore; }
            else if (chiave === "email") { utenteEmail = valore; }
            else if (chiave === "totProdotti") { totProdotti = parseInt(valore); }
            else {
                var v = { k: chiave, v: valore };
                tutteLeVariabili.push(v);
            }
        }
    }

    for (var i = 0; i < totProdotti; i++) {

        var prodottoOggetto = {};
        var prefissoDaCercare = "prod" + i + "_";
        var lunghezzaPrefisso = prefissoDaCercare.length;

        for (var j = 0; j < tutteLeVariabili.length; j++) {
            var stringaChiave = tutteLeVariabili[j].k;
            var stringaValore = tutteLeVariabili[j].v;

            if (stringaChiave.substring(0, lunghezzaPrefisso) === prefissoDaCercare) {
                var nomeRipristinato = stringaChiave.substring(lunghezzaPrefisso);
                prodottoOggetto[nomeRipristinato] = stringaValore;
            }
        }

        prodotti.push(prodottoOggetto);
    }

    var estrattoreCart = "";
    for (var a = 0; a < tutteLeVariabili.length; a++) {
        if (tutteLeVariabili[a].k === "cart_ids") {
            estrattoreCart = tutteLeVariabili[a].v;
        }
    }
    if (estrattoreCart !== "") {
        var identitificatori = estrattoreCart.split(",");
        for (var idn = 0; idn < identitificatori.length; idn++) {
            var mioId = identitificatori[idn];
            for (var px = 0; px < prodotti.length; px++) {
                if (prodotti[px].id === mioId) {
                    carrello.push(prodotti[px]);
                }
            }
        }
        document.getElementById("cart-count").textContent = carrello.length;
    }
}

function aggiungiAlCarrello(productId) {
    for (var i = 0; i < prodotti.length; i++) {
        if (prodotti[i].id === productId) {
            carrello.push(prodotti[i]);
            break;
        }
    }
    document.getElementById("cart-count").textContent = carrello.length;
    alert("Prodotto aggiunto al carrello!");
}

function vediCarrello() {
    var url = "carrello.html?nome=" + encodeURIComponent(utenteNome) + "&email=" + encodeURIComponent(utenteEmail) + "&";

    for (var i = 0; i < prodotti.length; i++) {
        var p = prodotti[i];

        for (var chiave in p) {
            var chiaveUnificata = "prod" + i + "_" + chiave;
            url += chiaveUnificata + "=" + encodeURIComponent(p[chiave]) + "&";
        }
    }
    url += "totProdotti=" + prodotti.length + "&";

    var idNelCarrello = [];
    for (var c = 0; c < carrello.length; c++) {
        idNelCarrello.push(carrello[c].id);
    }

    if (idNelCarrello.length > 0) {
        url += "cart_ids=" + encodeURIComponent(idNelCarrello.join(",")) + "&";
    }

    window.location.href = url;
}

function renderProducts() {
    var productsGrid = document.getElementById("products-grid");
    var htmlString = "";

    for (var i = 0; i < prodotti.length; i++) {
        var prod = prodotti[i];

        var id = prod.id;

        var titolo = "Prodotto Sconosciuto";
        if (prod.titolo) { titolo = prod.titolo; }
        else if (prod.nome) { titolo = prod.nome; }

        var categoria = "Prodotto";
        if (prod.categoria) { categoria = prod.categoria; }
        else if (prod.category) { categoria = prod.category; }

        var prezzoStr = "0";
        if (prod.prezzo) { prezzoStr = prod.prezzo; }
        else if (prod.price) { prezzoStr = prod.price; }
        var priceVal = parseFloat(prezzoStr);
        if (!priceVal) { priceVal = 0; }

        var restantiDettagli = "<ul>";
        for (var parametroCsv in prod) {
            var saltatoDaControllo = false;
            if (parametroCsv === "id") saltatoDaControllo = true;
            if (parametroCsv === "titolo") saltatoDaControllo = true;
            if (parametroCsv === "nome") saltatoDaControllo = true;
            if (parametroCsv === "categoria") saltatoDaControllo = true;
            if (parametroCsv === "category") saltatoDaControllo = true;
            if (parametroCsv === "prezzo") saltatoDaControllo = true;
            if (parametroCsv === "price") saltatoDaControllo = true;

            if (saltatoDaControllo === false && prod[parametroCsv] !== "") {
                restantiDettagli += "<li><strong>" + parametroCsv + ":</strong> " + prod[parametroCsv] + "</li>";
            }
        }
        restantiDettagli += "</ul>";

        htmlString = htmlString +
            "<div class='product-card fade-in'>" +
            "<div class='product-type'>" + categoria + "</div>" +
            "<div class='product-title'>" + titolo + "</div>" +
            "<div class='product-details'>" + restantiDettagli + "</div>" +
            "<div class='product-price'>€ " + priceVal + "</div>" +
            "<button class='btn-primary add-to-cart-btn' onclick='aggiungiAlCarrello(\"" + id + "\")'>Aggiungi al Carrello</button>" +
            "</div>";
    }

    productsGrid.innerHTML = htmlString;
}

renderProducts();
