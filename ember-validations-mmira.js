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
})


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