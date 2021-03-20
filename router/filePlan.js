const express = require('express');
const router = express();
// 导入multer中间件解析formdata格式的数据
const multer = require('multer');
// 导入path路径模块
const path = require('path')
// 生成multer实例
const upload = multer({dest: path.join(__dirname, '../uploads')})

const expressJoi = require('@escook/express-joi')
const {getFilePlan_schema, downloadFilePlan_schema, removeFilePlan_schema} = require('../schema/filePlan_schema')

const filePlan_handler = require('../router_handler/filePlan_handler')

// 添加策划文件路由
router.post('/addfileplan', upload.single('address'),  filePlan_handler.addFilePlan);
// 获取策划文件列表路由
router.get('/getfileplan', expressJoi(getFilePlan_schema), filePlan_handler.getFilePlan);
// 添加文件下载功能
router.get('/downloadfileplan', expressJoi(downloadFilePlan_schema), filePlan_handler.downloadFilePlan )
// 添加删除文件功能
router.delete('/removefileplan', expressJoi(removeFilePlan_schema), filePlan_handler.removeFilePlan)

module.exports = router