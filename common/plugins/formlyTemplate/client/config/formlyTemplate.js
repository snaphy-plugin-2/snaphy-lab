(function() {
    'use strict';
})();
/*global angular, $snaphy, $*/

angular.module($snaphy.getModuleName())

/**
 Defigning custom templates for angular-formly.
 */
.run(['formlyConfig', '$timeout', function(formlyConfig, $timeout) {

    formlyConfig.setType({
        name: 'belongsTo',
        templateUrl: '/formlyTemplate/views/autocomplete.html',
        controller: function($scope) {
            //set initial view..
            $scope.to.hide = $scope.to.hide || false;
            //Where tracker object for tracking where where values..
            var whereTracker = {};
            //Set the value initially to hide position..
            $scope.hide = $scope.to.hide;
            $scope.showOrHide = function(){
                if($scope.hide){
                    //Show opposite
                    return "show";
                }else{
                    return "hide";
                }
            };


        var trackWhere = function(){

            //If where query added for filter..
            if($scope.to.where){
                //Form the where query..
                for(var key in $scope.to.where){
                    if($scope.to.where.hasOwnProperty(key)){
                        var keyObj = $scope.to.where[key];
                        whereTracker[key] = keyObj;
                    }
                }
                
            }

            //Now reset where..
            $scope.to.where = {};

            /**
             * Watch the model change for applying the where query..
             * @param {String} whereKey     key  of the where object
             * @param {String} mainModelObj value of the where object.
             * @example
             * "where":{
                  "postId": {
                    "relationName": "post",
                    "relationKey": "id",
                    "key": "postId"
                  }
                }
             */
            //Watch for monotoring the where model for perfect search.
            $scope.$watch("model",
                function() {
                    if(whereTracker){
                        //RUn a loop and add all value to where..
                        for(var whereKey in whereTracker){
                            if(whereTracker.hasOwnProperty(whereKey)){
                                var mainModelObj = whereTracker[whereKey];
                                if(mainModelObj){
                                    //var key = mainModelObj.key;
                                    var relationName = mainModelObj.relationName;
                                    var relationKey = mainModelObj.relationKey;
                                    /*if(key){
                                        if($scope.model[key]){
                                            $timeout(function() {
                                                $scope.to.where[whereKey] = $scope.model[key];
                                            }, 0);
                                        } 
                                        else{
                                            if(relationName && relationKey){
                                                if($scope.model[relationName]){
                                                    if($scope.model[relationName][relationKey]){
                                                        $timeout(function() {
                                                            $scope.to.where[whereKey] = $scope.model[relationName][relationKey];
                                                        }, 0);    
                                                    }
                                                } //if
                                            }
                                        }//else      
                                    }else{
                                        if(relationName && relationKey){
                                            if($scope.model[relationName]){
                                                if($scope.model[relationName][relationKey]){
                                                    $timeout(function() {
                                                        $scope.to.where[whereKey] = $scope.model[relationName][relationKey];
                                                    }, 0);    
                                                } //if
                                            } //if
                                        }//if
                                    } //else*/
                                    if(relationName && relationKey){
                                        if($scope.model[relationName]){
                                            if($scope.model[relationName][relationKey]){
                                                $timeout(function() {
                                                    $scope.to.where[whereKey] = $scope.model[relationName][relationKey];
                                                }, 0);    
                                            }else{
                                                $timeout(function() {
                                                    $scope.to.where[whereKey] = null;
                                                }, 0);
                                            }
                                        }else{
                                            $timeout(function() {
                                                $scope.to.where[whereKey] = null;
                                            }, 0);
                                        }
                                    }else{
                                        $timeout(function() {
                                            $scope.to.where[whereKey] = null;
                                        }, 0);
                                    }
                                } //if
                            }
                        }
                    }
                }, 
                true
            );
        }; //trackWhere

        trackWhere();

            


            if($scope.to.init){
                //Display show create if forcefully displayed set to true..
                $scope.forceDisplayAddFields = true;
            }else{
                //Display show create if forcefully displayed set to false..
                $scope.forceDisplayAddFields = false;
            }


            $scope.$watch("model[options.key]",
                function() {
                    if($scope.model[$scope.options.key] === undefined && $scope.forceDisplayAddFields && $scope.to.create){    
                        $timeout(function() {
                                $scope.model[$scope.options.key] = {};
                        },0);
                      
                    } 
                }
            );

            


            



            $scope.isHidden = function(){
                return $scope.hide;
            };


            $scope.toggleShow = function(){
                $scope.hide = !$scope.hide;
                return $scope.hide;
            };

            $scope.showSearch = function(){
                if($scope.to.search !== undefined){
                    if($scope.to.search ){
                        return true;
                    }
                    else {
                        return false;
                    }
                }else{
                    return true;
                }

            };


            $scope.resetCreate = resetCreate;
            $scope.showCreate = function() {
                //Display show create if forcefully displayed set to true..
                if($scope.forceDisplayAddFields){
                    return true;
                }
                //if create is true then show only
                if($scope.to.create || $scope.to.create === undefined){
                    //model has value then put create == true
                    var containValue = $.isEmptyObject($scope.model[$scope.options.key]);
                    if (containValue) {
                        //put $scope.create == false;
                        $scope.create = false;
                    } else {
                        $scope.create = true;
                    }
                    return $scope.create;
                }
                else{
                    return false;
                }

            };


            



            function resetCreate() {
                $timeout(function() {
                    $scope.model[$scope.options.key] = {};
                    //Set the forceDisplay option to false..
                    $scope.forceDisplayAddFields = false;
                }, 0);
            }

            $scope.forceDisplay = function() {
                //Just add a dummy property.
                if ($scope.to.fields.length) {
                    $timeout(function() {
                        $scope.model[$scope.options.key] = {};
                        $scope.model[$scope.options.key][$scope.to.fields[0].key] = "";
                        $scope.forceDisplayAddFields = true;
                    }, 0);

                }
            };


            $scope.getName = function(){
                if($scope.to.name){
                    return $scope.to.name;
                }
                return $scope.getId();
            };


            $scope.getId = function(){
                if($scope.to.id){
                    return $scope.to.id;
                }
                //fetch a random id..
                $scope.to.id = getRandomInt();
                return $scope.to.id;
            };

        }
    });




    formlyConfig.setType({
        name: 'repeatSection',
        templateUrl: '/formlyTemplate/views/hasManyTemplate.html',
        controller: function($scope) {
            $scope.to.hide = $scope.to.hide || false;
            //Set the value initially to hide position..
            $scope.hide = $scope.to.hide;
            $scope.showOrHide = function(){
                if($scope.hide){
                    //Show opposite
                    return "show";
                }else{
                    return "hide";
                }
            };

            $scope.isHidden = function(){
                return $scope.hide;
            };


            if($scope.to.init === true){
                //Add a new field..
                $scope.addNew();
            }


            $scope.toggleShow = function(){
                $scope.hide = !$scope.hide;
                return $scope.hide;
            };

            $scope.showSearch = function(){
                if($scope.to.search !== undefined){
                    if($scope.to.search ){
                        return true;
                    }
                    else {
                        return false;
                    }
                }else{
                    return true;
                }

            };


            var unique = 1;
            $scope.formOptions = {
                formState: $scope.formState
            };
            $scope.addNew = addNew;
            $scope.copyFields = copyFields;

            function copyFields(fields) {
                fields = angular.copy(fields);
                addRandomIds(fields);
                return fields;
            }

            function addNew() {
                $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
                var repeatsection = $scope.model[$scope.options.key];
                //var lastSection = repeatsection[repeatsection.length - 1];
                var newsection = {};
                // if (lastSection) {
                //     newsection = angular.copy(lastSection);
                // }

                repeatsection.push(newsection);
            }

            function addRandomIds(fields) {
                unique++;
                angular.forEach(fields, function(field, index) {
                    if (field.fieldGroup) {
                        addRandomIds(field.fieldGroup);
                        return; // fieldGroups don't need an ID
                    }
                    if (field.templateOptions && field.templateOptions.fields) {
                        addRandomIds(field.templateOptions.fields);
                    }
                    field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt());
                });
            }


        }
    });

    formlyConfig.setType({
        name: 'arrayValue',
        templateUrl: '/formlyTemplate/views/arrayTemplate.html',
        link: function(scope, element, attrs) {},
        controller: function($scope) {
            var unique = 1;
            $scope.formOptions = {
                formState: $scope.formState
            };

            //console.log($scope.to);

            /*$scope.initialize = function(to){
                if(to.init){
                    //Initialize one ..
                    console.log("Initialize");
                    $scope.addNew();
                }
            };
*/
            var methods = (function() {
                function init() {


                    //Initialize the methods..
                    if ($scope.model[$scope.options.key] === undefined) {
                        addNew();
                    } else {
                        if ($scope.model[$scope.options.key].length === 0) {
                            //Add one data to the begining ..
                            addNew();
                        }
                    }
                }

                function copyFields(fields) {
                    fields = angular.copy(fields);
                    addRandomIds(fields);
                    return fields;
                }

                function addNew() {
                    $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
                    var repeatsection = $scope.model[$scope.options.key];
                    //var lastSection = repeatsection[repeatsection.length - 1];
                    var newsection = {};
                    // if (lastSection) {
                    //     newsection = angular.copy(lastSection);
                    // }

                    //console.log(newsection);
                    repeatsection.push(newsection);
                }

                function addRandomIds(fields) {
                    unique++;
                    angular.forEach(fields, function(field, index) {
                        if (field.fieldGroup) {
                            addRandomIds(field.fieldGroup);
                            return; // fieldGroups don't need an ID
                        }
                        if (field.templateOptions && field.templateOptions.fields) {
                            addRandomIds(field.templateOptions.fields);
                        }
                        field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
                    });
                }

                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min)) + min;
                }

                //call the constructor method..
                init();

                return {
                    copyFields: copyFields,
                    addNew: addNew
                };

            })();


            $scope.getName = function(){
                if($scope.to.name){
                    return $scope.to.name;
                }
                return $scope.getId();
            };


            $scope.addNew = methods.addNew;
            $scope.copyFields = methods.copyFields;
        }
    });


    /*
    For adding object type values..
     */
    formlyConfig.setType({
        name: 'objectValue',
        templateUrl: '/formlyTemplate/views/objectTemplate.html',
        controller: ['$scope', function($scope) {


        }],
        link: function(scope, element) {
            if(scope.model[scope.options.key] === undefined){
                scope.model[scope.options.key] = {};
            }

            var updateData = function(modelDataObj, tempModelObj, property){
                $timeout(function(){
                    tempModelObj[property] = modelDataObj[property];
                });
            };

            scope.objModel = scope.model[scope.options.key] ;
            scope.$watch('model[options.key]', function(value) {
                if($.isEmptyObject( scope.model[scope.options.key] )){
                    scope.objModel = {};
                }

                for(var modelData in scope.model[scope.options.key]){
                    if(scope.model[scope.options.key].hasOwnProperty(modelData)){
                        if(scope.objModel[modelData] !== scope.model[scope.options.key][modelData]){
                            updateData(scope.model[scope.options.key], scope.objModel, modelData);
                        }
                    }
                }
            }, true);




            scope.$watch('objModel', function(value) {
                if(scope.model[scope.options.key] === undefined){
                    scope.model[scope.options.key] = {};
                }
                if(scope.objModel === undefined){
                    scope.objModel = scope.model[scope.options.key];
                }
                for(var modelData in scope.objModel){
                    if(scope.objModel.hasOwnProperty(modelData)){
                        if(scope.objModel[modelData] !== scope.model[scope.options.key][modelData]){
                            //Update the model..
                            scope.model[scope.options.key][modelData] = scope.objModel[modelData];
                        }
                    }
                }

                $timeout(function(){
                    scope.objModel = scope.model[scope.options.key];
                });
            }, true);

        }
    });


    formlyConfig.setType({
        name: 'multipleFileUpload',
        templateUrl: '/formlyTemplate/views/multiFileUpload.html',
        link: function(scope, element) {
            // Randomize progress bars values
            scope.addValue = function(value) {
                $(element)
                    .find('.progress-bar')
                    .each(function() {
                        var $this = jQuery(this);
                        var $random = value + '%';
                        $this.css('width', $random);
                    });

            };

        },
        controller: ['$scope', 'Upload', '$timeout', '$http', 'Database', 'SnaphyTemplate', 'ImageUploadingTracker',
            function($scope, Upload, $timeout, $http, Database, SnaphyTemplate, ImageUploadingTracker) {
                //Initialize the model..
                $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
                $scope.files = [];


                var dbService;
                var url;
                if ($scope.options.templateOptions.containerModel) {
                    dbService = Database.loadDb($scope.options.templateOptions.containerModel);
                } else if ($scope.options.templateOptions.url) {
                    url = $scope.options.templateOptions.url;
                } else {
                    console.error("Either url property of containerModel is required in formly templateOptions for image uploading");
                }
                var uploadUrl;
                if (dbService) {
                    uploadUrl = "/api/containers/" + $scope.options.templateOptions.containerName + "/upload";

                } else {
                    uploadUrl = url.upload;
                }


                $scope.checkData = function() {
                    if ($scope.files.length) {
                        if ($scope.model[$scope.options.key] === undefined) {
                            $scope.model[$scope.options.key] = [];
                        }

                        return true;
                    } else {
                        return false;
                    }
                };


                $scope.loadFromServer = function(file) {
                    if (file.result) {
                        //Check if file really has one params..
                        var count = 0;
                        for (var key in file) {
                            if (file.hasOwnProperty(key)) {
                                count++;
                            }
                        }
                        if (count <= 4) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return false;
                };


                $scope.loadUrl = function(file) {
                    //TODO adding medium for small images load..
                    if(file.result){
                        if(file.result.url){
                            if(file.result.url.unSignedUrl){
                                return file.result.url.unSignedUrl;
                            }
                        }
                    }
                    var url = "/api/containers/" + file.result.container + "/download/medium_" + file.result.name;
                    return url;
                };


                $scope.$watch('model[options.key].length', function(value) {
                    if ($scope.model[$scope.options.key]) {
                        $scope.model[$scope.options.key].forEach(function(modelData, index) {
                            if ($scope.files.length !== 0) {
                                var matchFound = false;
                                $scope.files.forEach(function(dataObj, index) {
                                    if (dataObj.result.name === modelData.name) {
                                        matchFound = true;
                                    }
                                });
                                if (!matchFound) {
                                    $scope.files.push({
                                        result: modelData
                                    });
                                }
                            } else {
                                $scope.files.push({
                                    result: modelData
                                });
                            }
                        }); //model loop
                    } else {
                        //Clean files data too..
                        $scope.files = [];
                    }
                }); //$watch



                $scope.uploadFiles = function($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                    //Increment tracker..TODO CHECK HERE FOR ERROR POSIBILITY.
                    ImageUploadingTracker.incrementTracker();

                    //First initialize progress bar to zero..
                    $scope.addValue(0);
                    var file = $newFiles[0];
                    $scope.f = file;
                    var errFiles = $invalidFiles;
                    $scope.errFile = errFiles && errFiles[0];
                    //Only upload file if it is not a duplicate file..
                    if (file && $duplicateFiles.length === 0 && errFiles.length === 0) {
                        file.upload = Upload.upload({
                            url: uploadUrl,
                            data: {
                                file: file
                            }
                        });

                        file.upload.then(function(response) {
                            $timeout(function() {
                                //file.result = response.data.result.files.file[0];
                                file.result = response.data;
                                if ($scope.model[$scope.options.key] === undefined) {
                                    $scope.model[$scope.options.key] = [];
                                }
                                //console.log(response);
                                //Adding data to the model.
                                $scope.model[$scope.options.key].push(file.result);
                            });

                            //Decrement tracker..TODO CHECK HERE FOR ERROR POSIBILITY.
                            ImageUploadingTracker.decrementTracker();

                            SnaphyTemplate.notify({
                                message: "Image successfully saved to server.",
                                type: 'success',
                                icon: 'fa fa-check',
                                align: 'right'
                            });

                        }, function(response) {
                            if (response.status > 0) {
                                //Decrement tracker..TODO CHECK HERE FOR ERROR POSIBILITY.
                                ImageUploadingTracker.decrementTracker();
                                SnaphyTemplate.notify({
                                    message: "Error saving image to server. Please remove that image and try again.",
                                    type: 'danger',
                                    icon: 'fa fa-times',
                                    align: 'right'
                                });
                                $scope.errorMsg = response.status + ': ' + response.data;
                            }

                        }, function(evt) {
                            $timeout(function() {
                                file.progress = Math.min(100, parseInt(100.0 *
                                    evt.loaded / evt.total));
                                $scope.addValue(file.progress);
                            }, 10);
                        });
                    }else{
                        ImageUploadingTracker.decrementTracker();
                    }
                };

                //Delete the given image...
                $scope.deleteImage = function(files, index) {
                    var backUpFile = files[index];
                    if (backUpFile.result) {
                        var fileName = backUpFile.result.name;
                        var containerName = $scope.options.templateOptions.containerName;
                        var filePath = '/api/containers/' + containerName + '/files/' + fileName;
                        //Now remove the file
                        files.splice(index, 1);
                        $scope.model[$scope.options.key].splice(index, 1);
                        //console.log(backUpFile);
                        // Simple DELETE request example:
                        //console.log(filePath);

                        if (dbService) {
                            dbService.removeFile({
                                container: containerName,
                                file: "original_" + fileName
                            }, function(values) {
                                console.log("file successfully deleted");
                                SnaphyTemplate.notify({
                                    message: "Image successfully deleted from server.",
                                    type: 'success',
                                    icon: 'fa fa-check',
                                    align: 'right'
                                });

                                if(fileName){
                                    //var absFileName = fileName.replace(original, '');
                                    //var originalFileName =  "original_" + absFileName;
                                    var mediumFileName =  "medium_" + fileName;
                                    var smallFileName = "small_" + fileName;
                                    var thumbFilename = "thumb_" + fileName;

                                    var deleteImage = function(dbService, containerName, fileName){
                                    dbService.removeFile({
                                        container: containerName,
                                        file: fileName
                                        }, function(){
                                                //success do nothing..
                                        }, function(){
                                                //Error do nothing..
                                        });
                                    };

                                    //Now delete all the related images too..
                                    deleteImage(dbService, containerName, mediumFileName);
                                    //deleteImage(dbService, containerName, originalFileName);
                                    deleteImage(dbService, containerName, smallFileName);
                                    deleteImage(dbService, containerName, thumbFilename);

                                }

                            }, function(err) {
                                console.error("error deleting file.");
                                SnaphyTemplate.notify({
                                    message: "Error deleting image from server. Please try again.",
                                    type: 'danger',
                                    icon: 'fa fa-times',
                                    align: 'right'
                                });
                                console.error(err);
                                //Add backup file ..
                                files.push(backUpFile);
                                $scope.model[$scope.options.key].push(backUpFile.result);
                            });
                        } else {
                            $http({
                                method: 'DELETE',
                                url: url.delete,
                            }).then(function successCallback(response) {
                                console.log("File successfully deleted.");
                                SnaphyTemplate.notify({
                                    message: "Image successfully deleted from server.",
                                    type: 'success',
                                    icon: 'fa fa-check',
                                    align: 'right'
                                });
                            }, function errorCallback(response) {
                                console.log(response);
                                SnaphyTemplate.notify({
                                    message: "Error deleting image from server. Please try again.",
                                    type: 'danger',
                                    icon: 'fa fa-times',
                                    align: 'right'
                                });
                                //Add backup file ..
                                files.push(backUpFile);
                            });
                        }

                    } else {
                        //simply remove the file
                        files.splice(index, 1);
                        $scope.model[$scope.options.key].splice(index, 1);
                    }
                };

            }
        ]
    });


    formlyConfig.setType({
        name: 'dummy',
        template:
        '<div style="display:none" class="form-group">'+
        '<div  ng-class="[options.templateOptions.colSize, options.templateOptions.color]">'+
        '<div class="form-material" ng-class="options.templateOptions.color">'+
        '<input  class="form-control" type="{{options.templateOptions.type}}"  ng-class="options.templateOptions.class" name="{{options.templateOptions.id}}" id="{{options.templateOptions.id}}" ng-model="model[options.key]">'+
        '<label for="{{options.templateOptions.id}}">{{options.templateOptions.label}}</label>'+
        '</div>'+
        '</div>'+
        '</div>',

        link: function(scope, element, attrs) {
            // ID PROPERTY IS NEEDED FOR VALIDATE TO WORK
            if(scope.options.templateOptions){
                if(!scope.options.templateOptions.colSize){
                    scope.options.templateOptions.colSize = 'col-xs-12';
                }
            }//if

            if(scope.model[scope.options.key] === ""){
                //remove the option..
                delete scope.model[scope.options.key];
            }
        }//link function..
    });




    formlyConfig.setType({
        name: 'singleFileUpload',
        templateUrl: '/formlyTemplate/views/singleFileUpload.html',
        link: function(scope, element, attrs) {
            // Randomize progress bars values
            scope.addValue = function(value) {
                $(element)
                    .find('.progress-bar')
                    .each(function() {
                        var $this = jQuery(this);
                        var $random = value + '%';
                        $this.css('width', $random);
                    });

            };

        },


        controller: ['$scope', 'Upload', '$timeout', '$http', 'Database', 'SnaphyTemplate', 'ImageUploadingTracker',
            function($scope, Upload, $timeout, $http, Database, SnaphyTemplate, ImageUploadingTracker) {

                //Initialize the model..
                $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || {};
                $scope.file = {};

                var dbService;
                var url;
                if ($scope.options.templateOptions.containerModel) {
                    dbService = Database.loadDb($scope.options.templateOptions.containerModel);
                } else if ($scope.options.templateOptions.url) {
                    url = $scope.options.templateOptions.url;
                } else {
                    console.error("Either url property of containerModel is required in formly templateOptions for image uploading");
                }
                var uploadUrl;
                if (dbService) {
                    uploadUrl = "/api/containers/" + $scope.options.templateOptions.containerName + "/upload";
                } else {
                    uploadUrl = url.upload;
                }

                //TODO REMOVE this
                //uploadUrl = "/api/AmazonImages/" +  $scope.options.templateOptions.containerName +  "/upload";


                $scope.checkData = function() {
                    if ($scope.file) {
                        if ($scope.model[$scope.options.key] === undefined) {
                            $scope.model[$scope.options.key] = {};
                        }
                        return true;
                    } else {
                        return false;
                    }
                };


                $scope.loadFromServer = function(file) {
                    if (file.result) {
                        //Check if file really has one params..
                        var count = 0;
                        for (var key in file) {
                            if (file.hasOwnProperty(key)) {
                                count++;
                            }
                        }
                        if (count === 3) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return false;
                };


                $scope.loadUrl = function(file) {
                    //TODO adding medium for small images load..
                    if(file.result){
                        if(file.result.url){
                            if(file.result.url.unSignedUrl){
                                return file.result.url.unSignedUrl;
                            }
                        }
                    }
                    var url = "/api/containers/" + file.result.container + "/download/medium_" + file.result.name;
                    return url;
                };


                $scope.$watch('model[options.key]', function() {
                    if (!$.isEmptyObject($scope.model[$scope.options.key])) {
                        var modelData = $scope.model[$scope.options.key];
                        if ($.isEmptyObject($scope.file)) {
                            //Just add the data..
                            $scope.file = $scope.file || {};
                            $scope.file.result = modelData;
                        } else {
                            if ($scope.file.result) {
                                if ($scope.file.result.name !== modelData.name) {
                                    $scope.file = {};
                                    $scope.file.result = modelData;
                                }
                            } else {
                                $scope.file = $scope.file || {};
                                $scope.file.result = modelData;
                            }
                        }
                    } else {
                        //Clean files data too..
                        $scope.file = {};
                    }
                }); //$watch



                $scope.uploadFiles = function($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                    if ($newFiles === null) {
                        return false;
                    }

                    //Increment tracker..TODO CHECK HERE FOR ERROR POSIBILITY.
                    ImageUploadingTracker.incrementTracker();

                    //First initialize progress bar to zero..
                    $scope.addValue(0);
                    var file = $newFiles[0];
                    $scope.file = file;
                    var errFiles = $invalidFiles;
                    $scope.errFile = errFiles && errFiles[0];
                    //Only upload file if it is not a duplicate file..
                    if (file && $duplicateFiles.length === 0 && errFiles.length === 0) {
                        file.upload = Upload.upload({
                            url: uploadUrl,
                            data: {
                                file: file,
                                container: $scope.options.templateOptions.containerName
                            }
                        });

                        file.upload.then(function(response) {

                            $timeout(function() {
                                //file.result = response.data.result.files.file[0];
                                //console.log(response.result);
                                file.result = response.data;


                                if ($scope.model[$scope.options.key] === undefined) {
                                    $scope.model[$scope.options.key] = {};
                                }
                                //Adding data to the model.
                                $scope.model[$scope.options.key] = file.result;
                            });
                            //decrement the tracker..
                            ImageUploadingTracker.decrementTracker();
                            SnaphyTemplate.notify({
                                message: "Image successfully saved to server.",
                                type: 'success',
                                icon: 'fa fa-check',
                                align: 'right'
                            });
                        }, function(response) {
                            //decrement the tracker..
                            ImageUploadingTracker.decrementTracker();
                            if (response.status > 0) {
                                SnaphyTemplate.notify({
                                    message: "Error saving image to server. Please remove the image and try again.",
                                    type: 'danger',
                                    icon: 'fa fa-times',
                                    align: 'right'
                                });
                                $scope.errorMsg = response.status + ': ' + response.data;
                            }

                        }, function(evt) {
                            $timeout(function() {
                                file.progress = Math.min(100, parseInt(100.0 *
                                    evt.loaded / evt.total));
                                $scope.addValue(file.progress);
                            }, 10);
                        });
                    }else{
                        ImageUploadingTracker.decrementTracker();
                    }
                };

                //Delete the given image...
                $scope.deleteImage = function(file) {
                    var backUpFile = angular.copy(file);
                    if (backUpFile.result) {
                        var fileName = backUpFile.result.name;
                        var containerName = $scope.options.templateOptions.containerName;
                        //var filePath = '/api/containers/' + containerName + '/files/' + fileName;
                        //Now remove the file
                        file = {};
                        $scope.model[$scope.options.key] = {};
                        //console.log(backUpFile);
                        // Simple DELETE request example:
                        //console.log(filePath);

                        if (dbService) {
                            dbService.removeFile({
                                container: containerName,
                                file: "original_" + fileName
                            }, function() {
                                //console.log("file successfully deleted");
                                SnaphyTemplate.notify({
                                    message: "Image successfully deleted from server.",
                                    type: 'success',
                                    icon: 'fa fa-check',
                                    align: 'right'
                                });

                                //Now also delete the remaining..
                               
                                if(fileName){
                                    //var absFileName = fileName.replace(original, '');
                                    //var originalFileName =  "original_" + absFileName;
                                    var mediumFileName =  "medium_" + fileName;
                                    var smallFileName = "small_" + fileName;
                                    var thumbFilename = "thumb_" + fileName;

                                    var deleteImage = function(dbService, containerName, fileName){
                                    dbService.removeFile({
                                        container: containerName,
                                        file: fileName
                                        }, function(){
                                                //success do nothing..
                                        }, function(){
                                                //Error do nothing..
                                        });
                                    };

                                    //Now delete all the related images too..
                                    deleteImage(dbService, containerName, mediumFileName);
                                    //deleteImage(dbService, containerName, originalFileName);
                                    deleteImage(dbService, containerName, smallFileName);
                                    deleteImage(dbService, containerName, thumbFilename);

                                }
                                 
                                    
                          



                            }, function() {
                                //console.error("error deleting file.");
                                //console.error(err);
                                $timeout(function() {
                                    //Add backup file ..
                                    $scope.file = backUpFile;
                                    $scope.model[$scope.options.key] = backUpFile.result;
                                }, 0);

                                SnaphyTemplate.notify({
                                    message: "Error deleting image from server. Please try again.",
                                    type: 'danger',
                                    icon: 'fa fa-times',
                                    align: 'right'
                                });
                            });
                        } else {
                            $http({
                                method: 'DELETE',
                                url: url.delete,
                            }).then(function successCallback() {
                                // console.log("File successfully deleted.");
                                SnaphyTemplate.notify({
                                    message: "Image successfully deleted from server.",
                                    type: 'success',
                                    icon: 'fa fa-check',
                                    align: 'right'
                                });
                            }, function errorCallback(response) {
                                //console.log(response);
                                //Add backup file ..
                                $scope.file = backUpFile;
                                SnaphyTemplate.notify({
                                    message: "Error deleting image from server. Please try again.",
                                    type: 'danger',
                                    icon: 'fa fa-times',
                                    align: 'right'
                                });
                            });
                        }

                    } else {
                        //simply remove the file
                        $scope.files = {};
                        $scope.model[$scope.options.key] = {};
                    }
                };

            }
        ]
    });



    formlyConfig.setType({
        name: 'singlePDFUpload',
        templateUrl: '/formlyTemplate/views/singlePDFUpload.html',
        link: function(scope, element, attrs) {
            // Randomize progress bars values
            scope.addValue = function(value) {
                $(element)
                    .find('.progress-bar')
                    .each(function() {
                        var $this = jQuery(this);
                        var $random = value + '%';
                        $this.css('width', $random);
                    });

            };

        },


        controller: ['$scope', 'Upload', '$timeout', '$http', 'Database', 'SnaphyTemplate', 'ImageUploadingTracker',
            function($scope, Upload, $timeout, $http, Database, SnaphyTemplate, ImageUploadingTracker) {

                //Initialize the model..
                $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || {};
                $scope.file = {};
                $scope.options.templateOptions.maxSize = $scope.options.templateOptions.maxSize || "'20MB'";
                $scope.options.templateOptions.pattern = $scope.options.templateOptions.pattern || 'application/*';


                var dbService;
                var url;
                if ($scope.options.templateOptions.containerModel) {
                    dbService = Database.loadDb($scope.options.templateOptions.containerModel);
                } else if ($scope.options.templateOptions.url) {
                    url = $scope.options.templateOptions.url;
                } else {
                    console.error("Either url property of containerModel is required in formly templateOptions for file uploading");
                }
                var uploadUrl;
                if (dbService) {
                    uploadUrl = "/api/containers/" + $scope.options.templateOptions.containerName + "/upload";
                } else {
                    uploadUrl = url.upload;
                }

                //TODO REMOVE this
                //uploadUrl = "/api/AmazonImages/" +  $scope.options.templateOptions.containerName +  "/upload";


                $scope.checkData = function() {
                    if ($scope.file) {
                        if ($scope.model[$scope.options.key] === undefined) {
                            $scope.model[$scope.options.key] = {};
                        }
                        return true;
                    } else {
                        return false;
                    }
                };


                $scope.loadFromServer = function(file) {
                    if (file.result) {
                        //Check if file really has one params..
                        var count = 0;
                        for (var key in file) {
                            if (file.hasOwnProperty(key)) {
                                count++;
                            }
                        }
                        if (count === 3) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    return false;
                };


                $scope.loadUrl = function(file) {
                    var url = "/api/containers/" + file.result.container + "/download/" + file.result.name;
                    return url;
                };


                $scope.$watch('model[options.key]', function() {
                    if (!$.isEmptyObject($scope.model[$scope.options.key])) {
                        var modelData = $scope.model[$scope.options.key];
                        if ($.isEmptyObject($scope.file)) {
                            //Just add the data..
                            $scope.file = $scope.file || {};
                            $scope.file.result = modelData;
                        } else {
                            if ($scope.file.result) {
                                if ($scope.file.result.name !== modelData.name) {
                                    $scope.file = {};
                                    $scope.file.result = modelData;
                                }
                            } else {
                                $scope.file = $scope.file || {};
                                $scope.file.result = modelData;
                            }
                        }
                    } else {
                        //Clean files data too..
                        $scope.file = {};
                    }
                }); //$watch



                $scope.uploadFiles = function($files, $file, $newFiles, $duplicateFiles, $invalidFiles, $event) {
                    if ($newFiles === null) {
                        return false;
                    }

                    //Increment tracker..TODO CHECK HERE FOR ERROR POSIBILITY.
                    ImageUploadingTracker.incrementTracker();

                    //First initialize progress bar to zero..
                    $scope.addValue(0);
                    var file = $newFiles[0];
                    $scope.file = file;
                    var errFiles = $invalidFiles;
                    $scope.errFile = errFiles && errFiles[0];
                    //Only upload file if it is not a duplicate file..
                    if (file && $duplicateFiles.length === 0 && errFiles.length === 0) {
                        file.upload = Upload.upload({
                            url: uploadUrl,
                            data: {
                                file: file,
                                container: $scope.options.templateOptions.containerName
                            }
                        });

                        file.upload.then(function(response) {

                            $timeout(function() {
                                //file.result = response.data.result.files.file[0];
                                //console.log(response.result);
                                file.result = response.data;


                                if ($scope.model[$scope.options.key] === undefined) {
                                    $scope.model[$scope.options.key] = {};
                                }
                                //Adding data to the model.
                                $scope.model[$scope.options.key] = file.result;
                            });
                            //decrement the tracker..
                            ImageUploadingTracker.decrementTracker();
                            SnaphyTemplate.notify({
                                message: "File successfully saved to server.",
                                type: 'success',
                                icon: 'fa fa-check',
                                align: 'right'
                            });
                        }, function(response) {
                            //decrement the tracker..
                            ImageUploadingTracker.decrementTracker();
                            if (response.status > 0) {
                                SnaphyTemplate.notify({
                                    message: "Error saving file to server. Please remove the file and try again.",
                                    type: 'danger',
                                    icon: 'fa fa-times',
                                    align: 'right'
                                });
                                $scope.errorMsg = response.status + ': ' + response.data;
                            }

                        }, function(evt) {
                            $timeout(function() {
                                file.progress = Math.min(100, parseInt(100.0 *
                                    evt.loaded / evt.total));
                                $scope.addValue(file.progress);
                            }, 10);
                        });
                    }else{
                        ImageUploadingTracker.decrementTracker();
                    }
                };

                //Delete the given image...
                $scope.deleteImage = function(file) {
                    var backUpFile = angular.copy(file);
                    if (backUpFile.result) {
                        var fileName = backUpFile.result.name;
                        var containerName = $scope.options.templateOptions.containerName;
                        //var filePath = '/api/containers/' + containerName + '/files/' + fileName;
                        //Now remove the file
                        file = {};
                        $scope.model[$scope.options.key] = {};
                        //console.log(backUpFile);
                        // Simple DELETE request example:
                        //console.log(filePath);

                        if (dbService) {
                            dbService.removeFile({
                                container: containerName,
                                file: fileName
                            }, function() {
                                //console.log("file successfully deleted");
                                SnaphyTemplate.notify({
                                    message: "File successfully deleted from server.",
                                    type: 'success',
                                    icon: 'fa fa-check',
                                    align: 'right'
                                });
                            }, function() {
                                //console.error("error deleting file.");
                                //console.error(err);
                                $timeout(function() {
                                    //Add backup file ..
                                    $scope.file = backUpFile;
                                    $scope.model[$scope.options.key] = backUpFile.result;
                                }, 0);

                                SnaphyTemplate.notify({
                                    message: "Error deleting file from server. Please try again.",
                                    type: 'danger',
                                    icon: 'fa fa-times',
                                    align: 'right'
                                });
                            });
                        } else {
                            $http({
                                method: 'DELETE',
                                url: url.delete,
                            }).then(function successCallback() {
                                // console.log("File successfully deleted.");
                                SnaphyTemplate.notify({
                                    message: "File successfully deleted from server.",
                                    type: 'success',
                                    icon: 'fa fa-check',
                                    align: 'right'
                                });
                            }, function errorCallback(response) {
                                //console.log(response);
                                //Add backup file ..
                                $scope.file = backUpFile;
                                SnaphyTemplate.notify({
                                    message: "Error deleting File from server. Please try again.",
                                    type: 'danger',
                                    icon: 'fa fa-times',
                                    align: 'right'
                                });
                            });
                        }

                    } else {
                        //simply remove the file
                        $scope.files = {};
                        $scope.model[$scope.options.key] = {};
                    }
                };

            }
        ]
    });


    //Date template..
    formlyConfig.setType({
        name: 'date',
        templateUrl:'/formlyTemplate/views/date.html',
        link: function(scope, elem, attrs){
            var getRandom = function(){
                return Math.floor((Math.random()*6)+1);
            };

            scope.to.format = scope.to.format || "mm/dd/yyyy";
            scope.to.id = scope.to.id || "date_" + getRandom();
            scope.to.placeholder = scope.to.placeholder || "Enter date";

        }
    });

}]);
