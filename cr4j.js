// Client-side Renderer for Jade
// http://coderesearchlabs.com/cr4j
//
// by Javier Santo Domingo (j-a-s-d@coderesearchlabs.com)

var cr4j = (function(jade, jQuery) { "use strict";
	var collection = {},
		options = {
			TEMPLATES_PATH: '/templates/',
			TEMPLATES_SUFFIX: '-jade',
			TEMPLATES_EXTENSION: '.jade'
		};
	function ready() {
		for (var template in collection) {
			if (!collection[template].isLoaded()) {
				return false;
			}
		}
		return true;
	}
	function fetchAll() {
		var dfd = new jQuery.Deferred();
		for (var template in collection) {
			jQuery.when(collection[template].load()).then(function(name){
				if (ready()) {
					dfd.resolve();
				}
			});
		}
		return dfd.promise();
	}
	function JadeTemplate(templateName) {
		var instance = null,
			loaded = false,
			templateContent = "";
		function fetch() {
			var dfd = new jQuery.Deferred();
			var element = jQuery('#' + templateName);
			templateContent = jQuery.trim(element.html());
			if (templateContent == "") {
				element.remove();
				jQuery.get(options.TEMPLATES_PATH + templateName.replace(options.TEMPLATES_SUFFIX, options.TEMPLATES_EXTENSION), function(data) {
					loaded = true;
					templateContent = data;
					dfd.resolve(templateName);
				});
			} else {
				loaded = true;
				dfd.resolve(templateName);
			}
			return dfd.promise();
		}
		function getContent() {
			return templateContent;
		}
		function getIsLoaded() {
			return loaded;
		}
		function invokeJade(locals) {
			if (instance == null) {
				instance = jade.compile(getContent(), { compileDebug: false });
			}
			return instance(locals);
		}
		return {
			name: templateName,
			load: fetch,
			content: getContent,
			isLoaded: getIsLoaded,
			render: invokeJade
		}
	}
	return {
		templates: collection,
		setParameters: function(parameters) {
			if (parameters) {
				if (parameters.path) {
					options.TEMPLATES_PATH = parameters.path.replace(/\/?$/, '/');
				}
				if (parameters.suffix) {
					options.TEMPLATES_SUFFIX = parameters.suffix;
				}
				if (parameters.extension) {
					options.TEMPLATES_EXTENSION = parameters.extension;
				}
			}
			return this;
		},
		loadTemplates: function(onComplete) {
			jQuery('script[id$="' + options.TEMPLATES_SUFFIX + '"]').each(function() {
				collection[this.id] = new JadeTemplate(this.id);
			});
			jQuery.when(fetchAll()).then(onComplete);
		},
		renderTemplate: function(template, locals) {
			return collection[template].render(locals);
		}
	}
}(jade, jQuery));
