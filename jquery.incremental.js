/*
 *	Incremental
 *	
 *  Fires the change event on a text input whenever the user pauses typing.
 *
 *	By Bennett McElwee
 *
 *  Copyright (c) 2011 Bennett McElwee
 *  Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
*/

(function($) {
	$.fn.incremental = function(options) {
		var delayMs = (options && options.delayMs) || options || 500;
		return this.each(function () {			
			if (this.type.toUpperCase() == "TEXT" || this.nodeName.toUpperCase() == "TEXTAREA") {
				var timer = 0;
				this.incrementalBase = $(this).val();
				$(this).change(function(event) {
					clearTimeout (timer);
					this.incrementalBase = $(this).val();
					console.log("Change: set base to [" + this.incrementalBase + "]");
				}).keyup(function(event) {
					var element = $(this);
					console.log("Key up: base, value = [" + this.incrementalBase + "] [" + element.val() + "]");
					clearTimeout (timer);
					if (element.val() !== this.incrementalBase) {
						timer = setTimeout(function() {
							element.change();
						}, delayMs);
					}
				});
			}
		});
	};
})(jQuery);
