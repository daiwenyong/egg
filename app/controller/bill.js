'use strict';

const moment = require('moment')

const Controller = require('egg').Controller;

class BillController extends Controller {
    async add() {
        const { ctx, app } = this;
        // 获取请求中携带的参数
        const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;

        // 判空处理，这里前端也可以做，但是后端也需要做一层判断。
        if (!amount || !type_id || !type_name || !date || !pay_type) {
            ctx.body = {
                code: 400,
                msg: '参数错误',
                data: null
            }
        }

        try {
            let user_id
            const token = ctx.request.header.authorization;
            // 拿到 token 获取用户信息
            const decode = await app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return
            user_id = decode.id
            // user_id 默认添加到每个账单项，作为后续获取指定用户账单的标示。
            // 可以理解为，我登录 A 账户，那么所做的操作都得加上 A 账户的 id，后续获取的时候，就过滤出 A 账户 id 的账单信息。
            const result = await ctx.service.bill.add({
                amount,
                type_id,
                // type_name,
                date,
                pay_type,
                remark,
                user_id
            });
            ctx.body = {
                code: 200,
                msg: '添加成功',
                data: result
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: error
            }
        }
    }
}

module.exports = BillController;