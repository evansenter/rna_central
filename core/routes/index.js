var express     = require("express");
var methods     = require("methods");
var __          = require("underscore");
var base_router = exports = module.exports = function(options) {
  function router(req, res, next) {
    router.handle(req, res, next);
  }
  
  router.__proto__ = express.Router();
  
  __.each(methods, __.bind(function(method) {
    this[method] = __.wrap(this.__proto__.__proto__[method], function(wrapped_verb) {
      var response                     = wrapped_verb.apply(this, __.toArray(arguments).slice(1));
      var top_core_index_in_middleware = __.indexOf(__.pluck(router.stack, "_core"), true);
      
      if (top_core_index_in_middleware > -1) {
        this.stack.splice(__.indexOf(__.pluck(router.stack, "_core"), true), 0, this.stack.splice(this.stack.length - 1, 1)[0]);
      }
      
      return response;
    });
  }, router));
  
  router.update_settings = function(context) { context.call(this); };
  router.update_settings(function() {
    this.webserver_for = "Core";
  
    this.get(["/", "/home"], __.bind(function(req, res) {
      res.render("index", { title: this.webserver_for + "::Home" });
    }, this));

    this.get("/server", __.bind(function(req, res) {
      res.render("index", { title: this.webserver_for + "::Server" });
    }, this));

    this.get("/info", __.bind(function(req, res) {
      res.render("index", { title: this.webserver_for + "::Info" });
    }, this));

    this.get("/contact", __.bind(function(req, res) {
      res.render("index", { title: this.webserver_for + "::Contact" });
    }, this));
    
    __.each(this.stack, function(layer) { layer._core = true; });
  });
  
  return router;
};
