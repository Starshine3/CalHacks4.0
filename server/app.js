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

    app.get('/test', function(req, res){
      console.log('fifdhifdhif');
      res.send('user ');
    });

    app.get('/detectLandmarks/:filename', function (req, res) {
      console.log('hellow world');
      const Vision = require('@google-cloud/vision');
      const vision = Vision();

              // The name of the image file to annotate
    const fileName = './uploads/sphix.jpg';

        // Prepare the request object
        const request = {
          source: {
            filename: fileName
          }
        };
vision.webDetection(request)
  .then((results) => {
    const webDetection = results[0].webDetection;
    if (webDetection.fullMatchingImages.length) {
      console.log(`Full matches found: ${webDetection.fullMatchingImages.length}`);
      webDetection.fullMatchingImages.forEach((image) => {
        console.log(`  URL: ${image.url}`);
        console.log(`  Score: ${image.score}`);
            console.log(fullMatchingImages);
                res.send(fullMatchingImages);
      });
    }

    if (webDetection.partialMatchingImages.length) {
      console.log(`Partial matches found: ${webDetection.partialMatchingImages.length}`);
      webDetection.partialMatchingImages.forEach((image) => {
        console.log(`  URL: ${image.url}`);
        console.log(`  Score: ${image.score}`);
                    console.log(partialMatchingImages);
                res.send(partialMatchingImages);
      });
    }

    if (webDetection.webEntities.length) {
      console.log(`Web entities found: ${webDetection.webEntities.length}`);
      webDetection.webEntities.forEach((webEntity) => {
        console.log(`  Description: ${webEntity.description}`);
        console.log(`  Score: ${webEntity.score}`);
                res.send('dsdsd');
      });
    }
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
// vision.labelDetection(request)
//   .then((results) => {
//     const labels = results[0].labelAnnotations;
//     console.log('Labels:');
//     console.log(labels);
//     labels.forEach((label) => console.log(label));
//     res.send(labels);
//   })
//   .catch((err) => {
//     console.error('ERROR:', err);
//     res.send('failed');
//   });

      // Performs landmark detection on the local file
      vision.landmarkDetection(request)
        .then((results) => {
          const landmarks = results[0].landmarkAnnotations;
          console.log('Landmarks:');
          console.log(landmarks);
          landmarks.forEach((landmark) => console.log(landmark));
          res.send(landmarks);
        })
        .catch((err) => {
          console.error('ERROR:', err);
          res.send('failed');
        });
      // [END vision_landmark_detection]
    });

    // // Imports the Google Cloud client library
    // var gcloud = require('gcloud')({
    //   keyFilename: 'key.json',
    //   projectId: 'avian-cogency-182220'
    // });
    // // Instantiates a client
    // var vision = gcloud.vision();

    // // var image = 'image.jpg';

    // // vision.detectText('image.jpg', function(err, text, apiResponse) {
    // //   // text = ['This was text found in the image']
    // // });

    // // // Imports the Google Cloud client library
    // // const Vision = require('@google-cloud/vision');

    // // // Instantiates a client
    // // const vision = Vision();

    // // The name of the image file to annotate
    // const fileName = '../server/uploads/file-1507389742407.jpg';

    // // Prepare the request object
    // const request = {
    //   source: {
    //     filename: fileName
    //   }
    // };

    // // Performs label detection on the image file
    // vision.labelDetection(request)
    //   .then((results) => {
    //     const labels = results[0].labelAnnotations;

    //     console.log('Labels:');
    //     labels.forEach((label) => console.log(label.description));
    //   })
    //   .catch((err) => {
    //     console.error('ERROR:', err);
    //   });


    // // Performs landmark detection on the local file
    // vision.landmarkDetection({ source: {filename: fileName} })
    //   .then((results) => {
    //     const landmarks = results[0].landmarkAnnotations;
    //     console.log('Landmarks:');
    //     landmarks.forEach((landmark) => console.log(landmark));
    //   })
    //   .catch((err) => {
    //     console.error('ERROR:', err);
    //   });
