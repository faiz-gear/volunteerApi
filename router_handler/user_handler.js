// 导入数据库连接对象
const db = require('../config/db')
// 导入bcrypt
const bcrypt = require('bcryptjs')
// 导入jsonwebtoken生成jwt字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config/config')

// 注册路由处理函数
module.exports.register_handler = (req, res) => {
    // 数据校验通过，判断用户名是否已注册
    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, req.body.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 1) return res.cc('用户名已注册，请更换后重试!')
        // 用户名未被注册, 对密码进行bcrypt加密，将用户插入数据库
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        const sqlStr = 'insert into users set username=?, password=?'
        db.query(sqlStr, [req.body.username, req.body.password], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('注册失败，请稍后重试！')
            res.cc('注册成功!', 0)
        })
    })
}

// 登录路由处理函数
module.exports.login_handler = (req, res) => {
    // 检验表单数据有效性后检验是否存在该用户
    const sqlStr = 'select * from users where username=?'
    db.query(sqlStr, req.body.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('未查询到该用户的数据！')
        // 存在该用户，判断密码是否输入正确
        const compareResult = bcrypt.compareSync(req.body.password, results[0].password);
        if (!compareResult) return res.cc('密码错误，请重新输入')
        // 密码输入正确，生成token字符串并返回给客户端
        const jwtStr = 'Bearer ' + jwt.sign({username: req.body.username}, config.secretKey, {expiresIn: config.expiresIn})
        res.send({
            status: 0,
            message: '登录成功!',
            token: jwtStr
        })
    })
}

// 获取用户信息处理函数
module.exports.getUserInfo = (req, res) => {
    res.send({
        status: 0,
        message: '获取用户信息成功！',
        data:{
            username:  req.user.username
        }
    })
}