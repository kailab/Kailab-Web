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
        var url = option.text();
        var li = tmpl.replace(options.idTemplate,id);
        li = $(li.replace(options.urlTemplate,url));
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

    available.delegate('li:not(.disabled)', 'click', function(){
        var li = $(this).clone(true);
        li.appendTo(selected);
        selected.trigger('sortupdate');
    });

    selected.bind('sortupdate', function(){
        select.empty();
        available.children().removeClass('disabled');
        selected.children().each(function(){
            var li = $(this);
            if(li.find('.delete').length == 0){
                $('<div class="delete"></div>').prependTo(li);
            }
            var id = li.attr('screenshot_id');
            var option = $('<option value="'+id+'" selected="selected">'+id+'</option>');
            available.children().filter('[screenshot_id='+id+']').addClass('disabled');
            option.appendTo(select);
        });

        available.children().draggable({
            connectToSortable: selected,
            revert: 'invalid',
            helper: 'clone'
        });

        available.children().each(function(){
            var li = $(this);
            if(li.hasClass('disabled')){
                li.draggable('disable');
            }else{
                li.draggable('enable');
            }
        });
    });

    selected.trigger('sortupdate');

    return this;
};
 
$.fn[plugin_name].defaults = {
    idTemplate:         '__id__',
    urlTemplate:        '__url__',
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
