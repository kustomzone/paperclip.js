var ivd            = require("ivd");
var extend         = require("xtend/mutable");
var BaseView       = ivd.View;
var Accessor       = require("./accessor");
var _stringifyNode = require("./utils/stringify-node");
var Transitions    = require("./transitions");
var Reference      = require("./reference");

/**
 */

function PaperclipView(node, template, options) {

  if (!options) options = {};

  this.parent       = options.parent;
  this.accessor     = this.parent ? this.parent.accessor : new Accessor();
  this.transitions  = new Transitions();
  this._remove      = this._remove.bind(this);

  BaseView.call(this, node, template, options);
}

/**
 */

extend(PaperclipView.prototype, BaseView.prototype, {

  /**
   */

  get: function(keypath) {
    var v =  this.accessor.get(this.context, keypath);
    return v != void 0 ? v : this.parent ? this.parent.get(keypath) : void 0;
  },

  /**
   */

  set: function(keypath, value) {
    this.accessor.set(this.context, keypath, value);
    this.update(this.context);
  },

  /**
   */

  setProperties: function(properties) {
    for (var keypath in properties) {
      this.accessor.set(this.context, keypath, properties[keypath]);
    }
    this.update(this.context);
  },

  /**
   */

  ref: function(keypath, gettable, settable) {
    if (!this._refs) this._refs = {};

    return new Reference(this, keypath, gettable, settable);
    // return this._refs[keypath] || (this._refs[keypath] = new Reference(this, keypath, gettable, settable));
  },

  /**
   */

  call: function(keypath, params) {
    var v =  this.accessor.get(this.context, keypath);
    return v != void 0 ? this.accessor.call(this.context, keypath, params) : this.parent ? this.parent.call(keypath, params) : void 0;
  },

  /**
   */

  update: function(context) {
    BaseView.prototype.update.call(this, this.context = context);
  },

  /**
   * for testing. TODO - move this stuff to sections instead.
   */

  toString: function() {

    if (this.template.section.document === global.document) {
      return _stringifyNode(this.section.start ? this.section.start.parentNode : this.section.node);
    }

    return (this.section.start ? this.section.start.parentNode : this.section.node).toString();
  },

  /**
   */

  render: function() {

    // re-bind if the old context exists.
    if (!this.context && this.__context) {
      var context    = this.__context;
      this.__context = void 0;
      this.update(context);
    }

    var section = BaseView.prototype.render.call(this);
    this.transitions.enter();
    return section;
  },

  /**
   */

  remove: function() {
    if (this.__context) return;
    if (this.transitions.exit(this._remove)) return;
    this._remove();
    return this;
  },

  /**
   */

  _remove: function() {
    BaseView.prototype.remove.call(this);

    // cache the context incase we re-render this view
    this.__context = this.context;

    // remove the context & unbind all the bindings
    this.update(void 0);
  }
});

/**
 */

module.exports = PaperclipView;