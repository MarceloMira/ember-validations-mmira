(function() {
  
  "use strict";

  Ember.Validations.Mixin.reopen({
    init: function() {
      this._super();
      this.errors = Ember.Validations.Errors.create();
      this.showErros = false;
      this._dependentValidationKeys = {};
      this.validators = Ember.makeArray();
      if (this.get('validations') === undefined) {
        this.validations = {};
      }
      this.buildValidators();
      this.validators.forEach(function(validator) {

        validator.addObserver('errors.[]', this, function(sender, key, value, context, rev) {
          var errors = Ember.makeArray();
          this.validators.forEach(function(validator) {
            if (validator.property === sender.property) {
              errors = errors.concat(validator.errors);
            }
          }, this);

          /* Marcelo Mira -- Add an {property}_isValid to errors array. */
          if(validator.errors.length == 0){
            this.get('errors').set(validator.property + '_isValid', true );
          } else {
            this.get('errors').set(validator.property + '_isValid', false );
          }

          this.set('errors.' + sender.property, errors);
        });
      }, this);
    }
  });

Ember.Validations.validators.local.Equals = Ember.Validations.validators.Base.extend({

  call: function() {
    
    var first = this.model.get(this.options.first),
    last = this.model.get(this.options.last),s
    
    if (first !== last){
      this.errors.pushObject(this.options.message);
    }

  }

});

Ember.Validations.validators.local.Property = Ember.Validations.validators.Base.extend({

  call: function() {
    if (this.model.get(this.options.isTrue)){
      this.errors.pushObject(this.options.message);
    }

  }

});

Ember.I18n.translations = {

  errors: {

    inclusion: "No está incluído en la lista",
    exclusion: "Se encuentra reservado",
    invalid: "Es inválido",
    confirmation: "Es desigual a {{attribute}}",
    accepted: "Debe ser aceptado",
    empty: "No puede estar vacío",
    blank: "No puede estar en blanco",
    present: "Debe estar en blanco",
    tooLong: "Es demasiado largo (el máximo es de {{count}} caracter(es) )",
    tooShort: "Es demasiado corto (el minimo es de {{count}} caracter(es) )",
    wrongLength: "Es de longitud incorrecta (debería ser de {{count}} caracter(es) )",
    notANumber: "No es un número",
    notAnInteger: "Debe ser un número entero",
    greaterThan: "Debe ser mayor que {{count}}",
    greaterThanOrEqualTo: "Debe ser mayor o igual que {{count}}",
    equalTo: "Debe ser igual que {{count}}",
    lessThan: "Debe ser menor que {{count}}",
    lessThanOrEqualTo: "Debe ser menor o igual que {{count}}",
    otherThan: "Debe ser otro que {{count}}",
    odd: "Debe ser impar",
    even: "Debe ser par"

  }
  
}

})();
