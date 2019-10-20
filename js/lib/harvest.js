Promise = TrelloPowerUp.Promise;

const API_BASE_URL = 'https://api.harvestapp.com/api/v2/';

function ajaxGetHarvest(t, path) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.addEventListener("error", reject);
        xhr.addEventListener("load", resolve);
        xhr.open("GET", API_BASE_URL + path);
        Promise.all([
            getEnableConfig(t),
            getAuthToken(t),
        ]).then(function (results) {
          var accountId = results[0].accountId;
          var authToken = results[1];
          xhr.setRequestHeader('Harvest-Account-ID', accountId);
          xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
          // Harvest API docs say to send this, but they don't include it in
          // Access-Control-Allow-Headers so it's not possible to send it.
          //xhr.setRequestHeader('User-Agent', 'Oddvest (carl@oddbird.net)');
          xhr.send();
        });
    });
}

