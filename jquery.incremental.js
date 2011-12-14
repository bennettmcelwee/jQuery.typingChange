/*
 *	Incremental
 *	
 *  Creates an incrementalchange event that you can bind to. It fires whenever a user pauses while typing into the element.
 *
 *	By Bennett McElwee
 *
 *  Copyright (c) 2011 Bennett McElwee
 *  Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
*/

(function($) {
	$.event.special.incrementalchange = {

		setup: function (data, namespaces) {
			$(this)
				.data("incrementalchange", {
					delayMs: (data && data.delayMs) || 500,
					timer: 0
				})
				.bind('keydown.incrementalchange', $.event.special.incrementalchange.keydownHandler)
				.bind('keyup.incrementalchange', $.event.special.incrementalchange.keyupHandler);

				console.log((10000 + new Date() % 10000).toString().substring(1),
					"Setup: ", $(this).data("incrementalchange"));
			
		},

		teardown: function (namespaces) {
			$(this)
				.removeData("incrementalchange")
				.unbind(".incrementalchange");
		},

		keydownHandler: function (event) {
			var element = $(this);
			var data = element.data("incrementalchange");
			if (typeof data.lastValue === "undefined") {
				data.lastValue = this.contentEditable === 'true' ? element.html() : element.val();
			}
		},

		keyupHandler: function (event) {
			var element = $(this);
			var data = element.data("incrementalchange");
			clearTimeout (data.timer);
			var newValue = this.contentEditable === 'true' ? element.html() : element.val();
			console.log((10000 + new Date() % 10000).toString().substring(1),
				"Key up: last, new = [" + data.lastValue + "] [" + newValue + "]");
			if (typeof data.lastValue !== "undefined" && newValue !== data.lastValue) {
				data.timer = setTimeout(function() {
					console.log((10000 + new Date() % 10000).toString().substring(1),
						"Triggering incrementalchange, last=", data.lastValue);
					element.trigger("incrementalchange",  data.lastValue);
					delete data.lastValue;
				}, data.delayMs);
			} else {
				data.timer = 0;
			}
		}
	};

})(jQuery);
