/*	KL.QuoteComposition
================================================== */

KL.Slide = KL.Class.extend({
	
	includes: [KL.Events, KL.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, add_to_container, options) {
		// DOM ELEMENTS
		this._el = {
			container: {}
		};
		
		// Data
		this.data = {};
		
		//Options
		this.options = {};
		
		// SLIDES
		this._slides = [];

		// ANIMATION OBJECT
		this.animator = null;
		
		// Merge Data and Options
		KL.Util.mergeData(this.options, options);
		KL.Util.mergeData(this.data, data);
		
		
		this._el.container = KL.Dom.create("div", "kl-slide");
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},

	/*	Events
	================================================== */
	
	/*	Private Methods
	================================================== */

	_initLayout: function() {
		
		// Create Layout
		this._el.container.appendChild(this.data._el.container);
		//trace(this.data);
		//this.data.addTo(this._el.container);
		//trace(this._el.container);

	},
	
	_initEvents: function () {
		//KL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});