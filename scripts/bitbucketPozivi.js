function pozoviBitbucketApi() {
    var key = document.getElementById("key").value;
    var secret = document.getElementById("secret").value;
    var repo = document.getElementById("repoName").value;
    var branch = document.getElementById("branch").value;
    var godina = document.getElementById("godina").value;
    var callback = function (error, data) {
        console.log('error: '+ error + '\n' + "data: " + data);
    }
    var nekiCallback = function(error, data) {
        if (error)
            throw error;
        KreirajFajl.kreirajListu(godina,data,callback);
    }
    BitbucketApi.dohvatiAccessToken(key,secret, (error,data) => {
        if (error)
            throw error;
        BitbucketApi.dohvatiRepozitorije(data,godina,repo,branch, nekiCallback);
    });
}