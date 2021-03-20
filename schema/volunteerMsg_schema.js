const joi = require('@hapi/joi')

// 分页查询参数
const pagesize = joi.number().min(1).required();
const pageno = joi.number().min(1);
const grade = joi.string().valid('2015级', '2016级', '2017级', '2018级', '2019级', '2020级', '所有级别', '')
const name = joi.string().allow('');
// 添加志愿者参数
const studyNumber = joi.string().min(12).max(12).required();
const sex = joi.string().valid('男', '女').required();
const Class = joi.string().required();
const phone = joi.string().min(11).max(11).required();
const newName = joi.string().required();
const newGrade = joi.string().valid('2015级', '2016级', '2017级', '2018级', '2019级', '2020级', '所有级别', '').required();

// 更新志愿者参数
const id = joi.number().min(1).required();

// 向外暴露获取志愿者信息规则对象
exports.volunteerMsg_schema = {
    query: {
        pagesize,
        pageno,
        grade,
        name
    }
}

// 向外暴露添加志愿者规则对象
exports.addVolunteer_schema = {
    body: {
        studyNumber,
        name: newName,
        sex,
        grade: newGrade,
        class: Class,
        phone
    }
}
// 向外暴露更新志愿者信息规则对象
exports.updateVolunteer_schema = {
    body: {
        studyNumber,
        name: newName,
        sex,
        grade: newGrade,
        class: Class,
        phone,
        id
    }
}

// 向外暴露删除志愿者信息规则对象
exports.deleteVolunteer_schema = {
    body: {
        id
    }
}