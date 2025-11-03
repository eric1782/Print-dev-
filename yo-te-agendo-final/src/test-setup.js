// Configuración de matchers de Jasmine
window.jasmine = window.jasmine || {};
window.expect = window.expect || {};

// Mock para pruebas
window.jasmine.createSpy = function(name) {
  const spy = function() {
    spy.calls.push(Array.from(arguments));
  };
  spy.calls = [];
  spy.name = name;
  return spy;
};

// Helpers para las pruebas
window.jasmine.calls = {
  any: function() { return true; },
  count: function() { return this.calls.length; },
  argsFor: function(index) { return this.calls[index]; },
  allArgs: function() { return this.calls; },
  reset: function() { this.calls = []; }
};