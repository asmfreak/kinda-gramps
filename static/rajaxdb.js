function AjaxDBAdapter(){}
AjaxDBAdapter.prototype.loadDatabase = function(dbname, callback) {
    $.ajax("/"+dbname, {
        dataType: "text",
        success: callback,
        error: function(){callback(new Error("There was a problem loading " + dbname + " database"));}
    })
}