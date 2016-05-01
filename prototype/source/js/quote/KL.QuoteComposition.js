/*	KL.QuoteComposition
================================================== */
// TODO: Animate into existince


KL.QuoteComposition = KL.Class.extend({
	
	includes: [KL.Events, KL.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			background: {},
			composition_container: {},
			composition_text: {},
			blockquote: {},
			blockquote_p: {},
			citation: {},
			image: {},
			button_group: {},
			button_tweet: {},
			button_download: {},
			button_anchor_left: {},
			button_anchor_right: {},
			button_anchor_center: {},
			button_make: {}
		};
		
		// Data
		this.data = {
			quote: "Quote goes here, gonna make it longer to see",
			cite: "Citation",
			image: "Description",
			credit: ""
		};
	
		//Options
		this.options = {
			editable: true,
			anchor: false,
			classname: "",
			base_classname: "kl-quotecomposition"
		};
	
		this.animator = null;
		
		// Merge Data and Options
		KL.Util.mergeData(this.options, options);
		KL.Util.mergeData(this.data, data);
		
		

		
		
		this._el.container = KL.Dom.create("div", this.options.base_classname);

		this._updateClassName();
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},
	
	update: function() {
		this._update();
	},

	/*	Events
	================================================== */
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},

	_onAnchorLeft: function(e) {
		this.options.anchor = "left";
		this._updateClassName();
		this._updateAlignButtons(this._el.button_anchor_left);
	},

	_onAnchorRight: function(e) {
		this.options.anchor = "right";
		this._updateClassName();
		this._updateAlignButtons(this._el.button_anchor_right);
	},

	_onAnchorCenter: function(e) {
		this.options.anchor = false;
		this._updateClassName();
		this._updateAlignButtons(this._el.button_anchor_center);
	},

	_onMake: function(e) {
		var url_vars = "?";
		url_vars += "anchor=" + this.options.anchor;
		url_vars += "&quote=" + this._el.blockquote_p.innerHTML;
		url_vars += "&cite=" + this._el.citation.innerHTML;
		url_vars += "&image=" + this.data.image;
		url_vars += "&credit=" + this.data.credit;
		
		if (!window.location.origin) {
  			window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
		}
		var win = window.open(window.location.origin + "/composition.html" + url_vars, '_blank');
  		win.focus();
	},

	_onLoaded: function() {
		this.fire("loaded", this.options);
	},
	
	/*	Private Methods
	================================================== */
	_updateAlignButtons: function(elem) {
		this._el.button_anchor_left.className = "btn btn-default";
		this._el.button_anchor_center.className = "btn btn-default";
		this._el.button_anchor_right.className = "btn btn-default";

		elem.className = "btn btn-default active";
	},

	_update: function() {
		this._el.blockquote_p.innerHTML = this.data.quote;
		this._el.citation.innerHTML = this.data.cite;
		this._el.image.style.backgroundImage = "url('" + this.data.image + "')";

		this._el.blockquote_p.contentEditable = this.options.editable;
		this._el.citation.contentEditable = this.options.editable;
		
	},

	_updateClassName: function() {
		this.options.classname = this.options.base_classname;

		if (this.options.anchor) {
			this.options.classname += " kl-anchor-" + this.options.anchor;
		}

		if (this.options.editable) {
			this.options.classname += " kl-editable";
		}

		this._el.container.className = this.options.classname;
	},

	_initLayout: function () {
		
		// Create Layout
		this._el.composition_container 	= KL.Dom.create("div", "kl-quotecomposition-container", this._el.container);
		this._el.composition_text		= KL.Dom.create("div", "kl-quotecomposition-text", this._el.composition_container);
		this._el.blockquote				= KL.Dom.create("blockquote", "", this._el.composition_text);
		this._el.blockquote_p			= KL.Dom.create("p", "", this._el.blockquote);
		this._el.citation 				= KL.Dom.create("cite", "", this._el.blockquote);
		this._el.background				= KL.Dom.create("div", "kl-quotecomposition-background", this._el.composition_container);
		this._el.image					= KL.Dom.create("div", "kl-quotecomposition-image", this._el.composition_container);

		// Create Buttons
		this._el.button_group 			= KL.Dom.create("div", "btn-group", this._el.container);
		//this._el.button_tweet 			= KL.Dom.create("div", "btn btn-default", this._el.button_group);
		//this._el.button_download 		= KL.Dom.create("div", "btn btn-default", this._el.button_group);

		this._el.button_anchor_left 	= KL.Dom.create("div", "btn btn-default", this._el.button_group);
		this._el.button_anchor_center 	= KL.Dom.create("div", "btn btn-default", this._el.button_group);
		this._el.button_anchor_right 	= KL.Dom.create("div", "btn btn-default", this._el.button_group);
		this._el.button_make 			= KL.Dom.create("div", "btn btn-primary btn-right", this._el.button_group);

		//this._el.button_tweet.innerHTML = "Tweet";
		//this._el.button_download.innerHTML = "Download";

		this._el.button_anchor_left.innerHTML = "<span class='glyphicon glyphicon-align-left'></span>";
		this._el.button_anchor_center.innerHTML = "<span class='glyphicon glyphicon-align-center'></span>";
		this._el.button_anchor_right.innerHTML = "<span class='glyphicon glyphicon-align-right'></span>";
		this._el.button_make.innerHTML = "<span class='glyphicon glyphicon-circle-arrow-down'></span> Save";

		KL.DomEvent.addListener(this._el.button_anchor_left, 'click', this._onAnchorLeft, this);
		KL.DomEvent.addListener(this._el.button_anchor_right, 'click', this._onAnchorRight, this);
		KL.DomEvent.addListener(this._el.button_anchor_center, 'click', this._onAnchorCenter, this);
		KL.DomEvent.addListener(this._el.button_make, 'click', this._onMake, this);

		if (this.options.anchor) {
			//this._el.composition_container.className = "kl-quotecomposition-container kl-anchor-" + this.options.anchor;
			if (this.options.anchor == "left") {
				this._el.button_anchor_left.className = "btn btn-default active";
			} else {
				this._el.button_anchor_right.className = "btn btn-default active";
			}
		} else {
			this._el.button_anchor_center.className = "btn btn-default active";
		}
		
		this._update();
	},
	
	_initEvents: function () {
		KL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});