const express = require('express')
const router = express.Router();

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

// 导入验证规则
const {login_schema, register_schema} = require('../schema/user_schema')
// 导入登录路由处理函数
const userHandler = require('../router_handler/user_handler');

router.post('/api/register', expressJoi(register_schema), userHandler.register_handler)
router.post('/api/login', expressJoi(login_schema), userHandler.login_handler)
router.get('/getuserinfo', userHandler.getUserInfo)

module.exports = router
