/**
	Piquote
	Designed and built by Zach Wise at Knight Lab
*/   

/*	Required Files
	CodeKit Import
	http://incident57.com/codekit/
================================================== */
// CORE
	// @codekit-prepend "core/KL.js";
	// @codekit-prepend "core/KL.Util.js";
	// @codekit-prepend "core/KL.Class.js";
	// @codekit-prepend "core/KL.Events.js";
	// @codekit-prepend "core/KL.Browser.js";
	// @codekit-prepend "core/KL.Load.js";
	// @codekit-prepend "data/KL.Data.js";

// ANIMATION
	// @codekit-prepend "animation/KL.Ease.js";
	// @codekit-prepend "animation/KL.Animate.js";

// DOM
	// @codekit-prepend "dom/KL.DomMixins.js";
	// @codekit-prepend "dom/KL.Dom.js";
	// @codekit-prepend "dom/KL.DomUtil.js";
	// @codekit-prepend "dom/KL.DomEvent.js";
	// @codekit-prepend "dom/KL.StyleSheet.js";

// QUOTE
	// @codekit-prepend "quote/KL.QuoteComposition.js";

// SLIDER
	// @codekit-prepend "slider/KL.Slide.js";
	// @codekit-prepend "slider/KL.Slider.js";

 

KL.Piquote = (function() {

	// DOM ELEMENTS
	this.el = {
		cover_content: 		KL.Dom.get("cover-content"),
		btn_quote_create: 	KL.Dom.get("btn-quote-create"),
		layout_editor: 		KL.Dom.get("layout-editor"),
		editor_content: 	{},
		url_input: 			KL.Dom.get("quote-url"),
		background_grid: 	KL.Dom.get("background-grid")

	};

	// OPTIONS
	this.options = {
		width: 				window.innerWidth,
		height: 			window.innerHeight,
		grid_item_width: 	251,
		grid_item_height: 	141
	};

	// GRID ITEMS
	this.grid_items = [];
	
	// SLIDER
	this.slider = {};

	// Quote Objects
	this.quotes = [];

	// Quote Compositions
	this.quote_compositions = [];

	//this._el.menubar			= VCO.Dom.create('div', 'vco-menubar', this._el.container);
	
	// API URL
	this.api_url = "https://piquote.knilab.com/getResults";

	// GRID URL
	this.grid_url = "grid.json";

	// SCRAPE URL
	this.scrape_url = function() {
		var api_call = api_url + "?a=" + this.el.url_input.value;

		KL.getJSON(api_call ,function(d) {
			this.createQuoteObjects(d);
			this.createCompositions(d);
		});
	};

	// CREATE COMPOSITIONS
	this.createCompositions = function(d) {

		this.quote_compositions = [];
		
		// LAYOUT
		this.el.layout_editor.innerHTML = "";
		this.el.editor_content = KL.Dom.create('div', 'editor-content', this.el.layout_editor);


		for (i=0; i < this.quotes.length; i++) {
			// var composition = new KL.QuoteComposition(this.quotes[i], {anchor:false});
			
			// composition.addTo(this.el.editor_content);
			// this.quote_compositions.push(composition);

			this.createComposition(this.quotes[i], false);

		}

		//this.quote = new KL.QuoteComposition(d, {anchor:"left"});

		//this.quote.addTo(this.el.editor_content);

		// SLIDER POSSIBILITY
		//this.slider = new KL.Slider([this.another_quote, this.quote, this.other_quote], this.el.editor_content);
		//this.slider.on('loaded', this._onSliderLoaded, this);
		//this.slider.loadSlides();
		//this.quote = new KL.QuoteComposition(d, {}, this.el.editor_content);

	};

	this.createComposition = function(d, anchor) {
		var composition = new KL.QuoteComposition(d, {anchor:anchor});
		composition.addTo(this.el.editor_content);
		this.quote_compositions.push(composition);
	};

	this.createQuoteObjects = function(d) {
		this.quotes = [];

		for (i=0; i < d.quote.length; i++) {
			var quote = {
				quote: "",
				cite: "",
				credit: "",
				image: ""
			};

			quote.quote = d.quote[i];

			if (d.image[i]) {
				quote.image = d.image[i];
			} else {
				quote.image = d.image[0];
			}

			this.quotes.push(quote);

		}
	};

	/*	BACKGROUND GRID
	================================================== */
	this.createBackgroundGrid = function() {
		var number_columns = Math.floor(this.options.width/this.options.grid_item_width),
			number_rows = Math.ceil((this.options.height - this.el.cover_content.offsetHeight)/this.options.grid_item_height),
			limit = (number_columns * number_rows);

		KL.getJSON(this.grid_url ,function(d) {
			var grid_items = d.grid_items,
				i = 0,
				more_needed = 0;

			for (i=0; i < grid_items.length; i++) {
				if (i < limit) {
					this.createGridItem(grid_items[i]);
				}
			}

			if (i < limit) {
				more_needed = limit - i;

				for (i=0; i < more_needed; i++) {
					this.createGridItem(grid_items[i]);
				}
			}

			this.resizeGrid();
		});

		
	};

	this.createGridItem = function(d) {
		var g_item = 		KL.Dom.create('div', 'grid-item', this.el.background_grid);
		var g_item_image = 	KL.Dom.create('img', '', g_item);
		g_item_image.src = d;

		this.grid_items.push(g_item)
	};

	this.resizeGrid = function() {
		var new_width = 100/Math.floor(this.options.width/this.options.grid_item_width);

		this.el.background_grid.style.top = this.el.cover_content.offsetHeight + "px";

		for (i=0; i < this.grid_items.length; i++) {
			this.grid_items[i].style.width = new_width + "%";
		}
	};

	/*	EVENTS
	================================================== */
	this._onQuoteCreate = function(e) {
		this.scrape_url();
	};

	this._onSliderLoaded = function(e) {
		var added_height = 0;
		if (this.el.layout_editor.offsetHeight < 350) {
			added_height = 350
		}
		this.el.background_grid.style.top = this.el.cover_content.offsetHeight + added_height + "px";
		//this.el.layout_editor.style.display = "block";
		//this.el.layout_editor.style.height = "350px";
		
	};

	window.onresize = function(event) {

		this.options.width = window.innerWidth;
		this.options.height = window.innerHeight;

		this.resizeGrid();
	}

	/*	LISTENERS
	================================================== */
	KL.DomEvent.addListener(this.el.btn_quote_create, 'click', this._onQuoteCreate, this);

	/*	INIT
	================================================== */
	this.createBackgroundGrid();
	

})();





