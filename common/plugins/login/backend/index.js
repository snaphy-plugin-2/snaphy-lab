'use strict';
module.exports = function(server, databaseObj, helper, packageObj) {
    const Promise = require('bluebird');
    var adminUserModel = packageObj.adminUser,
        User = databaseObj.User,
        Role = server.models.Role,
        RoleMapping = server.models.RoleMapping,
        loopback = helper.getLoopbackObj(),

        //Create an init method to be executed when the plugin get run for the first time..in memory..
        init = function() {
            /**
             * Permission levels
             * ADMIN -> STATIC ROLE DECLARATION.
             * STAFF -> DYNAMIC ROLE DECLARATION.
             */
            //Now adding user to the method..
            User.create(adminUserModel)
                .then(function(err, users) {
                    if (err) throw err;
                    //Now add role..
                    addRole(Role, users);
                })
                .catch(function(err) {
                    console.info("Login throw error while adding role.\n");
                    var where = {};
                    where.or = [];
                    for (var i = 0; i < adminUserModel.length; i++) {
                        var model = adminUserModel[i];
                        where.or.push({
                            email: model.email
                        });
                    }
                    User.find({
                        where: where
                    }, function(err, users) {
                        if(!err){
                            if (users.length) {
                                //Now add role..
                                addRole(Role, users);
                            }
                        }

                    });
                });

            //TODO MODIFY THIS METHOD TO PROVIDE RUNTIME ACCESS AND MODIFICATION TO USER.
            addStaffResolver();
            hideRestMethods();

            User.isAdmin = function(cb) {
                var currentContext = loopback.getCurrentContext();
                var app = this.app;
                isAdmin(app, currentContext, cb);
            };



            //Now defigning a method for checking if the user exist in the role.
            User.remoteMethod(
                'isAdmin', {
                    returns: {
                        arg: 'isAdmin',
                        type: 'boolean'
                    }
                }
            );

        }, //Init..


        addRole = function(Role, users){
            var i;
            //create the admin role
            Role.create({
                name: 'admin'
            }, function(err, role) {
                if (err){
                    //role already exists..
                    Role.find({
                        name: "admin"
                    }, function(err, roleList){
                        if(roleList){
                            if(roleList.length){
                                const role = roleList[0];
                                for (i = 0; i < users.length; i++) {
                                    //Making this user an admin.
                                    addUserAdmin(role, users[i].id);
                                } //for loop..
                            }
                        }

                    });
                }else{
                    for (i = 0; i < users.length; i++) {
                        //Making this user an admin.
                        addUserAdmin(role, users[i].id);
                    } //for loop..
                }

            });
        },


        isAdmin = function(app, currentContext, cb) {
            Role = app.models.Role;
            RoleMapping = app.models.RoleMapping;
            //bad documentation loopback..
            //http://stackoverflow.com/questions/28194961/is-it-possible-to-get-the-current-user-s-roles-accessible-in-a-remote-method-in
            //https://github.com/strongloop/loopback/issues/332
            var context;

            try {
                context = {
                    principalType: RoleMapping.USER,
                    principalId: currentContext.active.accessToken.userId
                };
            } catch (err) {
                console.error("Error >> User not logged in. ");
                context = {
                    principalType: RoleMapping.USER,
                    principalId: null
                };
            }

            //console.log(context);

            //Now check the role if the context is admin.
            Role.isInRole('admin', context, function(err, InRole) {
                if (err) {
                    return cb(err);
                }
                var result = InRole;
                //console.log(result);
                //Now return the boolean value..
                cb(null, result);
            });
        },


        //Internal method for checking if current user in a role with the given loopback..
        //Method to be useful fot plugins..
        verifyRole = function(role, callback) {
            Role = server.models.Role;
            RoleMapping = server.models.RoleMapping;
            var currentContext = loopback.getCurrentContext();
            var app = server;
            isInRole(app, role, currentContext, callback);
        },


        //Check if a particular user is in role..
        isInRole = function(app, role, currentContext, cb) {
            Role = app.models.Role;
            RoleMapping = app.models.RoleMapping;
            //bad documentation loopback..
            //http://stackoverflow.com/questions/28194961/is-it-possible-to-get-the-current-user-s-roles-accessible-in-a-remote-method-in
            //https://github.com/strongloop/loopback/issues/332
            var context;

            try {
                context = {
                    principalType: RoleMapping.USER,
                    principalId: currentContext.active.accessToken.userId
                };
            } catch (err) {
                console.error("Error >> User not logged in. ");
                context = {
                    principalType: RoleMapping.USER,
                    principalId: null
                };
            }

            //console.log(context);

            //Now check the role if the context is admin.
            Role.isInRole(role, context, function(err, InRole) {
                if (err) {
                    return cb(err);
                }
                var result = InRole;
                //console.log(result);
                //Now return the boolean value..
                cb(null, result);
            });
        },




        //TODO ADD GUEST AND CUSTOMER ROLE RESOLVER AND PROVIDE IT FOR CUSTOMER.
        //Method for resolving staff role by user..
        addStaffResolver = function() {
            //Now registering an dynamic role for the user..
            //All user of the employee model  belong to the staff role.
            /**
             * Default User  ACLs.
             DENY EVERYONE *
             ALLOW admin create
             ALLOW OWNER deleteById
             ALLOW EVERYONE login
             ALLOW EVERYONE logout
             ALLOW staff findById
             ALLOW OWNER updateAttributes

             */

             
             //If a users is logged by Employee account the he is a staff.
            Role.registerResolver('staff', function(role, context, cb) {
                
                function reject(err) {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, false);
                }

                function accept() {
                    cb(null, true);
                }

                var userId = context.accessToken.userId;
                if (!userId) {
                    return reject(); // do not allow anonymous users
                }


                //Now check if the logged in user is an Employee
                User.exists(userId, function(err, exists){
                    if(err){
                        console.log('Error occured in finding user for role of Staff.');
                        console.log(err);
                        return reject(err);
                    }else{
                        if(exists){
                            //Accept the staff role..
                            return accept();
                        }else{
                            return reject();
                        }
                    }
                });
            });




            //Register a role for adding an role shareFriends for finding if the current user is the shared friends user..
            Role.registerResolver('shareFriends', function(role, context, cb) {
                
                function reject(err) {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, false);
                }

                function accept() {
                    cb(null, true);
                }

                var userId = context.accessToken.userId;
                if (!userId) {
                    return reject(); // do not allow anonymous users
                }


                if(!context.modelId){
                    return reject(); 
                }

                //Now find if the current  track model..has share number belonging to the login user..phone number.. 
                context.model.findById(context.modelId, function(err, trackModel){
                    // A: The datastore produced an error! Pass error to callback
                    if(err) return reject(err)
                    if(!trackModel){
                        return reject();
                    }


                    if(trackModel.type === "event"){
                        if(trackModel.isPublic === "public"){
                            //Accept for public events..
                            return accept();
                        }
                    }

                    //Now check if the login customer is in sharing list....
                    var Customer = server.models.Customer;

                    Customer.findById(userId, function(err, customerModel){
                        // A: The datastore produced an error! Pass error to callback
                        if(err) return reject(err)
                        if(!customerModel){
                            return reject();
                        }

                        var phoneNumber = customerModel.phoneNumber;
                        if(!phoneNumber){
                            return reject();
                        }

                        //Now check..
                        var shareFriendsList = trackModel.friends;
                        if(!shareFriendsList){
                            return reject();
                        }

                        if(!shareFriendsList.length){
                            return reject();
                        }


                        for(var i=0; i< shareFriendsList.length; i++){
                            var numberObj = shareFriendsList[i];
                            
                            if(numberObj.number === phoneNumber){
                                //console.log("Accepted.");
                                return accept();
                            }
                        }

                        //console.info('Rejecting shareFriends role.', context.modelId);

                        //At last ..reject..
                        return reject();

                    }); //findById Customer
                }); //FindById Track Model

                
            }); //registerResolver.. 

        },




        /**
         * Method for adding static admin role to an user
         * @param adminRoleInstance
         * @param userInstanceId
         */
        addUserAdmin = function(adminRoleInstance, userInstanceId) {
            //make users an admin
            adminRoleInstance.principals.create({
                principalType: RoleMapping.USER,
                principalId: userInstanceId
            }, function(err, principal) {
                if (err) {
                    console.error('Got error while creating static admin role.',  console.error(err));
                }else{
                    console.info("Static role created successfully.");
                }
            });
        },





        //TODO MODIFY THIS METHOD TO CHANGE IT FROM THIS FUNCTION DYNAMICALLY
        hideRestMethods = function() {
            //Hiding all the rest endpoints except login/logout/create

            //User.disableRemoteMethod("create", true);
            //User.disableRemoteMethod("upsert", true);
            //User.disableRemoteMethod("updateAll", true);
            //User.disableRemoteMethod("updateAttributes", false);

            //User.disableRemoteMethod("find", true);
            //User.disableRemoteMethod("findById", true);
            //User.disableRemoteMethod("findOne", true);

            //User.disableRemoteMethod("deleteById", true);

            //User.disableRemoteMethod("confirm", true);
            //User.disableRemoteMethod("count", true);
            //User.disableRemoteMethod("exists", true);
            //User.disableRemoteMethod("resetPassword", true);

            //User.disableRemoteMethod('__count__accessTokens', false);
            //User.disableRemoteMethod('__create__accessTokens', false);
            //User.disableRemoteMethod('__delete__accessTokens', false);
            //User.disableRemoteMethod('__destroyById__accessTokens', false);
            //User.disableRemoteMethod('__findById__accessTokens', false);
            //User.disableRemoteMethod('__get__accessTokens', false);
            //User.disableRemoteMethod('__updateById__accessTokens', false);
        };


    //Now return the methods that you want other plugins to use
    return {
        init: init,
        hideRestMethods: hideRestMethods,
        addUserAdmin: addUserAdmin,
        isAdmin: isAdmin,
        verifyRole: verifyRole
    };



};
