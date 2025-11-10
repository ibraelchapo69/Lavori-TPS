function stampa() {
    const nome = document.getElementById("nome").value;
    const cognome = document.getElementById("cognome").value;
    const indirizzo = document.getElementById("indirizzo").value;
    const citta = document.getElementById("citta").value;
    const cap = document.getElementById("cap").value;
    const eta = parseInt(document.getElementById("eta").value);
    const dataNascita = document.getElementById("dataNascita").value;

    var radios = document.getElementsByName("sesso");
    var sesso = "Non specificato";
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        sesso = radios[i].value;
        break;
      }
    }

    const provincia = document.getElementById("provincia").value;

    var checkbox = document.getElementsByName("mezzi");
    var mezzi = [];
    for (var i = 0; i < checkbox.length; i++) {
      if (checkbox[i].checked) {
        mezzi.push(checkbox[i].value);
      }
    }

    const materie = Array.from(document.getElementById("materie").selectedOptions).map(opt => opt.value);

    if (materie.length > 3) {
      alert("Puoi selezionare al massimo 3 materie.");
      return;
    }

    let generazione = "";
    switch (true) {
      case eta <= 12:
        generazione = "Generazione Alpha";
        break;
      case (eta >= 13 && eta <= 28):
        generazione = "Generazione Z";
        break;
      case (eta >= 29 && eta <= 44):
        generazione = "Millennials";
        break;
      case (eta >= 45 && eta <= 60):
        generazione = "Generazione X";
        break;
      default:
        generazione = "Boh!";
    }

    document.getElementById("output").innerHTML = `
      <h2>Dati Inseriti</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Cognome:</strong> ${cognome}</p>
      <p><strong>Indirizzo:</strong> ${indirizzo}</p>
      <p><strong>Città:</strong> ${citta}</p>
      <p><strong>CAP:</strong> ${cap}</p>
      <p><strong>Età:</strong> ${eta || "Non specificata"}</p>
      <p><strong>Data di nascita:</strong> ${dataNascita || "Non indicata"}</p>
      <p><strong>Sesso:</strong> ${sesso}</p>
      <p><strong>Provincia:</strong> ${provincia}</p>
      <p><strong>Mezzi posseduti:</strong> ${mezzi.length > 0 ? mezzi.join(", ") : "Nessuno"}</p>
      <p><strong>Materie preferite:</strong> ${materie.length > 0 ? materie.join(", ") : "Nessuna"}</p>
      <p><strong>Generazione:</strong> ${generazione}</p>
    `;
  };