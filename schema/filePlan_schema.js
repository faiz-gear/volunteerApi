const joi = require('@hapi/joi')

const pagesize = joi.number().min(1).required();
const pageno = joi.number().min(1);
const search = joi.string().allow('');

// 下载文件的id
const id = joi.number().min(1).required();

module.exports.getFilePlan_schema = {
    query: {
        pageno,
        pagesize,
        search
    }
}

// 向外暴露下载文件规则对象
module.exports.downloadFilePlan_schema = {
    query: {
        id
    }
}

// 向外暴露删除文件规则对象
module.exports.removeFilePlan_schema = {
    query: {
        id
    }
}