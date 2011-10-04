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
