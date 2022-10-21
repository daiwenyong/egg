'use strict';

const Service = require('egg').Service;

class BillService extends Service {
    async add(params) {
        const { ctx, app } = this;
        // 往 bill 表中，插入一条账单数据
        const result = await app.mysql.insert('bill', params);
        return result;
    }
}

module.exports = BillService;