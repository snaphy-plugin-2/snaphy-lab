# fileUpload plugin for Snaphy


###A light weight plugin for uploading files based on ng-file-upload

###This plugin is exposed on  `/fileUpload` route

####Note: For each config object in the plugin package the property of `containerModel` should not repeat. Also install `imageMagick` on server before deploying for generating thumbnail.

```
$sudo apt-get install imageMagick

```

###Example:
```
	"config": [
    {
      "fileModel": "AmazonImage",
      "containerModel": "container",
      "fileDataSource": "Image",
      "defaultContainer": "orthopg",
      "createInitContainer": [
        "orthopg"
      ],
      "fileProp": [
        {
          "mimeType": "image",
          "size": 102400,
          "bind": true,
          "thumbPrefix": {
            "thumb": {
              "height": "122px",
              "width": "200px"
            }
          }
        },
        {
          "mimeType": "pdf",
          "size": 302400,
          "bind": true
        }
      ]
    }
  ]
```


1. `fileModel` contains the persistent model name which will store the details of the file stored 
2. `containerModel` Loppback file upload type model
3. `fileDataSource` Loopback datasource of defining the settings of file upload. defined at path `server/datasources.json`
4. `defaultContainer` Amazon| Loopback container or folder where all file will be stored.
5. `createInitContainer` Create all container on application start if container not already present.
6. `fileProp` Definition of different mime type of file which is going to be stored here..


####Written by Robins Gupta

