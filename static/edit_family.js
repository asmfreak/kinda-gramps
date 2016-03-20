function edit_family(app_cb, people_cb, add_cb, family, sel){
    sel = sel || "body";
    family_def = {
        $loki: false,
        partners: [],
        children: []
    };
    family = $.extend(true, family_def, family);
    idd = family.$loki;
    var ndiv = $(
      '<div id="fam'+idd+'" class="ui modal">'+
      ' <div class="icon header"><i class="edit icon"></i>Изменить семью <div class="ui small green icon button"><i class="plus icon"></i><i class="user icon"></i>Добавить персону</div></div>'+
      ' <div class="content">'+
      '  <div class="ui form">'+
      '   <div class="field">'+
      '    <label>Супруги</label>'+
      '    <div class="partners ui multiple search selection dropdown">'+
      '      <input type="hidden">'+
      '      <i class="dropdown icon"></i>'+
      '      <input type="text" class="search">'+
      '    </div>'+
      '   </div>'+
      '   <div class="ui error message">'+
      '    <div class="header">Недостаточно супругов</div>'+
      '    <p>В семье должен быть как минимум 1 супруг.</p>'+
      '   </div>'+
      '   <div class="field">'+
      '    <label>Дети</label>'+
      '    <div class="fam_children ui multiple search selection dropdown">'+
      '      <input type="hidden">'+
      '      <i class="dropdown icon"></i>'+
      '      <input type="text" class="search">'+
      '    </div>'+
      '   </div>'+
      '  </div>'+
      ' </div>'+
      ' <div class="actions">'+
      '  <div class="two fluid ui inverted buttons">'+
      '   <div class="ui red deny button"><i class="remove icon"></i>Отменить</div>'+
      '   <div class="ui green positive right button"><i class="checkmark icon"></i>Сохранить</div>'+
      '  </div>'+
      ' </div>'+
      '</div>'
    )
    $(sel).append(ndiv);
    var partnersSet = false;
    var childrenSet = false;
    ndiv.find('.ui.small.green.icon.button').click(add_cb);
    ndiv.find('.partners').dropdown({
        saveRemoteData: false,
        apiSettings: {
            url: '/dbs',
            on: true,
            cache: false,
            responseAsync: people_cb
        }
    }).data().moduleDropdown.search("", function(){
        ndiv.find('.partners').dropdown(
            "set selected", 
            family.partners.map(function(o){return o.toString();})
        ).dropdown('refresh');
    });
    ndiv.find('.fam_children').dropdown({
        saveRemoteData: false,
        apiSettings: {
            url: '/dbs',
            on: true,
            cache: false,
            responseAsync: people_cb
        }
    }).data().moduleDropdown.search("",function(){
        ndiv.find('.fam_children').dropdown(
            "set selected", 
            family.children.map(function(o){return o.toString();})
        ).dropdown('refresh');
    });
    ndiv.modal({closable: false,
                detachable: false,
                allowMultiple: true,
                onHidden: function(){
                    ndiv.remove()
                },
                onApprove: function(){
                    ndiv.find(".ui.form").removeClass('error');
                    family.partners = ndiv.find(".partners").dropdown("get value")
                    if(family.partners==""){
                        ndiv.find(".ui.form").addClass('error');
                        return false;
                    }
                    family.partners = family.partners.split(",").map(function (s){return parseInt(s);});
                    family.children = ndiv.find(".fam_children").dropdown("get value");
                    if(family.children!=""){
                        family.children = family.children.split(",").map(function (s){return parseInt(s);});
                    }else{
                        family.children = [];
                    }
                    app_cb(family);
                    return true;
                }
            })
    ndiv.modal('show');
    return ndiv;
}