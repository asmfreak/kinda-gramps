function edit_person(app_cb, person, sel){
    sel = sel || "body";
    function add_with_animaion(sel, sing, plur, value){
        $(sel).append("<p>&nbsp;</p>"); 
        var data = $(
            '<div class="ui input">'+
            ' <input placeholder="'+sing+'" type="text">'+
            ' <button class="ui toprightattached circular mini negative icon button">'+
            ' <i class="icon minus"></i>'+
            '</button>').hide(); 
        $(sel).append(data); data.slideDown(); 
        $(sel+" div button.ui.negative")
           .off("click")
           .click(del_click_handler(sing,plur))    
        l = $(sel).find("div").length
        if (l==1){
            $(sel).find("h3")
          .text(sing)
        }else{
            $(sel).find("h3")
              .text(plur)
        }
        if(value){
            data.find("input").attr("value", value);
        }
    }
    function del_click_handler(sing,plur){
    return  function(){
        pp = $(this).parent().parent()
        l = pp.find("div").length
        if (l==2){
            pp.find("h3")
          .text(sing)
        }else{
            pp.find("h3")
              .text(plur)
        }
        $(this).parent()
            .slideUp(400, function(){
                a = $(this)
                a.prev().remove()
                a[0].remove();
            })
    }
    }
    function multifield_input(sel, cls, hsingular, hplural, arr){
        arr= arr || [];
        var ndiv = $(
            '<div class="segment '+cls+'">'+
            ' <h3>'+((arr.length>1) ? hplural : hsingular)+'</h3>'+
            ' <div class="ui input">'+
            '  <input type="text" placeholder="'+hsingular+'" value="">'+
            '  <button class="ui toprightattached circular mini positive icon button">'+
            '   <i class="icon plus"></i>'+
            '  </button>'+
            ' </div>'+
            '</div>'
        );
        ndiv.find("button").click(function(){
                add_with_animaion(sel+" .segment."+cls, hsingular, hplural)
            });
        if(arr.length>0){
            ndiv.find("input").attr("value", arr[0]);
        }
        $(sel).append(ndiv)
        for (i=1;i<arr.length;i++){
            add_with_animaion(sel+" .segment."+cls, hsingular, hplural, arr[i]);
        }
        return function(){
            return $.map(ndiv.find("input"), function(li) {
                return $(li).prop("value");
            });
        }
    }
    function fio_inputs(sel, fams, nams, snams){
        fams = fams || [];
        nams = nams || [];
        snams = snams || [];
        $(sel).append('<div class="ui three column middle aligned grid fio"></div>')
        res = [ multifield_input(sel+" .fio", "fam", "Фамилия", "Фамилии", fams),
                multifield_input(sel+" .fio", "nam", "Имя", "Имена", nams),
                multifield_input(sel+" .fio", "snam", "Отчество", "Отчества", snams)
               ];
        return function(){
            return res.map(function(e){return e()})
        }
    }

    app_cb = app_cb || function(){}
    pers_def = {
            $loki: false,
            families: [],
            names: [],
            snames: [],
            gender: "Женский",
            birth: "??",
            death: "??"
        }
    var pers = $.extend(true, pers_def, person);
    idd = pers.$loki;
    var ndiv = $(
      '<div id="pers'+idd+'" class="ui modal">'+
      ' <div class="icon header"><i class="edit icon"></i>Изменить человека</div>'+
      ' <div class="content"></div>'+
      ' <div class="actions">'+
      '  <div class="two fluid ui inverted buttons">'+
      '   <div class="ui red deny button"><i class="remove icon"></i>Отменить</div>'+
      '   <div class="ui green positive right button"><i class="checkmark icon"></i>Сохранить</div>'+
      '  </div>'+
      ' </div>'+
      '</div>'
    )
    $(sel).append(ndiv);
    var fios = fio_inputs("#pers"+idd+" .content", pers.families, pers.names, pers.snames);
    ndiv.find(".content").append('<p>&nbsp;</p>')
    var gender = $(
        '<div class="segment">'+
        ' <h3>Пол</h3>'+
        ' <div class="ui label fluid selection dropdown">'+
        '  <input name="gender" type="hidden">'+
        '  <i class="dropdown icon"></i>'+
        '  <div class="default text">Пол</div>'+
        '  <div class="menu">'+
        '   <div class="item" data-value="мужской"><i class="male icon"></i>Мужской</div>'+
        '   <div class="item" data-value="женский"><i class="female icon"></i>Женский</div>'+
        '  </div>'+
        ' </div>'+
        '</div>'
    );
    ndiv.find(".content").append(gender);
    gender.find('.dropdown').dropdown({
        onChange:function(val){
            pers.gender = val;
        }
    }).dropdown("set selected", pers.gender);
    var bd = $('<p>&nbsp;</p>'+
        '<div class="ui top attached tabular menu">'+
        '  <a class="item active" data-tab="birth">Рождение</a>'+
        '  <a class="item" data-tab="death">Смерть</a>'+
        '</div>'+
        '<div class="ui bottom attached tab segment active" data-tab="birth">'+
        ' <div class="segment">'+
        '  <h3>Дата</h3>'+
        '  <div class="ui input">'+
        '   <input type="text" placeholder="Дата рождения" class="birth" value="">'+
        '  </div>'+
        ' </div>'+
        '</div>'+
        '<div class="ui bottom attached tab segment" data-tab="death">'+
        ' <div class="segment">'+
        '  <h3>Дата</h3>'+
        '  <div class="ui input">'+
        '   <input type="text" placeholder="Дата смерти" class="death" value="">'+
        '  </div>'+
        ' </div>'+
        '</div>'
        );
    ndiv.find(".content").append(bd)
    bd.find('.item').tab()
    var birth = bd.find('.birth'),
        death = bd.find('.death');
    birth.attr("value", pers.birth);
    death.attr("value", pers.death);
    ndiv.modal({closable: false,
                detachable: false,
                allowMultiple: true,
                onHidden: function(){
                    ndiv.remove()
                },
                onApprove: function(){
                    fio = fios();
                    pers.families = fio[0];
                    pers.names = fio[1];
                    pers.snames = fio[2];
                    pers.birth = birth.prop("value");
                    pers.death = death.prop("value");
                    app_cb(pers);
                    return true;
                }
            })
    ndiv.modal('show');
    return ndiv
}