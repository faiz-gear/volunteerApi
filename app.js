//1.导入express模块
const express = require('express')
//2.创建服务器实例
const app = express();

// 导入并注册cors中间件解决跨域
const cors = require('cors')
app.use(cors())

// 导入并注册解析表单数据中间件
app.use(express.urlencoded({
  extended: false
}))
// 导入并注册解析json数据中间件
app.use(express.json())

// 导入配置文件
const config = require('./config/config')

// 导入并注册解析jwt字符串的中间件
const expressJWT = require('express-jwt')
app.use(expressJWT({
  secret: config.secretKey
}).unless({
  path: [/^\/api\//, /^\/uploads\//]
}))

// 静态托管上传的文件资源
app.use('/uploads', express.static('uploads'))

// 自定义中间件，封装res.cc函数
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    return res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next();
})

// 导入登录注册路由模块
const registerRouter = require('./router/user');
app.use(registerRouter)
// 导入志愿者信息管理路由模块
const volunteerMsgRouter = require('./router/volunteerMessage')
app.use(volunteerMsgRouter)
// 导入策划文件路由模块
const filePlanRouter = require('./router/filePlan')
app.use(filePlanRouter)

const {
  ValidationError
} = require('@hapi/joi');
// 定义错误级别中间件
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) return res.send(err.message)
  if (err.name == 'UnauthorizedError') {
    console.log(err);
    return res.send({
      status: 401,
      message: '无效的token'
    })
  }
  next();
})

//3.启动服务器
app.listen(80, () => {
  console.log('server running at http://127.0.0.1')
})