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

    // Imports the Google Cloud client library
    var gcloud = require('gcloud')({
      keyFilename: 'key.json',
      projectId: 'avian-cogency-182220'
    });
    // Instantiates a client
    var datastore = require('@google-cloud/vision')(config);
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








/*
    Code from https://github.com/thesandlord/samples/blob/master/cloud-vision-nodejs/index.js
    https://medium.com/google-cloud/using-the-google-cloud-vision-api-with-node-js-194e507afbd8
*/

// 'use strict';

// var express = require('express');
// var fs = require('fs');
// var util = require('util');
// var mime = require('mime');
// var multer = require('multer');
// var upload = multer({dest: 'uploads/'});

// // Set up auth
// var gcloud = require('gcloud')({
//   keyFilename: 'key.json',
//   projectId: '<YOUR-PROJECT-ID-HERE>'
// });

// var vision = gcloud.vision();

// var app = express();

// // Simple upload form
// var form = '<!DOCTYPE HTML><html><body>' +
//   "<form method='post' action='/upload' enctype='multipart/form-data'>" +
//   "<input type='file' name='image'/>" +
//   "<input type='submit' /></form>" +
//   '</body></html>';

// app.get('/', function(req, res) {
//   res.writeHead(200, {
//     'Content-Type': 'text/html'
//   });
//   res.end(form);
// });

// // Get the uploaded image
// // Image is uploaded to req.file.path
// app.post('/upload', upload.single('image'), function(req, res, next) {

//   // Choose what the Vision API should detect
//   // Choices are: faces, landmarks, labels, logos, properties, safeSearch, texts
//   var types = ['labels'];

//   // Send the image to the Cloud Vision API
//   vision.detect(req.file.path, types, function(err, detections, apiResponse) {
//     if (err) {
//       res.end('Cloud Vision Error');
//     } else {
//       res.writeHead(200, {
//         'Content-Type': 'text/html'
//       });
//       res.write('<!DOCTYPE HTML><html><body>');

//       // Base64 the image so we can display it on the page
//       res.write('<img width=200 src="' + base64Image(req.file.path) + '"><br>');

//       // Write out the JSON output of the Vision API
//       res.write(JSON.stringify(detections, null, 4));

//       // Delete file (optional)
//       fs.unlinkSync(req.file.path);

//       res.end('</body></html>');
//     }
//   });
// });

// app.listen(8080);
// console.log('Server Started');

// // Turn image into Base64 so we can display it easily

// function base64Image(src) {
//   var data = fs.readFileSync(src).toString('base64');
//   return util.format('data:%s;base64,%s', mime.lookup(src), data);
// }
