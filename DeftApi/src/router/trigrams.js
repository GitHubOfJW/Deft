//卦象路由
const express = require('express');
const router = express.Router();

const controller = require('../controllers/trigrams/TrigramsController');

// 基础卦象列表
router.get('/baselist', controller.getBaseTrigrams);

// 全部挂相列表
router.get('/list', controller.getTrigrams);

// 导出
module.exports = router;