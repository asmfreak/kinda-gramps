function message(title, content_div, yes_cb, no_cb, sel){
    yes_cb = yes_cb || function(){};
    no_cb = no_cb || function(){};
    sel = sel || "body";
    var ndiv = $(
      '<div class="ui modal">'+
      ' <div class="icon header">'+title+'</div>'+
        content_div+
      ' <div class="actions">'+
      '  <div class="two fluid ui inverted buttons">'+
      '   <div class="ui red deny button"><i class="remove icon"></i>Нет</div>'+
      '   <div class="ui green positive right button"><i class="checkmark icon"></i>Да</div>'+
      '  </div>'+
      ' </div>'+
      '</div>'
    );
    $(sel).append(ndiv);
    ndiv.modal({closable: false,
                detachable: false,
                onHidden: function(){
                    ndiv.remove()
                },
                onApprove: function(){
                    return yes_cb();
                },
                onDeny: function(){
                    return no_cb();
                },
            })
    ndiv.modal('show');
}