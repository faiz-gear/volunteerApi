const express = require('express')
const router = express.Router();
const expressJoi = require('@escook/express-joi')

// 导入路由处理函数模块
const volunteerMsg_handler = require('../router_handler/volunteerMessage_handler')
// 导入表单数据校验模块
const {volunteerMsg_schema, addVolunteer_schema, updateVolunteer_schema, deleteVolunteer_schema} = require('../schema/volunteerMsg_schema')

// 分页获取所有志愿者信息路由
router.get('/getvolunteermsg', expressJoi(volunteerMsg_schema), volunteerMsg_handler.getVolunteerMsg);
// 增加志愿者
router.post('/addvolunteer', expressJoi(addVolunteer_schema), volunteerMsg_handler.addVolunteer);
// 更新志愿者信息
router.post('/updatevolunteer', expressJoi(updateVolunteer_schema), volunteerMsg_handler.updateVolunteer);
// 标记删除志愿者信息
router.post('/deletevolunteer', expressJoi(deleteVolunteer_schema), volunteerMsg_handler.deleteVolunteer)

// 向外共享志愿者管理模块
module.exports = router;