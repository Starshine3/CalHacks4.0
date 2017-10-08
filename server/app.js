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
    if (webDetection.webEntities.length) {
        console.log(`Description: ${webDetection.webEntities[0].description}`);
        res.send(webDetection.webEntities[0].description);
      // console.log(`Web entities found: ${webDetection.webEntities.length}`);

      // webDetection.webEntities.forEach((webEntity) => {
      //   console.log(`  Description: ${webEntity.description}`);
      //   console.log(`  Score: ${webEntity.score}`);
      //           console.log(webDetection.webEntities);
      // });
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
    //   vision.landmarkDetection(request)
    //     .then((results) => {
    //       const landmarks = results[0].landmarkAnnotations;
    //       console.log('Landmarks:');
    //       console.log(landmarks);
    //       landmarks.forEach((landmark) => console.log(landmark));
    //       res.send(landmarks);
    //     })
    //     .catch((err) => {
    //       console.error('ERROR:', err);
    //       res.send('failed');
    //     });
});