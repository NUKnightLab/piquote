/*	KL.QuoteComposition
================================================== */

KL.Slider = KL.Class.extend({
	
	includes: [KL.Events, KL.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, add_to_container, options) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			slider_item_container: {}
		};
		
		// Data
		this.data = {
			slides: []
		};
		
		//Options
		this.options = {
			width: 		100,
			height: 	100,
			duration: 	1000,
			ease: 		KL.Ease.easeInOutQuint,
		};
		
		// SLIDES
		this._slides = [];
		this.slide_spacing;

		// ANIMATION OBJECT
		this.animator = null;
		
		// Merge Data and Options
		KL.Util.mergeData(this.options, options);
		//KL.Util.mergeData(this.data, data);
		this.data = data;
		
		this._el.container = KL.Dom.create("div", "kl-slider");
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
	},

	loadSlides: function() {
		this._createSlides(this.data);
		this._updateDisplay();

		// Ready
		this._onLoaded();
	},

	/*	Events
	================================================== */
	_onLoaded: function() {
		this.fire("loaded", this.data);
	},

	/*	Private Methods
	================================================== */
	// Update Display
	_updateDisplay: function(width, height, animate, layout) {
		// Update width and height
		this.options.width = this._el.container.offsetWidth;
		this.options.width = this._slides[0]._el.container.offsetWidth;
		this.options.height = this._el.container.offsetHeight;

		this.slide_spacing = this.options.width;

		// Position slides
		for (var i = 0; i < this._slides.length; i++) {
			//this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
			this._slides[i].setPosition({left:(this.slide_spacing * i), top:0});
			
		};
		
		this.animator = KL.Animate(this._el.slider_container, {
			left: 		-(this.slide_spacing * 1) + "px",
			duration: 	this.options.duration,
			easing: 	this.options.ease
			//complete: 	this._onSlideChange(displayupdate)
		});	
	},
	
	_createSlides: function(array) {
		for (var i = 0; i < array.length; i++) {
            this._createSlide(array[i]);
		}
	},

	_createSlide: function(d, title_slide, n) {
		var slide = new KL.Slide(d);
		this._addSlide(slide);
		if(n < 0) { 
		    this._slides.push(slide);
		} else {
		    this._slides.splice(n, 0, slide);
		}
	},

	_addSlide:function(slide) {
		slide.addTo(this._el.slider_item_container);
	},

	_initLayout: function () {
		
		// Create Layout
		this._el.slider_container_mask		= KL.Dom.create('div', 'kl-slider-container-mask', this._el.container);
		this._el.slider_container			= KL.Dom.create('div', 'kl-slider-container vcoanimate', this._el.slider_container_mask);
		this._el.slider_item_container		= KL.Dom.create('div', 'kl-slider-item-container', this._el.slider_container);


	},
	
	_initEvents: function () {
		//KL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});