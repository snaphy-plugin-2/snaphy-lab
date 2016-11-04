/**
 * Created by robins on 2/12/15.
 */
/*global angular, $snaphy, jQuery, setTimeout*/
(function() {
    'use strict';
})();

angular.module($snaphy.getModuleName())

.config(function($validatorProvider) {
    $validatorProvider.setDefaults({
        errorClass: 'help-block text-right animated fadeInDown',
        errorElement: 'div',
        errorPlacement: function(error, e) {
            jQuery(e).parents('.form-group .form-material').append(error);
        },
        highlight: function(e) {
            jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
            jQuery(e).closest('.help-block').remove();
        },
        success: function(e) {
            jQuery(e).closest('.form-group').removeClass('has-error');
            jQuery(e).closest('.help-block').remove();
        },
        //http://stackoverflow.com/questions/22697276/selectize-js-jquery-validation
        //the default ignore selector is ':hidden', the following selectors restore the default behaviour when using selectize.js
        //:hidden:not([class~=selectized]) | selects all hidden elements, but not the original selects/inputs hidden by selectize
        //:hidden > .selectized | to restore the behaviour of the default selector, the original selects/inputs are only validated if their parent is visible
        //.selectize-control .selectize-input input | this rule is not really necessary, but ensures that the temporary inputs created by selectize on the fly are never validated
        ignore: ':hidden:not([class~=selectized]), :hidden > .selectized, .selectize-control .selectize-input input'
        //optional: add rules etc. according to jquery-validation docs

    });
})






.config(function($validatorProvider) {
    $validatorProvider.addMethod("regex", function(value, element) {
        return RegExp.test(value);
    }, "Please enter a valid data.");
})





/**
 *http://stackoverflow.com/questions/2901125/jquery-validate-required-select
  // configure your validation
  $("form").validate({
   rules: {
    SelectName: { valueNotEquals: "default" }
   },
   messages: {
    SelectName: { valueNotEquals: "Please select an item!" }
   }
  });
 * @param  {[type]} function ($validatorProvider [description]
 * @return {[type]}          [description]
 */
.config(function($validatorProvider) {
    $validatorProvider.addMethod("valueNotEquals", function(value, element, arg) {
        return arg !== value;
    }, "Please select some value");
})






//regex for matching 12 hr time format.
.config(function($validatorProvider) {
    $validatorProvider.addMethod("time12h", function(value, element) {
        if(!value){
            //In case of blank for mapstrack location  entry
            return true;
        }
        value = value.trim();
        if(!value){
            //in case of blank
            return true;
        }

        patt = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;
        return patt.test(value);
    }, "Time format must be (MM:HH AM/PM)");
});
/*.config(function($validatorProvider) {
    $validatorProvider.addMethod("relation", function(value, element, arg) {
        //console.log("i am here");
        return arg !== value;
    }, "Please select some value");
});*/
