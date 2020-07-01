var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
let tokenSDKServer = require('token-sdk-server')
let cors = require('./cors')
var fs = require('fs')

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
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.corsWithOptions, (req, res, next) => {
    res.send('get')
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    let { temporaryId } = req.body
    // console.log('temporaryId', temporaryId)
    // 检查时间有效性
    tokenSDKServer.getTemporaryCertifyData(temporaryId).then(response => {
      let certifyData = response.data.result.certify_data
      // 判断数据有效性
      if (certifyData) {
        certifyData = JSON.parse(certifyData)
        let now = new Date().getTime()
        // 判断时间有效性
        if (Number(certifyData.expirationDate) > now) {
          // 检查次数有效性
          let checkValidity = fs.readFileSync('data/checkValidity.json')
          checkValidity = JSON.parse(checkValidity.toString())
          if (checkValidity[temporaryId] === undefined) {
            checkValidity[temporaryId] = Number(certifyData.availableTimes)
            fs.writeFileSync('data/checkValidity.json', JSON.stringify(certifyData))
            return response.data.result
          } else {
            if (checkValidity[temporaryId] > 1) {
              checkValidity[temporaryId]--
              return response.data.result
            } else {
              return Promise.reject(new Error('不在有效次数内'))
            }
          }
        } else {
          return Promise.reject(new Error('不在有效时间内'))
        }
      } else {
        return Promise.reject(new Error('没有相应证书副本数据'))
      }
    }).then(response => {
      res.status(200).json({
        result: true,
        message: '',
        data: response
      })
    }).catch(error => {
      res.status(500).json({
        result: false,
        message: error.message,
        error: error
      })
    })
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    res.send('put')
  })
  .delete(cors.corsWithOptions, (req, res, next) => {
    res.send('delete')
  })


module.exports = router;


