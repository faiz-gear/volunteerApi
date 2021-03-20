// 导入数据库操作对象
const db = require('../config/db')
const path = require('path')
const fs = require('fs');
const moment = require('moment')


// 添加策划文件路由处理函数
module.exports.addFilePlan = (req, res) => {
  // console.log(req.file);
  fs.renameSync('./uploads/' + req.file.filename, './uploads/' + req.file.originalname); //这里修改文件名字
  const fileInfo = {
    name: req.file.originalname,
    date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    address: path.join('/uploads', req.file.originalname),
    size: filterSize(req.file.size),
  }
  const sqlStr = 'insert into fileplan set ?';
  db.query(sqlStr, fileInfo, (err, results) => {
    if (err) return res.cc('上传文件失败，请检查文件名是否重复！')
    if (results.affectedRows !== 1) return res.cc('上传文件失败，是稍后重试!')
    res.cc('上传文件成功!', 0);
  })
}

// 获取文件列表路由处理函数
module.exports.getFilePlan = (req, res) => {
  const params = {
    pagesize: req.query.pagesize,
    pageno: req.query.pageno,
    total: '',
    pageNum: '',
    search: req.query.search || ''
  }
  // 查询文件数据总数
  const sqlStr = `select * from fileplan where name like "%${params.search}%"`;
  db.query(sqlStr, (err, results) => {
    if (err) return res.cc(err)
    params.total = results.length;
    params.pageNum = Math.ceil(params.total / params.pagesize);
    // 获取当前页的文件信息
    const sqlStr = `select * from fileplan where name like "%${params.search}%" order by date desc limit ?, ? `;
    db.query(sqlStr, [(params.pageno - 1) * params.pagesize, params.pagesize], (err, results) => {
      if (err) return res.cc(err)
      res.send({
        status: 0,
        message: '获取文件信息列表成功!',
        data: results,
        page: {
          ...params
        }
      })
    })
  })
}

// 下载文件路由处理函数
module.exports.downloadFilePlan = (req, res) => {
  const id = req.query.id;
  const sqlStr = 'select address from fileplan where id=?';
  db.query(sqlStr, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('下载文件失败，请稍后重试！')
    res.send({
      status: 0,
      message: '查询下载文件路径成功',
      data: {
        address: results[0].address
      }
    })
  })
}

// 删除文件路由处理函数
module.exports.removeFilePlan = async (req, res) => {
  const id = req.query.id;
  const address = await new Promise((resolve, reject) => {
    const sqlStr = 'select address from fileplan where id=?'
    db.query(sqlStr, id, (err, results) => {
      if (err) return res.cc(err)
      if (results.length === 0) return res.cc('删除文件失败，请稍后重试')
      resolve(results[0].address)
    })
  })
  const sqlStr = 'delete from fileplan where id=?';
  db.query(sqlStr, id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length === 0) return res.cc('删除文件失败，请稍后重试');
    // 删除uploads下面的文件
    fs.unlinkSync(path.join(__dirname, '../', address));
    res.send({
      status: 0,
      message: '删除文件成功！',
    })
  })
}

// 文件大小换算函数
function filterSize(size) {
  if (!size) return "";
  if (size < pow1024(1)) return size + " B";
  if (size < pow1024(2))
    return (size / pow1024(1)).toFixed(2) + " KB";
  if (size < pow1024(3))
    return (size / pow1024(2)).toFixed(2) + " MB";
  if (size < pow1024(4))
    return (size / pow1024(3)).toFixed(2) + " GB";
  return (size / pow1024(4)).toFixed(2) + " TB";
}

function pow1024(num) {
  return Math.pow(1024, num);
}