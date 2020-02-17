function kreirajKomentare() {
    var index = document.getElementById("index").value;
    var spirala = document.getElementById("brSpirale").value;
    var sadrzaj = [];
    var tabela = document.getElementById("unosTabela");
    for(let i = 1; i < tabela.rows.length; i++) {
        sadrzaj.push( {sifra_studenta: tabela.rows[i].cells[0].innerHTML, tekst: tabela.rows[i].cells[2].children[0].value, ocjena: i} );
    }
    var callback = function(error, data) {
        if( error != null) {
            document.getElementById("komentariContent").innerHTML = "Doslo je do greske. Greska: " + data;
        } else {
            document.getElementById("komentariContent").innerHTML = "Datoteka je uspjesno kreirana";
        }
    }
    KreirajFajl.kreirajKomentar(spirala,index,sadrzaj, callback);
}