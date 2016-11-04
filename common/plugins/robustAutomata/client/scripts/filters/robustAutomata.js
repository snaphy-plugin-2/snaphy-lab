'use strict';

angular.module($snaphy.getModuleName())

//Define your filter specific for this plugin.
//
//rob.bins => "rob bins"
.filter('removeDot', function() {
    return function(input) {
        return input.replace(/\./g, ' ');
    };
})


.filter('myStrictFilter', function($filter) {
    return function(input, predicate) {
        return $filter('filter')(input, predicate, true);
    }
})

.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if(typeof value === "string"){
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        }else{
            return value;
        }    
    };
})


.filter('removeSpaces', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        var val = string.replace(/[\s]/g, '');
        return val;
    };
}])

.filter('camelCaseToSpaces', function($filter){
    return function(input){
        var val =  input.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
        return val.trim();
    };
})

.filter('unique', function() {
    return function(arr, field) {
        var o = {},
            i, l = arr.length,
            r = [];
        for (i = 0; i < l; i += 1) {
            o[arr[i][field]] = arr[i];
        }
        for (i in o) {
            r.push(o[i]);
        }
        return r;
    };
});
