/* protect jQuery */
(function ($) {
  $.fn.ajaxUpload = function (options) {
    var defaults = {
      url: null,
      format: 'json',
      disable: true,
      beforeSend: null,
      success: null,
      error: null,
      complete: null,
      validate: null,
      timeout: 100000,
      timeout_error: 'The upload timed out.'
    };
    options = $.extend({}, defaults, options);
    $(this).each(function () {
      $.fn.ajaxUpload.setupForm.call($(this), options);
    });
    return this;
  };
  $.fn.ajaxUpload.setupForm = function (options) {
    if (this[0].tagName.toLowerCase() !== 'form') {
      $(this).children().wrapAll('<form>');
      var form = $(this).find('form');
    } else {
      var form = $(this);
    }
    var result = null;
    if (options.url !== null) {
      form.attr('action', options.url);
    }
    form.attr("method", "POST");
    form.attr("enctype", "multipart/form-data");
    form.attr("encoding", "multipart/form-data");
    form.submit(function (e) {
      var fields = null;
      if ($.isFunction(options.validate)) {
        fields = getFields(form);
        if (!options.validate(fields)) {
          e.preventDefault();
          return false;
        }
      }
      if ($.isFunction(options.beforeSend)) {
        options.beforeSend(fields);
      }
      var t = new Date().getTime();
      var iframeid = "ajaxUploadFrame" + t;
      var iframe = $('<iframe id="' + iframeid + '" name="' + iframeid + '" src="javascript:;" style="display:none" />').appendTo(document.body);
      form.attr("target", iframeid);
      if (options.disable) {
        form.find("input[type=submit]").attr("disabled", true);
      }
      $("#" + iframeid).load(function () {
        try {
          var response = iframe.contents().find("body").html();
          var error = null;
        } catch (e) {
          var response = false;
          var error = true;
        }
        if (!error && options.format == "json") {
          try {
            response = jQuery.parseJSON(response);
          } catch (e) {
            error = response;
            response = false;
          }
        }
        setTimeout(function () {
          finish(response, error);
        }, 200);
      });
      if (options.timeout > 0) {
        setTimeout(function () {
          finish(false, options.timeout_error);
        }, options.timeout);
      }
      var finish = function (response, error) {
        if ($(iframe).parent().length > 0) {
          $(iframe).remove();
          if (options.disable) {
            form.find("input[type=submit]").attr("disabled", false);
          }
          if (response === false) {
            if ($.isFunction(options.error)) {
              options.error.call(form, stripTags(error));
            }
          } else {
            if ($.isFunction(options.success)) {
              options.success.call(form, response);
            }
          }
          if ($.isFunction(options.complete)) {
            options.complete.call(form, response);
          }
        }
      };
    });
  };

  function stripTags(html) {
    if (arguments.length < 3) {
      html = html.replace(/<\/?(?!\!)[^>]*>/gi, '');
    } else {
      var allowed = arguments[1];
      var specified = eval("[" + arguments[2] + "]");
      if (allowed) {
        var regex = '</?(?!(' + specified.join('|') + '))\b[^>]*>';
        html = html.replace(new RegExp(regex, 'gi'), '');
      } else {
        var regex = '</?(' + specified.join('|') + ')\b[^>]*>';
        html = html.replace(new RegExp(regex, 'gi'), '');
      }
    }
    return html;
  }

  function getFields(form) {
    var fields = {};
    form.find("input,select,textarea").each(function () {
      var input = $(this);
      var inputName = input.attr("name");
      if (inputName.length > 1 && inputName.substr(inputName.length - 2, inputName.length) == "[]") {
        inputName = inputName.substr(0, inputName.length - 2);
        if (!fields.hasOwnProperty(inputName)) {
          fields[inputName] = [];
        }
        fields[inputName].push(input.val());
      }
      else if (inputName.length > 0) {
        fields[inputName] = input.val();
      }
    });
    return fields;
  }
})(jQuery);

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
