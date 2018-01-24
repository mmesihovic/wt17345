function login(fnCallback) {
    if(document.getElementById('login').innerHTML === "Login") {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                if(fnCallback != null) fnCallback(null, JSON.parse(xhttp.responseText));
            }
            if(xhttp.readyState == 4 && xhttp.status == 404) {
                fnCallback(xhttp.status, null);
            }
        }
        var username = encodeURIComponent(document.getElementById('korisnickoIme').value);
        var pw = encodeURIComponent(document.getElementById('password').value);
        xhttp.open("POST", "http://localhost:3000/login", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("username=" + username + "&password=" + pw);
        //xhttp.send(JSON.stringify({ 'username': username, 'password' : password}));
    }
    else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(xhttp.readyState == 4 && xhttp.status == 200) {
                if(fnCallback != null) fnCallback(null, JSON.parse(xhttp.responseText));
            }
            if(xhttp.readyState == 4 && xhttp.status == 404) {
                fnCallback(xhttp.status, null);
            }
        }
        xhttp.open("POST", "http://localhost:3000/logout", true);
		xhttp.send();
    }
}

function meni(error, response) {
    response = JSON.parse(response);
    if(error == null) {
        if(response.success != null ) {
            var html = "";
            if (response.rola == 'student') {
				hide('block','none', 'Logout');
				html = "statistika";
            }
            else if (response.rola == 'nastavnik') {
				hide('none', 'block', 'Logout');
				html = "nastavnik";
			}
			else if (response.rola == 'administrator') {
				hide('none', 'none', 'Logout');
				html = "listakorisnika";
			}
			else if (response.rola == 'odjava') {
				hide('none', 'none', 'Login');
				html = "login";
            }
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if(xhttp.readyState == 4 && xhttp.status == 200) {
                    document.getElementById("content").innerHTML = xhttp.responseText;
                } else if (xhttp.readyState == 4 && xhttp.status != 200) {
                    alert("Doslo je do greske");
                }
            }
            xhttp.open("GET", "page"+"?pageName="+ html , true);
            xhttp.send();
        }
        else {
            document.getElementById("content").innerHTML = response;
        }
    }
    else {
        document.getElementById("content").innerHTML = error;
    }
}

function hide(student, nastavnik, login) {
    document.getElementById('nastavnik').style.display = nastavnik;
	document.getElementById('unosSpiska').style.display = nastavnik;
    document.getElementById('bitbucketPozivi').style.display = nastavnik;
    
    document.getElementById('unosKomentara').style.display = student;
    document.getElementById('statistika').style.display = student;

    document.getElementById('login').innerHTML = login;
}

function search() {
    var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		document.getElementById('korisnici').innerHTML = ajax.responseText;
	}
	var pretragaValue = encodeURIComponent(document.getElementsByName("pretragaValue")[0].value);
	ajax.open("POST", "http://localhost:3000/listaKorisnika", true);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ajax.send("korisnickoIme=" + pretragaValue); 
}