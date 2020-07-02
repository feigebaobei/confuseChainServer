var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
let tokenSDKServer = require('token-sdk-server')
let cors = require('./cors')
var fs = require('fs')

router.use(bodyParser.json())

/* GET users listing. */
router.route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.corsWithOptions, (req, res, next) => {
    res.send('get')
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    res.send('post')
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    res.send('put')
  })
  .delete(cors.corsWithOptions, (req, res, next) => {
    res.send('delete')
  })

router.route('/getTemporaryCertifyData')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.corsWithOptions, (req, res, next) => {
    res.send('get')
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    let { temporaryId } = req.body
    // console.log('temporaryId', temporaryId)
    // 请求临时数据
    tokenSDKServer.getTemporaryCertifyData(temporaryId).then(response => {
      let certifyData = response.data.result.certify_data
    // 判断数据有效性
      if (certifyData) {
        certifyData = JSON.parse(certifyData)
        let now = new Date().getTime()
    // 检查时间有效性
        if (Number(certifyData.expirationDate) > now) {
    // 检查次数有效性
          let checkValidity = fs.readFileSync('tempData/checkValidity.json')
          checkValidity = JSON.parse(checkValidity.toString())
          // console.log('12345t', checkValidity)
          if (checkValidity[temporaryId] === undefined) {
            checkValidity[temporaryId] = Number(certifyData.availableTimes)
            fs.writeFileSync('tempData/checkValidity.json', JSON.stringify(checkValidity))
            return response.data.result
          } else {
            if (checkValidity[temporaryId] > 1) {
              // checkValidity[temporaryId]--
              // fs.writeFileSync('tempData/checkValidity.json', JSON.stringify(checkValidity))
              return response.data.result
            } else {
              // return Promise.reject(new Error('不在有效次数内'))
              res.status(200).json({
                result: false,
                message: '不在有效次数内',
                data: ''
              })
            }
          }
        } else {
          // return Promise.reject(new Error('不在有效时间内'))
          res.status(200).json({
            result: false,
            message: '不在有效时间内',
            data: ''
          })
        }
      } else {
        // return Promise.reject(new Error('没有相应证书副本数据'))
        res.status(200).json({
          result: false,
          message: '没有相应证书副本数据',
          data: ''
        })
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

router.route('/checkValidity')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.corsWithOptions, (req, res, next) => {
    res.send('get')
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    // res.send('post')
    let { temporaryId } = req.body
    let checkValidity = fs.readFileSync('tempData/checkValidity.json')
    checkValidity = JSON.parse(checkValidity.toString())
    // console.log('12345t', checkValidity)
    if (checkValidity[temporaryId] > 1) {
      checkValidity[temporaryId]--
      fs.writeFileSync('tempData/checkValidity.json', JSON.stringify(checkValidity))
    }
    res.status(200).json({
      result: true,
      message: '',
      data: ''
    })
  })
  .put(cors.corsWithOptions, (req, res, next) => {
    res.send('put')
  })
  .delete(cors.corsWithOptions, (req, res, next) => {
    res.send('delete')
  })

module.exports = router;


