var Validacija = (function() {
  var maxGrupa = 7;
  var trenutniSemestar = 0;

  var validirajNazivRepozitorija = function(naziv, regex=null) {
    if(regex==null) {
      regex=/wt((p|P){1})rojekat1[0-9]{4}/;
    }
    if(!regex.test(naziv))
      return false;
    return true;
  }

  return {
      validirajFakultetski: function(mail) {
          var regex=/[a-zA-Z0-9]*\@etf.unsa.ba/;
          if(regex.test(mail))
            return true;
          return false;
      },
      validirajIndex: function(index) {
        return !(isNaN(index) || index.toString().length != 5 || index.toString().charAt(0) != '1');
      },
      validirajGrupu: function(grupa) {
        return !(isNaN(grupa) || grupa < 1 || grupa > maxGrupa);
      },
      validirajAkGod: function(godina) {
        var regex = /(20)\d\d\/(20)\d\d/;
        if(!regex.test(godina))
          return false;
        var prva = godina.substring(2,4);
        var druga = godina.substring(7,9);
        var tren = (new Date()).getFullYear();
        return !( Number(prva) + 1 != Number(druga) || (trenutniSemestar == 0 && tren != '20' + prva) || (trenutniSemestar == 1 && tren != '20' + druga));
      },
      validirajPassword: function(password) {
        var regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/;
        return !(password==undefined || password.length < 7 || password.length>20 || !regex.test(password));
      },
      validirajPotvrdu: function(password, potvrda) {
        return password === potvrda;
      },
      validirajBitbucketURL: function(url) {
        var naziv = document.getElementById('nazivRepozitorija-student').value;
        if(naziv==null || !validirajNazivRepozitorija(naziv))
          return false;
        var regex = new RegExp('https:\/\/[a-zA-Z0-9]*\@bitbucket.org\/[a-zA-Z0-9]*\/' + naziv + '\.git');
        if(!regex.test(url))
          return false;
        return true;
      },
      validirajBitbucketSSH: function(ssh) {
        var naziv = document.getElementById('nazivRepozitorija-student').value;
        if(naziv == null || !validirajNazivRepozitorija(naziv))
          return false;
        var regex = new RegExp('git@bitbucket.org:[a-zA-Z0-9]*\/' + naziv + '\.git');
        if(!regex.test(ssh))
          return false;
        return true;
      },
      validirajNazivRepozitorija:  validirajNazivRepozitorija,
      validirajImeiPrezime: function(imePrezime) {
        var rijeci = imePrezime.split(" ");
        var regex = /^[A-ZŠĐČĆŽ][A-ZŠĐČĆŽa-zšđćžč\-']*$/;
        var triSlova = false;
        for(let i = 0; i < rijeci.length; i++) {
          if(rijeci[i].length >= 3 && rijeci[i].length <= 12)
            triSlova = true;
            if(!regex.test(rijeci[i]))
              return false;
        }
        if(triSlova)
          return true;
        return false;
      },
      postaviMaxGrupa: function(val) {
        if(Number(val)<1)
          return false;
        maxGrupa = val;
        return true;
      },
      postaviTrenSemestar: function(val) {
        if(Number(val) < 0 || Number(val) > 1)
          return false;
        trenutniSemestar = val;
        return true;
      }
    }
}());
