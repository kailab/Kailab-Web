(function($) {
 
var plugin_name = 'screenshots';
 
$.fn[plugin_name] = function(options){
    if(typeof options == 'string'){
        var args = Array.prototype.slice.call(arguments,1);
        return $.fn[plugin_name][options].apply(this,args);
    }
    options = getOptions.call(this,options);
    var select = $(this).hide();
    var wrapper = $('<div>').html($(options.listTemplate).html()).insertAfter(select);
    var selected = wrapper.find('.selected_screenshots');
    var available = wrapper.find('.available_screenshots');

    var tmpl = $(options.elementTemplate).html();

    select.find('option').each(function(){
        var option = $(this);
        var id = option.attr('value');
        var type = option.text();
        var li = tmpl.replace(options.idTemplate,id);
        li = $(li.replace(options.typeTemplate,type));
        li.attr('screenshot_id',id);

        li.appendTo(available);
        if(option.attr('selected')){
            li.clone().appendTo(selected);
        }
    });

    selected.sortable({
    });

    selected.delegate('.delete','click',function(){
        var li = $(this).parent();
        li.fadeOut(function(){
            li.remove();
            selected.trigger('sortupdate');
        });
    });

    available.delegate('li', 'click', function(){
        var li = $(this).clone(true);
        li.appendTo(selected);
        selected.trigger('sortupdate');
    });

    selected.bind('sortupdate', function(){
        select.empty();
        selected.children().each(function(){
            var li = $(this);
            if(li.find('.delete').length == 0){
                $('<div class="delete"></div>').prependTo(li);
            }
            var id = li.attr('screenshot_id');
            var option = $('<option value="'+id+'" selected="selected">'+id+'</option>');
            option.appendTo(select);
        });
    });

    available.children().draggable({
        connectToSortable: selected,
        revert: 'invalid',
        helper: 'clone'
    });

    selected.trigger('sortupdate');

    return this;
};
 
$.fn[plugin_name].defaults = {
    idTemplate:         '__id__',
    typeTemplate:       '__type__',
    listTemplate:       '#screenshots_template',
    elementTemplate:    '#screenshot_template'
};
 
var getOptions = function(options){
    options = $.extend({}, $.fn[plugin_name].defaults, $(this).data(plugin_name), options);
    $(this).data(plugin_name,options);
    return options;
};
 
$.fn[plugin_name].publicSubfunction = function(arg1){
    var options = getOptions.call(this);
};
 
})(jQuery);
