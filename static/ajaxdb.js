function AjaxDBAdapter(){}
AjaxDBAdapter.prototype.loadDatabase = function(dbname, callback) {
    $.ajax("/"+dbname, {
        dataType: "text",
        success: callback,
        error: function(){callback(new Error("There was a problem loading " + dbname + " database"));}
    })
}

AjaxDBAdapter.prototype.saveDatabase = function(dbname, dbstring, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/db", true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4)
            if (xhr.status == 200) {
                callback(null);
            }else{
                callback(new Error("An error was encountered saving " + dbname + " database."));
            }
    }
    xhr.send(dbstring);
}