var regexNomeCognome = /^[a-zA-Z]+$/;
var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function salvaRegistrazione() {
    var nome = document.getElementById("reg-name").value;
    var email = document.getElementById("reg-email").value;
    if (nome === "" || email === "") {
        alert("Inserisci tutti i dati per registrarti!");
        return;
    }

    if (!regexNomeCognome.test(nome)) {
        alert("Il nome deve contenere solo lettere!");
        return;
    }
    if (!regexEmail.test(email)) {
        alert("Inserisci un indirizzo email valido!");
        return;
    }
    var urlTarget = "upload.html?nome=" + encodeURIComponent(nome) +
        "&email=" + encodeURIComponent(email);

    window.location.href = urlTarget;
}