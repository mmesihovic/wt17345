var BitbucketApi = (function(){   
    return {
        dohvatiAccessToken: function(key, secret, fnCallback) {
            var xhttp = new XMLHttpRequest();
            if(key==null || secret==null)
                fnCallback(-1,'Key ili secret nisu pravilno proslijeđeni!');
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    fnCallback(null,JSON.parse(xhttp.responseText).access_token);                    
                }
                else if (xhttp.readyState == 4 && xhttp.status !=200)
                    fnCallback(xhttp.status,null);
            }            
            xhttp.open("POST", "https://bitbucket.org/site/oauth2/access_token", true);
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("Authorization", 'Basic ' + btoa(key+':'+secret));
            xhttp.send("grant_type="+encodeURIComponent("client_credentials"));
        },
        dohvatiRepozitorije:  function(token, godina, naziv, branch, fnCallback) {            
            var xhttp = new XMLHttpRequest();
            var error;
            var data;
            var ssh = [];   
            xhttp.onreadystatechange = function() {
                if (xhttp.readyState == 4 && xhttp.status == 200)
                {
                    var resp = JSON.parse(xhttp.response);
                    for(let i = 0; i < resp.values.length; i++){
                        if(BitbucketApi.dohvatiBranch(token,resp.values[i].links.branches.href,branch, (error, data) => {
                            console.log("Dohvatam brancheve");
                        })){
                            ssh.push(resp.values[i].links.clone[1].href);
                        }                          
                    }      
                    console.log(ssh);
                    fnCallback(null,ssh);                  
                }
                else if (xhttp.readyState == 4 && xhttp.status != 200)
                    fnCallback(xhttp.status,null);             
            }
            var newYear = godina+2;
            xhttp.open("GET",'https://api.bitbucket.org/2.0/repositories/?role=member&q=name~"'+naziv+'"&created_on>='+godina+"-01-01&created_on<"+newYear+"-01-01&pagelen=150",true);
            xhttp.setRequestHeader("Authorization", 'Bearer ' + token);
            xhttp.send();
        },
        dohvatiBranch: async function(token, url, naziv, fnCallback) {            
            var found=false;
            var result = await $.ajax({
                url: url,
                type: "GET",
                async: true,
                dataType: 'json',
                headers:{
                    "Authorization": "Bearer " + token
                }           
            });            
            for(let i=0; i < result.values.length; i++){
                if(result.values[i].name===naziv){
                    found=true;
                    break;                    
                } 
            }
            return found;
        }
    }
})();