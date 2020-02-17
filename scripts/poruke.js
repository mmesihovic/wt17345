var Poruke= (function () {
  var idDivaPoruka;
  var mogucePoruke=[
    "Email koji ste unijeli nije validan fakultetski email",
    "Indeks koji ste unijeli nije validan",
    "Nastavna grupa koju ste unijeli nije validna",
    "Akademska godina nije validna",
    "Password nije validan",
    "Passwordi se ne podudaraju",
    "Bitbucket URL nije validan",
    "Bitbucket SSH nije validan",
    "Naziv repozitorija nije validan",
    "Ime i prezime nije validno",
    "Semestar koji ste unijeli nije validan",
    "Broj grupa ne moze biti manji od 1"
  ];

  var porukeZaIspis = [];

  return {
    ispisiGreske: function() {
        var errorProvider = "";
        for( let i = 0 ; i < porukeZaIspis.length ; i++)
          errorProvider += "<p>" + porukeZaIspis[i] + "!</p>";

        document.getElementById(idDivaPoruka).innerHTML = errorProvider;
    },
    postaviIdDiva: function(val){
      idDivaPoruka = val;
    },
    dodajPoruku: function(brojPoruke) {
      if(brojPoruke < 0  || brojPoruke > mogucePoruke.length)
        alert("Poruka koju zelite dodati ne postoji!");
      if(porukeZaIspis.indexOf(mogucePoruke[brojPoruke]) < 0)
        porukeZaIspis.push(mogucePoruke[brojPoruke]);
    },
    ocistiGresku: function(brojPoruke) {
      if(brojPoruke < 0 || brojPoruke > mogucePoruke.length)
        alert("Poruka koju zelite dodati ne postoji!");
      for(let i = 0 ; i < porukeZaIspis.length ; i++)
        if(porukeZaIspis[i] === mogucePoruke[brojPoruke])
          porukeZaIspis.splice(i,1);
    },
    obrisiPoruke: function() {
      porukeZaIspis = [];
      this.ispisiGreske();
    }
  }
}());
