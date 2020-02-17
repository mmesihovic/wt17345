var KreirajFajl=(function() {
    function validirajParametreKomentara(spirala, index, sadrzaj) {
        for(let i=0; i<sadrzaj.length;i++) {
            var jsonKeys = Object.keys(sadrzaj[i]);
            if(!jsonKeys.includes('sifra_studenta') || !jsonKeys.includes('tekst') || !jsonKeys.includes('ocjena'))
                return false;
        }
        return spirala != "" && index != "";
    }
    function validirajParametreListe(godina, nizRepozitorija) {
        return godina != "" && nizRepozitorija.length > 0;
    }
    function validirajParametreIzvjestaja(spirala, index) {
        return spirala != "" && index != "";
    }
    function validirajParametreBodova(spirala, index) {
        return spirala != "" && index != "";
    }
    return {
        kreirajKomentar: function(spirala, index, sadrzaj, fnCallback) {
            var xhttp = new XMLHttpRequest();
            var error;
            var data;
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200){
                    if(validirajParametreKomentara(spirala,index,sadrzaj)) {
                        error = null;
                        data  = xhttp.responseText;
                    }
                    else {
                        error = -1;
                        data  = "Neispravni parametri";
                    }
                    fnCallback(error,data);  
                }                    
                if(xhttp.readyState == 4 && xhttp.status != 200){
                    error = xhttp.status;
                    data  = xhttp.responseText;
                    fnCallback(error,data);  
                } 
            }                       
            xhttp.open("POST", "http://localhost:3000/komentar", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify({spirala:spirala, index:index, sadrzaj}));       
        },
        kreirajListu: function(godina, nizRepozitorija, fnCallback) {
            var xhttp = new XMLHttpRequest();
            var error;
            var data;
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200){
                    if(validirajParametreListe(godina,nizRepozitorija)){                 
                        error = null;
                        data  = xhttp.responseText;                    
                    }
                    else{
                        error = -1;
                        data  = 'Neispravni parametri';
                    }
                    fnCallback(error,data);  
                }                    
                if(xhttp.readyState == 4 && xhttp.status != 200){
                    error = xhttp.status;
                    data  = xhttp.responseText;
                    fnCallback(error,data);  
                }
            }                       
            xhttp.open("POST", "http://localhost:3000/lista", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify({godina:godina, nizRepozitorija:nizRepozitorija}));    
        },
        kreirajIzvjestaj: function(spirala, index, fnCallback) {
            var xhttp = new XMLHttpRequest();
            var error;
            var data;
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200){
                    if(validirajParametreIzvjestaja(spirala,index)){                 
                        error = null;
                        data  = xhttp.responseText;                    
                    }
                    else{
                        error = -1;
                        data  = 'Neispravni parametri';
                    }
                    fnCallback(error,data);  
                }                    
                if(xhttp.readyState == 4 && xhttp.status != 200){
                    error = xhttp.status;
                    data  = xhttp.responseText;
                    fnCallback(error,data);  
                }                
            }                       
            xhttp.open("POST", "http://localhost:3000/izvjestaj", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify({spirala:spirala,index:index}));   
        },
        kreirajBodove: function(spirala, index, fnCallback) {
            var xhttp = new XMLHttpRequest();
            var error;
            var data;
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200){
                    if(validirajParametreBodova(spirala,index)){                 
                        error = null;
                        data  = xhttp.responseText;                    
                    }
                    else{
                        error = -1;
                        data  = 'Neispravni parametri';
                    }
                    fnCallback(error,data);  
                }                    
                if(xhttp.readyState == 4 && xhttp.status != 200){
                    error = xhttp.status;
                    data  = xhttp.responseText;
                    fnCallback(error,data);  
                } 
            }                       
            xhttp.open("POST", "http://localhost:3000/bodovi", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify({spirala:spirala,index:index}));   
        }
    }
})();
