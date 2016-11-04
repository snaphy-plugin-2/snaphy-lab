# robustAutomata plugin for Snaphy


###Plugin for allowing server side processing of datatable making it more robust

###This plugin is exposed on  `/robustAutomata` route



######NOTE: With relation of `HasOne` on model definition some hack need to be applied to let backend let search for related data. As `inq` operator of loopback only search for ObjectId type in case of foreign key converted to string form. Convert String Id --> ObjectId.


#######Example: 


```
var ObjectID = require('mongodb').ObjectID;
module.exports = function(Post) {
	Post.observe("before save", function(ctx, next){
		var instance;
    	if(ctx.instance){
    		instance = ctx.instance;
    	}else if (ctx.data) {
    		instance = ctx.data;
    	}else{

    	}
    	//Add objects..
    	if(instance.postDetailId){
    		instance.postDetailId = ObjectID(instance.postDetailId);
    	}
    	next();
	});
};

```  



####Written by Robins Gupta

