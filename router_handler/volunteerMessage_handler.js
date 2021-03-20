const db = require('../config/db')

// 分页获取全部志愿者信息
module.exports.getVolunteerMsg = (req, res) => {
    const params = {
        pagesize: req.query.pagesize,
        pageno: req.query.pageno || '1',
        pageNum: '',
        total: '',
        grade: req.query.grade || '', // 按级别搜索
        name: req.query.name || '' // 按姓名搜索
    }
    // 如果grade是所有级别，则将它赋值为空，从而查询所有级别的数据
    params.grade = params.grade === '所有级别' ? '' : params.grade;
    // 查询数据总数
    const sqlStr = `select count(*) as num from volunteermessage where grade like"%${params.grade}%" and name like"%${params.name}%" and status != 1`
    db.query(sqlStr, (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 0) return res.cc('查询志愿者信息失败，请稍后再试！')
        params.total = results[0].num;
        params.pageNum = Math.ceil(params.total / params.pagesize);
        // 查询当前页数据并返回
        const sqlStr = `select * from volunteermessage where grade like"%${params.grade}%" and name like"%${params.name}%" and status != 1 order by studynumber desc limit ?, ?`
        db.query(sqlStr, [(params.pageno - 1) * params.pagesize, params.pagesize], (err, results) => {
            if (err) return res.cc(err)
            res.send({
                status: 0,
                message: '查询志愿者信息成功!',
                data: results,
                page: {
                    ...params,
                    length: results.length
                }
            })
        })

    })
}

// 增加志愿者
module.exports.addVolunteer = (req, res) => {
    const sqlStr = 'insert into volunteermessage set ?'
    db.query(sqlStr, req.body, (err, results) => {
        if (err) return res.cc('添加志愿者失败，请检查学号是否重复！')
        if (results.affectedRows !== 1) return res.cc('添加志愿者失败，请稍后再试！')
        res.cc('添加志愿者成功', 0)
    })
}

// 更新志愿者信息
module.exports.updateVolunteer = (req, res) => {
    const sqlStr = 'update volunteermessage set ? where id=?';
    db.query(sqlStr, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc('更新志愿者信息失败，请检查学号是否输入重复！')
        if (results.affectedRows !== 1) return res.cc('更新志愿者信息失败，请稍后重试！')
        res.cc('更新志愿者信息成功!', 0)
    })
}

// 删除志愿者信息
module.exports.deleteVolunteer = (req, res) => {
    const sqlStr = 'update volunteermessage set status=1 where id=?';
    db.query(sqlStr, req.body.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除志愿者信息失败，请稍后重试!')
        res.cc('删除志愿者信息成功！', 0)
    })
}
