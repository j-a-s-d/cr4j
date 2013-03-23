(function() { "use strict";
	function getOptionsForTemplate(name) {
		if (name == 'header-jade') {
			return { text: "THiS iS A MIXED DEMO" };
		} else {
			return {};
		}
	}

	var ls = new Date();
	function renderAll() {
		var rs = new Date();
		var html = "";
		for (var template in cr4j.templates) {
			html += cr4j.renderTemplate(template, getOptionsForTemplate(template));
		}
		document.write(html);
		var re = new Date();
		document.getElementById('divTimeSpent').innerHTML = '<b>templates loaded in ' + (rs - ls) + ' ms<br/>page rendered in ' + (re - rs) + ' ms<br/><br/>total spent time: ' + ((rs - ls) + (re - rs)) + ' ms';
	}

	cr4j.loadTemplates(renderAll);
}());
