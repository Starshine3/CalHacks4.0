    var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    app.use(bodyParser.json());  

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });

    app.listen('3000', function(){
        console.log('running on 3000...');
    });

    var cloud = require('../cloud/cloud.js');

    // Imports the Google Cloud client library
    var gcloud = require('gcloud')({
      keyFilename: 'key.json',
      projectId: 'avian-cogency-182220'
    });
    // Instantiates a client
    var vision = gcloud.vision();

    // var image = 'image.jpg';

    // vision.detectText('image.jpg', function(err, text, apiResponse) {
    //   // text = ['This was text found in the image']
    // });

    // // Imports the Google Cloud client library
    // const Vision = require('@google-cloud/vision');

    // // Instantiates a client
    // const vision = Vision();

    // The name of the image file to annotate
    const fileName = '../server/uploads/file-1507389742407.jpg';

    // Prepare the request object
    const request = {
      source: {
        filename: fileName
      }
    };

    // Performs label detection on the image file
    vision.labelDetection(request)
      .then((results) => {
        const labels = results[0].labelAnnotations;

        console.log('Labels:');
        labels.forEach((label) => console.log(label.description));
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });


    // Performs landmark detection on the local file
    vision.landmarkDetection({ source: {filename: fileName} })
      .then((results) => {
        const landmarks = results[0].landmarkAnnotations;
        console.log('Landmarks:');
        landmarks.forEach((landmark) => console.log(landmark));
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });
