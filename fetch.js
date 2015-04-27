var settings = null;
var originalGistList = [];
var favoriteGistList = [];

function GistItem(i, d, u) {
    this.id = i;
    this.desc = d;
    this.url = u;
}

function addFavGistItem(settings, gi) {
    if(gi instanceof GistItem) {
        settings.favGistItems.push(gi);
        localStorage.setItem('userSettings', JSON.stringify(settings));
        return true;
    }
    console.error('Attempted to add non-gistItem.');
    return false;
}

function findGistById(gistID, removeItem) {
    for (var i = 0; i < originalGistList.length; i++) {
        if (originalGistList[i].id == gistID)
        {
            var gistItem = originalGistList[i];
            if (removeItem) {
                originalGistList.splice(i, 1);
            }
            return gistItem;
        }
    }
    return null;
}

function findFavGistById(gistID, removeItem) {
    for (var i = 0; i < settings.favGistItems.length; i++) {
        if (settings.favGistItems[i].id == gistID)
        {
            var gistItem = settings.favGistItems[i];
            if (removeItem) {
                settings.favGistItems.splice(i, 1);
            }
            return gistItem;
        }
    }
    return null;
}

function liGist(id, desc, url, usePlus) {
    var fbutton = document.createElement("BUTTON");
    if (usePlus) {
        fbutton.innerHTML = "+";
    }
    else {
        fbutton.innerHTML = "-";
    }
    fbutton.setAttribute("gistID", id);
    fbutton.onclick = function () {
        /* TODO check whether in favorite list and remove if so */
        var gistID = this.getAttribute("gistID");
        var toBeFavoredGist = findGistById(gistID, true);
        if (toBeFavoredGist != null) {
            addFavGistItem(settings, toBeFavoredGist);
        }
    };
    
    var tbl = document.createElement('table');
    var rowOne = tbl.insertRow(0);
    var rowOnecellOne = rowOne.insertCell(0);
    rowOnecellOne.setAttribute('width', '15%');
    rowOnecellOne.appendChild(fbutton);
    var rowOnecellTwo = rowOne.insertCell(1);
    var descText = document.createTextNode(desc);
    rowOnecellTwo.appendChild(descText);
    var rowTwo = tbl.insertRow(1);
    var rowTwocellOne = rowTwo.insertCell(0);
    var urlLink = document.createElement('a');
    var urlText = document.createTextNode(url);
    urlLink.setAttribute('href', url);
    urlLink.appendChild(urlText);
    rowTwocellOne.setAttribute('colSpan', '2');
    rowTwocellOne.appendChild(urlLink);
    return tbl;
}


function createGistList(ul, id, desc, url, usePlus) {
    var li = document.createElement('li');
    li.type
    li.appendChild(liGist(id, desc, url, usePlus));
    ul.appendChild(li);
}

function fetchData() {
    var req = new XMLHttpRequest();
    if (!req) {
        throw "Unable to create HttpRequest.";
    }
    req.onreadystatechange = function() {
        if(this.readyState == 4) {
            var gistFetched = JSON.parse(this.responseText);
            gistFetched.forEach(function(g) {
                /*var gistID = gistFetched[0].id;
                var gistDesc = gistFetched[0].description;*/
                var gistID = g.id;
                var gistDesc = g.description;
                if (gistDesc == null || gistDesc == "") {
                            gistDesc = "No Description";
                    }
                var gistURL = g.url;
                if (findFavGistById(gistID, false) != null) {
                    /* false as the last parameter adds a '-' sign to button */
                    createGistList(document.getElementById('favGistList'), gistID, gistDesc, gistURL, false);
                }
                else {
                    var newGist = new GistItem(gistID, gistDesc, gistURL);
                    originalGistList.push(newGist);
                    /* true as the last parameter adds a '+' sign to button */
                    createGistList(document.getElementById('gistList'), gistID, gistDesc, gistURL, true);
                }
            });
        }
    }
    
    req.open("GET", "https://api.github.com/gists");
    req.send();
}
/*
function fetchData1() {
    var gistID = "1234567890";
    var gistDesc = "Bootstrap Customizer Config";
    var gistURL = "https://api.github.com/gists";
    if (findFavGistById(gistID, false) != null) {
        createGistList(document.getElementById('favGistList'), gistID, gistDesc, gistURL, false);
    }
    else {
        var newGist = new GistItem(gistID, gistDesc, gistURL);
        originalGistList.push(newGist);
        createGistList(document.getElementById('gistList'), gistID, gistDesc, gistURL, true);
    }

}
*/
window.onload = function() {
    /*localStorage.clear();*/
    var settingsStr = localStorage.getItem('userSettings');
    if( settingsStr === null ) {
        settings = {'favGistItems':[]};
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }
    else {
        settings = JSON.parse(localStorage.getItem('userSettings'));
    }
}

