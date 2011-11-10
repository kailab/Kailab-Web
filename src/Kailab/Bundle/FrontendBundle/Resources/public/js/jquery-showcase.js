(function($) {
 
	var plugin_version = '0.1';
	var plugin_name = 'showcase';
	
	$.fn[plugin_name] = function(options){
		options = getOptions.call(this,options);
		var obj = $(this);
	
		if(!options.single){
			obj.find(options.linkSelector).click(function(){
				var id = $(this).attr('href').substr(1);
				show_app.call(obj, id);
				return false;
			});
		
			var imgs = obj.find(options.imageSelector)
			imgs.reflect(options.reflectOptions);
		}
	
		var loaded = obj.find(options.loadedSelector);
		if(loaded.length === 0){
			loaded = obj;
		}
		var anchor = get_anchor();
	    $(options.loadingSelector).fadeOut(function(){
	        loaded.fadeIn(function(){
				if(options.single){
					setup_screenshots.call(obj, obj);
				}else if(anchor){
	                show_app.call(obj, anchor);
	            }
	        });
	    });	  

	    return this;
	};
	 
	$.fn[plugin_name].defaults = {
	    reflectOptions: {
	        height: 0.2,
	        opacity: 0.3
    	},
		linkSelector: 'a',
	    imageSelector: 'img',
	    iconSelector: 'li',
	    loadingSelector: '.loading',
	    loadedSelector: '.loaded',
	    itemSelector: '.app',
	    screenshotsSelector: '.screenshots',
	    selectedClass: 'selected',
	    navigationSelector: '.nav',
	    previousSelector: '.previous',
	    nextSelector: '.next',
	    single: false
	};
	 
	var getOptions = function(options){
		options = $.extend({}, $.fn[plugin_name].defaults, $(this).data(plugin_name), options);
		$(this).data(plugin_name,options);
		return options;
	};
	
	var get_anchor = function(){
	    var url = location.href;
	    var p = url.indexOf('#');
	    return p < 0 ? null : url.substr(p+1);
	}
	
	var setup_screenshots = function(app){
		var obj = this;
		var options = getOptions.call(this);
	    if(app.data('cycle')){
	        return false;
	    }

	    var w = options.horizontalWidth;
	    if(app.hasClass('vertical')){
	    	w = options.verticalWidth;
	    }
	    
	    var nav = app.find(options.navigationSelector);
	    var prev = app.find(options.previousSelector);
	    var next = app.find(options.nextSelector);
	    var shots = app.find(options.screenshotsSelector);
		nav.closest(':hidden').slideDown();
	    
	    shots.cycle({
	        fx:     'fade',
	        pager:  nav, 
	        prev:   prev, 
	        next:   next,
	        pagerAnchorBuilder: function(i, elm){
            	return $('<a>');
        	}
	    });
	    shots.find('a').fancybox({
		});
	    app.data('cycle',true);
	    return true;
	};
	
	var show_app = function(id){
		var obj = this;
		var options = getOptions.call(this);
	    var app = $(options.linkSelector+'[name='+id+']').closest(options.itemSelector);
	    var icon = obj.find(options.linkSelector+'[href=#'+id+']');
	    var icons = obj.find(options.linkSelector);
	    var show = function(){
	    	app.fadeIn(function(){
	            icons.closest(options.iconSelector).removeClass(options.selectedClass);
	            icon.closest(options.iconSelector).addClass(options.selectedClass);
		        setup_screenshots.call(obj, app);
	    	});
	    };
	    if(!$(options.itemSelector+':visible').fadeOut(show).length){
	        show();
	    }
	}
 
})(jQuery);
