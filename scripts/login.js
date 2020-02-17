function regStudent() {
    document.getElementById("registracijaProfesor").style.display = "none";
    document.getElementById("registracijaStudent").style.display = "inline";
    document.getElementById("registracijaProfesor").reset();
    Poruke.obrisiPoruke();
  }

function regProfesor() {
    document.getElementById("registracijaStudent").style.display = "none";
    document.getElementById("registracijaProfesor").style.display = "inline";
    document.getElementById("registracijaStudent").reset();
    Poruke.obrisiPoruke();
  }

function populateDictionary() {
  var dictionary = {};
  dictionary['regImePrezime-profesor']=Validacija.validirajImeiPrezime;
  dictionary['regPassword-profesor']=Validacija.validirajPassword;
  dictionary['confirmPassword-profesor']=Validacija.validirajPotvrdu;
  dictionary['mail-profesor']=Validacija.validirajFakultetski;
  dictionary['maxGrupa-profesor']=Validacija.postaviMaxGrupa;
  dictionary['semestar-profesor']=Validacija.postaviTrenSemestar;
  dictionary['akgod-profesor']=Validacija.validirajAkGod;
  dictionary['regImePrezime-student']=Validacija.validirajImeiPrezime;
  dictionary['index-student']=Validacija.validirajIndex;
  dictionary['grupa-student']=Validacija.validirajGrupu;
  dictionary['akgodina-student']=Validacija.validirajAkGod;
  dictionary['bitbucketURL-student']=Validacija.validirajBitbucketURL;
  dictionary['bitbucketSSH-student']=Validacija.validirajBitbucketSSH;
  dictionary['nazivRepozitorija-student']=Validacija.validirajNazivRepozitorija;
  dictionary['regPassword-student']=Validacija.validirajPassword;
  dictionary['confirmPassword-student']=Validacija.validirajPotvrdu;
  return dictionary;
}

function populateMessageNumbers() {
  var dictionary = {};
  dictionary['regImePrezime-profesor']=9;
  dictionary['regPassword-profesor']=4;
  dictionary['confirmPassword-profesor']=5;
  dictionary['mail-profesor']=0;
  dictionary['maxGrupa-profesor']=11;
  dictionary['semestar-profesor']=10;
  dictionary['akgod-profesor']=3;
  dictionary['regImePrezime-student']=9;
  dictionary['index-student']=1;
  dictionary['grupa-student']=2;
  dictionary['akgodina-student']=3;
  dictionary['bitbucketURL-student']=6;
  dictionary['bitbucketSSH-student']=7;
  dictionary['nazivRepozitorija-student']=8;
  dictionary['regPassword-student']=4;
  dictionary['confirmPassword-student']=5;
  return dictionary;
}

var ErrorProvider = (function() {
    var validationMethods = populateDictionary();
    var messageNumbers = populateMessageNumbers();
    Poruke.postaviIdDiva('errorProvider');
    return {
      validateField: function(divID, value) {
          var validationMethod = validationMethods[divID];
          var messageID = messageNumbers[divID];
          if(!validationMethod(value)) {
              Poruke.dodajPoruku(messageID);
              Poruke.ispisiGreske();
          }
          else {
            Poruke.ocistiGresku(messageID);
            Poruke.ispisiGreske();
          }
      },
      validateConfirmation: function(divID, value, confirmedValue) {
          var validationMethod = validationMethods[divID];
          var messageID = messageNumbers[divID];
          if(!validationMethod(value, confirmedValue)) {
              Poruke.dodajPoruku(messageID);
              Poruke.ispisiGreske();
          }
          else {
            Poruke.ocistiGresku(messageID);
            Poruke.ispisiGreske();
          }
      }
    }
}());
