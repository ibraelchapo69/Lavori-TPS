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
            else { tutteLeVariabili.push({ k: chiave, v: valore }); }
        }
    }

    for (var i = 0; i < totProdotti; i++) {
        var prodottoTrovato = {};
        for (var j = 0; j < tutteLeVariabili.length; j++) {
            var chiaveAttuale = tutteLeVariabili[j].k;
            var valAttuale = tutteLeVariabili[j].v;
            var prefisso = "prod" + i + "_";
            var grandezzaPrefisso = prefisso.length;

            if (chiaveAttuale.substring(0, grandezzaPrefisso) === prefisso) {
                var nomeCampoReale = chiaveAttuale.substring(grandezzaPrefisso);
                prodottoTrovato[nomeCampoReale] = valAttuale;
            }
        }
        prodotti.push(prodottoTrovato);
    }

    var estrattoreCart = "";
    for (var j = 0; j < tutteLeVariabili.length; j++) {
        if (tutteLeVariabili[j].k === "cart_ids") {
            estrattoreCart = tutteLeVariabili[j].v;
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

function tornaAlCatalogo() {
    var url = "catalogo.html?";
    url += "nome=" + encodeURIComponent(utenteNome) + "&";
    url += "email=" + encodeURIComponent(utenteEmail) + "&";

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

function rimuoviDalCarrello(indice) {
    var nuovoCarrello = [];
    for (var i = 0; i < carrello.length; i++) {
        if (i !== indice) {
            nuovoCarrello.push(carrello[i]);
        }
    }
    carrello = nuovoCarrello;

    document.getElementById("cart-count").textContent = carrello.length;
    renderCart();
}

function renderCart() {
    var cartItemsContainer = document.getElementById("cart-items");
    var cartSummary = document.getElementById("cart-summary");

    if (carrello.length === 0) {
        cartItemsContainer.innerHTML = "<p>Il carrello è vuoto. Torna al catalogo e aggiungi qualche prodotto per procedere con l'acquisto.</p>";
        cartSummary.style.display = "none";
        return;
    }

    cartSummary.style.display = "block";
    var total = 0;

    var htmlString = "";

    for (var i = 0; i < carrello.length; i++) {
        var prod = carrello[i];

        var title = "Prodotto Sconosciuto";
        if (prod.titolo) { title = prod.titolo; }
        else if (prod.nome) { title = prod.nome; }

        var categoria = "Prodotto";
        if (prod.categoria) { categoria = prod.categoria; }

        var priceStr = "0";
        if (prod.prezzo) { priceStr = prod.prezzo; }
        else if (prod.price) { priceStr = prod.price; }

        var priceArr = priceStr.split(",");
        if (priceArr.length > 1) {
            priceStr = priceArr[0] + "." + priceArr[1];
        }

        var priceVal = parseFloat(priceStr);
        if (!priceVal) { priceVal = 0; }
        total = total + priceVal;

        htmlString = htmlString +
            "<div class='cart-item fade-in'>" +
            "<div style='display: flex; align-items: center;'>" +
            "<span class='product-type' style='margin-right: 15px; margin-bottom: 0;'>" + categoria + "</span>" +
            "<span class='cart-item-title'>" + title + "</span>" +
            "</div>" +
            "<div style='display: flex; align-items: center;'>" +
            "<span class='cart-item-price'>€ " + priceVal + "</span>" +
            "<button class='remove-btn' style='margin-left: 20px;' onclick='rimuoviDalCarrello(" + i + ")'>Rimuovi</button>" +
            "</div>" +
            "</div>";
    }

    cartItemsContainer.innerHTML = htmlString;
    document.getElementById("cart-total").textContent = total;
}

function perfezionaAcquisto() {
    if (carrello.length === 0) {
        return;
    }

    var doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246);
    doc.text("Riepilogo Ordine - ShopPremium", 15, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Dati Cliente:", 15, 35);

    doc.setFontSize(12);
    doc.text("Nome: " + utenteNome, 15, 45);
    doc.text("Email: " + utenteEmail, 15, 52);

    doc.setFontSize(14);
    doc.text("Prodotti Acquistati:", 15, 70);

    doc.setFontSize(11);
    var y = 80;
    var total = 0;

    for (var i = 0; i < carrello.length; i++) {
        var prod = carrello[i];
        var title = "Prodotto Sconosciuto";
        if (prod.titolo) { title = prod.titolo; }
        else if (prod.nome) { title = prod.nome; }

        var cat = "Articolo";
        if (prod.categoria) { cat = prod.categoria; }

        var priceStr = "0";
        if (prod.prezzo) { priceStr = prod.prezzo; }
        else if (prod.price) { priceStr = prod.price; }

        var priceArr = priceStr.split(",");
        if (priceArr.length > 1) {
            priceStr = priceArr[0] + "." + priceArr[1];
        }

        var priceVal = parseFloat(priceStr);
        if (!priceVal) { priceVal = 0; }
        total = total + priceVal;

        var lineItem = (i + 1) + ". [" + cat.toUpperCase() + "] " + title + " - €" + priceVal;
        doc.text(lineItem, 15, y);
        y = y + 8;

        if (y > 275) {
            doc.addPage();
            y = 20;
        }
    }

    y = y + 10;
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129);
    doc.text("Totale Pagato: €" + total, 15, y);

    doc.save("Riepilogo_Acquisto_ShopPremium.pdf");

    carrello = [];
    document.getElementById("cart-count").textContent = "0";
    alert("Acquisto perfezionato con successo!");

    tornaAlCatalogo();
}

renderCart();
