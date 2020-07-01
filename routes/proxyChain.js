// proxyChain.js
// 代理向链节点云服务请求数据
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
let tokenSDKServer = require('token-sdk-server')
let cors = require('./cors')
// var fs = require('fs')

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

router.route('/getTemplate')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.corsWithOptions, (req, res, next) => {
    res.send('get')
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    let { templateId } = req.body
    // console.log('wert', templateId)
    tokenSDKServer.getTemplate(templateId).then(response => {
    // console.log('wert', response.data)
      res.status(200).json({
        result: true,
        message: '',
        data: response.data
      })
    }).catch(error => {
      res.status(500).json({
        result: false,
        message: '',
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

router.route('/getClaim')
  .options(cors.corsWithOptions, (req, res) => {
    console.log('options', )
    res.sendStatus(200)
  })
  .get(cors.corsWithOptions, (req, res, next) => {
    res.send('get')
  })
  .post(cors.corsWithOptions, (req, res, next) => {
    let { claim_sn } = req.body
    console.log('claim_sn', claim_sn)
    tokenSDKServer.getCertifyFingerPrint(claim_sn).then(response => {
    console.log('wert', response.data)
      res.status(200).json({
        result: true,
        message: '',
        data: response.data
      })
    }).catch(error => {
      console.log('error', error)
      res.status(500).json({
        result: false,
        message: '',
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


