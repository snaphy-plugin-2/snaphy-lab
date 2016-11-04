'use strict';
module.exports = function( server, databaseObj, helper, packageObj) {
	/**
	 * Here server is the main app object
	 * databaseObj is the mapped database from the package.json file
	 * helper object contains all the helpers methods.
	 */

	/**
	 * Initialize the plugin at time of server start.
	 * @return {[type]} [description]
	 */
	var init = function(){

	};


	//return all the methods that you wish to provide user to extend this plugin.
	return {
		init: init
	};
}; //module.exports
