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

 

KL.PiquoteComposition = (function() {

	// DOM ELEMENTS
	this.el = {
		composition: 			KL.Dom.get("kl-quote-comp"),
		quote_text: 			KL.Dom.get("kl-quote-text"),
		cite: 					KL.Dom.get("kl-quote-cite"),
		image: 					KL.Dom.get("kl-quote-image")
	};

	// OPTIONS
	this.options = {
		width: 				window.innerWidth,
		height: 			window.innerHeight
	};

	this.vars = KL.Util.getUrlVars(window.location.href);

	this.el.quote_text.innerHTML = decodeURIComponent(this.vars.quote);
	this.el.cite.innerHTML = decodeURIComponent(this.vars.cite);
	this.el.image.style.backgroundImage = "url(" + this.vars.image + ")";
	this.el.composition.className = "kl-quotecomposition kl-anchor-" + this.vars.anchor;
	

})();

//KL.Util.getUrlVars(window.location.href)





