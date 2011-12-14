/*
 *	Incremental
 *	
 *  Creates an incrementalchange event that you can bind to.
 *  Whenever a user pauses while typing into the element, this event will fire if the typing has changed the element's value.
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
				.bind('keyup.incrementalchange',   $.event.special.incrementalchange.keyupHandler)
				.bind('change.incrementalchange',  $.event.special.incrementalchange.changeHandler);
				console.log((10000 + new Date() % 10000).toString().substring(1), "Setup: ", $(this).data("incrementalchange"));
		},

		teardown: function (namespaces) {
			$(this)
				.removeData("incrementalchange")
				.unbind(".incrementalchange");
		},

		triggerEvent: function() {
			var element = $(this);
			var data = element.data("incrementalchange");
			var newValue = this.contentEditable === 'true' ? element.html() : element.val();
			console.log((10000 + new Date() % 10000).toString().substring(1), "Triggering incrementalchange, last=", data.initialValue);
			element.trigger("incrementalchange",  data.initialValue);
			delete data.initialValue;
			data.finalValue = newValue;
		},

		keydownHandler: function (event) {
			var element = $(this);
			var data = element.data("incrementalchange");
			if (typeof data.initialValue === "undefined") {
				data.initialValue = this.contentEditable === 'true' ? element.html() : element.val();
			}
		},

		keyupHandler: function (event) {
			var element = $(this);
			var data = element.data("incrementalchange");
			clearTimeout (data.timer);
			data.timer = 0;
			var newValue = this.contentEditable === 'true' ? element.html() : element.val();
			console.log((10000 + new Date() % 10000).toString().substring(1), "Key up: last, new = [" + data.initialValue + "] [" + newValue + "]");
			if (typeof data.initialValue !== "undefined" && newValue !== data.initialValue) {
				var self = this;
				data.timer = setTimeout(function() {
						data.timer = 0;
						$.event.special.incrementalchange.triggerEvent.call(self);
					}, data.delayMs);
			}
		},

		changeHandler: function (event) {
			var element = $(this);
			var data = element.data("incrementalchange");
			console.log((10000 + new Date() % 10000).toString().substring(1), "Change: timer = [" + data.timer + "]");
			if (data.timer) {
				clearTimeout (data.timer);
				data.timer = 0;
				$.event.special.incrementalchange.triggerEvent.call(this);
			}
		}

	};

	/**
	 * Return whether this element has changed value since the last time the incrementalchange event occurred.
	 */
	$.fn.isChanged = function() {
		var element = $(this);
		var data = element.data("incrementalchange");
		var value = this.contentEditable === 'true' ? element.html() : element.val();
		console.log((10000 + new Date() % 10000).toString().substring(1), "isChanged last, new = [" + data.finalValue + "] [" + value + "] returns " + (value !== data.finalValue));
		return (value !== data.finalValue);
	};

})(jQuery);
