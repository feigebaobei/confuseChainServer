var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
let tokenSDKServer = require('token-sdk-server')

router.use(bodyParser.json())

/* GET users listing. */
router.route('/')
  .options((req, res) => {
    res.sendStatus(200)
  })
  .get((req, res, next) => {
    res.send('get')
  })
  .post((req, res, next) => {
    res.send('post')
  })
  .put((req, res, next) => {
    res.send('put')
  })
  .delete((req, res, next) => {
    res.send('delete')
  })

router.route('/checkValidity')
  .options((req, res) => {
    res.sendStatus(200)
  })
  .get((req, res, next) => {
    res.send('get')
  })
  .post((req, res, next) => {
    let { temporaryId } = req.body
    // 检查时间有效性
    tokenSDKServer.getTemplate(temporaryId).then(response => {
      // console.log(response)
      let certifyData = response.result.certify_data
      if (certifyData) {
        // 检查次数有效性
        certifyData = JSON.parse(certifyData)
        if (certifyData.times) {
          res.status(200).json({
            result: true,
            message: '',
            data: response.result
          })
        } else {
          return Promise.reject(new Error('不在有效次数内'))
        }
      } else {
        return Promise.reject(new Error('不在有效时间内'))
      }
    }).catch(error => {
      res.status(500).json({
        result: false,
        message: error.message,
        error: error
      })
    })
  })
  .put((req, res, next) => {
    res.send('put')
  })
  .delete((req, res, next) => {
    res.send('delete')
  })


module.exports = router;


