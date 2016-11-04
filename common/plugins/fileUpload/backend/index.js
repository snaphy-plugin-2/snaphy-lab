(function() {
    'use strict';
})();
module.exports = function(server, databaseObj, helper, packageObj) {

    //load Admin plugins
    var login = helper.loadPlugin('login');
    var qt = require('quickthumb');
    var path = require('path');
    var fs = require('fs');
    var Promise = require("bluebird");
    var AmazonImage = require('./amazonS3');

    /**
     * Here server is the main app object
     * databaseObj is the mapped database from the package.json file
     * helper object contains all the helpers methods.
     * packageObj contains the packageObj file of your plugin.
     */

    /**
     * Initialize the plugin at time of server start.
     * init method should never have any argument
     * It is a constructor and is populated once the server starts.
     * @return {[type]} [description]
     */
    var init = function() {
        createStorageIfNotPresent(server);

        modifyImageName();
        removeImageOnDelete();
        //Initialize amazon Image library..
        AmazonImage.init(server, databaseObj, helper, packageObj);
    };



//Create storage folder if not present..
var createStorageIfNotPresent = function(app) {
    packageObj.config.forEach(function(config) {

        var FileDataSource = config.fileDataSource;
        var settings = app.dataSources[FileDataSource].settings;
        if (settings.provider === 'filesystem') {
            var rootFolder = settings.root;
            //Temp path directory..create if directory not present.
            if (!fs.existsSync(rootFolder)) {
                fs.mkdirSync(rootFolder);
                console.log("Storage folder created successfully.");
            }

        }

        //Now create some container on Initialize..
        var containersList = config.createInitContainer;
        var dataSource = app.models[config.containerModel];
        if (config.createInitContainer) {
            containersList.forEach(function(containerName) {
                //check if the container exists..
                createContainer(app, containerName, config);
            });
        }
    });
};


var createContainer = function(app, containerName, config) {
    var FileDataSource = config.fileDataSource;
    var containerDb = app.dataSources[FileDataSource];
    //Creating container for the given customer..
    containerDb.DataAccessObject.createContainer({
        name: containerName
    }, function(err, containerObj) {
        if (err) {
            console.error("Cannot create container. Error or Container already present.");
            return false;
        }
        console.log("Container successfully created");
    });
};



var modifyImageName = function() {
    var app = server;
    packageObj.config.forEach(function(config){
        getFilename (app, config);
    });
};




var getFilename = function(app, config) {
    var FileDataSource = config.fileDataSource;
    //Function for checking the file type..
    app.dataSources[FileDataSource].connector.getFilename = function(file, req, res) {
        //First checking the file type..
        var pattern = /^image\/.+$/;
        var value = pattern.test(file.type);
        if (value) {
            setFileName(file);
        } else {
            res.status(403).send("FileTypeError: Only File of Image type is supported right.");
            return false;
        }
    };
}


function setFileName(file){
    var fileExtension = file.name.split('.').pop();
    //var container = file.container;
    var time = new Date().getTime();
    //var query = req.query;
    var userId = req.accessToken.userId;
    var UUID = guid();
    //Now preparing the file name..
    //customerId_time_orderId.extension
    var NewFileName = '' + userId + '_' + time + '_' + UUID + '.' + fileExtension;

    //And the file name will be saved as defined..
    return NewFileName;
}


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}




var removeImageOnDelete = function() {
    var models = server.models();
    packageObj.config.forEach(function(config){
        models.forEach(function(Model) {
            //refer to https://apidocs.strongloop.com/loopback/#app-models
            onDeleteHook(server, Model.modelName, config);
        });
    });
};


var onDeleteHook = function(app, modelName, config) {
    var modelObj = app.models[modelName];
    var modelProperties = modelObj.definition.rawProperties;
    //Add some event listener..

    //Run a loop of the modelProperties..
    for (var property in modelProperties) {
        if (modelProperties.hasOwnProperty(property)) {
            var type = modelProperties[property].type;
            if (type === "object" || arraysEqual(type, ["object"])) {
                if (modelProperties[property].template) {
                    var template = modelProperties[property].template;
                    if (template.templateOptions) {
                        if (template.templateOptions.bind) {
                            console.log("Binded to hook for delete " + modelName);
                            //Add hook..
                            addOnDeleleteHook(app, modelObj, property, type, packageObj, config);

                        }
                        //Now if image is set to delete on update..or an image..
                        if (template.templateOptions.onImageUpdate) {
                            if (template.templateOptions.onImageUpdate.deletePrevious) {
                                //Binding image delete hook on update..
                                console.log("Binding image hook to delete on update..");
                                deleteOnUpdate(app, modelObj, property, type, packageObj, config);
                            }
                        }
                    }
                }
            }
        }
    }
};




//delete previous image on update of new image..
var deleteOnUpdate = function(app, modelObj, propertyName, type, packageObj, config) {
    modelObj.observe("persist", function(ctx, next) {
        var modelProperties = modelObj.definition.rawProperties;
        var containerModel = modelProperties[propertyName].template.templateOptions.containerModel;
        var containerDb = app.models[containerModel];
        if (!ctx.isNewInstance) {
            //First fetch the previous data..
            if (ctx.currentInstance) {
                //find model based on id..
                modelObj.find({
                    where: {
                        id: ctx.currentInstance.id
                    }
                }, function(err, data) {
                    if (err) {
                        console.error("Error finding model when delete image on update.");
                        //next();
                    } else {
                        if (data.length) {
                            for (var j = 0; j < data.length; j++) {
                                var object = data[j];
                                var ImageArrOrObj = object[propertyName];
                                if (ImageArrOrObj) {
                                    var fileName;
                                    var containerName;
                                    if (type === "object") {
                                        //first check if the image is updated or not updated..
                                        fileName = ImageArrOrObj.name;
                                        containerName = ImageArrOrObj.container;
                                        if (ctx.currentInstance[propertyName].name !== fileName) {
                                            //remove the file..
                                            destroyImage(containerDb, fileName, containerName, config);
                                            //next();
                                        } else {
                                            //Do nothing..

                                        }
                                    } else if (arraysEqual(type, ["object"])) {
                                        for (var i = 0; i < ImageArrOrObj.length; i++) {
                                            var ImageDetails = ImageArrOrObj[i];
                                            fileName = ImageDetails.name;
                                            if(!fileName){
                                                containerName = ImageDetails.container;
                                                var currentImagePropertyDataArray = ctx.currentInstance[propertyName];
                                                if(!currentImagePropertyDataArray){
                                                    var found = false;
                                                    //now check if the old image is present in the new one..
                                                    for(var j=0; j< currentImagePropertyDataArray.length; j++){
                                                        var currentImagePropertyDataName = currentImagePropertyDataArray[j];
                                                        if(!currentImagePropertyDataName){
                                                            if(!currentImagePropertyDataName.name){
                                                                if (currentImagePropertyDataName.name.trim() === fileName.trim()) {
                                                                    found = true;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if(!found){
                                                        console.log("Removed previous image safely.");
                                                        //remove the file..
                                                        destroyImage(containerDb, fileName, containerName, config);
                                                    }
                                                    
                                                }
                                            }   
                                        }
                                        //next();
                                    }
                                }
                            } //end of for loop..
                            next();
                        } else {
                            next();
                        }
                    }
                });
            } else {
                next();
            }

        } else {
            next();
        }
    });
};



var addOnDeleleteHook = function(app, modelObj, propertyName, type, packageObj, config) {
    return (function(app, modelObj, propertyName, type, packageObj) {
        modelObj.observe("before delete", function(ctx, next) {
            var modelProperties = modelObj.definition.rawProperties;
            var containerModel = modelProperties[propertyName].template.templateOptions.containerModel;
            var containerDb = app.models[containerModel];
            var where = ctx.where;
            modelObj.find({
                where: where
            })
            .then(function(value) {

                if (value) {
                    value.forEach(function(object, index) {
                        //imageValue
                        var ImageArrOrObj = object[propertyName];
                        if (ImageArrOrObj) {
                            if (type === "object") {
                                var fileName = ImageArrOrObj.name;
                                var containerName = ImageArrOrObj.container;
                                //Just delete the object too..
                                destroyImage(containerDb, fileName, containerName);
                            } else if (type === 'array') {
                                ImageArrOrObj.forEach(function(ImageDetails, index) {
                                    var fileName = ImageDetails.name;
                                    var containerName = ImageDetails.container;
                                    //Just delete the object too..
                                    destroyImage(containerDb, fileName, containerName);
                                });
                            } else {
                                // Do nothing
                            }
                        }
                    }); //forEach
                } //if value
                //Move to next middleware
                next();
            })
            .catch(function(err) {
                console.error(err);
                next();
                return false;
            });
        });

    })(app, modelObj, propertyName, type, packageObj);
};


var destroyImage = function(containerDb, file, containerName, config) {
    if (file && containerName) {
        containerDb.removeFile(containerName, file, function(err, value) {
            if (err) {
                console.log(err);
                return false;
            } else {
                console.log("Related image file successfully deleted");
                //also remove the thumb file..
                //since the data is getting delete from backend so beforeRemote will not work here..
                //TODO Add support for revoing thumbnail file too...
                //TODO THUMB FILE STILL NEEDED TO BE REMOVED..
            }
        });
    }
};

//Method for checking if two arrays are equals..
function arraysEqual(a1,a2) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}


//return all the methods that you wish to provide user to extend this plugin.
return {
    init: init,
    getFileName : setFileName
}


} //module.exports
