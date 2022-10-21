const Service = require('egg').Service;
const user = 'user'

class UserService extends Service {
    async deleteUser(name){
        await this.app.mysql.delete(user, {
            name
        });
    }

    // todo 如果多传字段如何处理
    async updateUser(params) {
        const { app } = this;
        try {
            const result = await app.mysql.update(user, {...params},{ id:params.id }); // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
            if (result.affectedRows === 1) {
                return params;
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findUser(name) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.get(user, { name }); // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async addUser(name, psd) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.insert(user, { name, psd }); // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async user() {
        const { ctx, app } = this;
        const QUERY_STR = 'id, name';
        let sql = `select ${QUERY_STR} from ${user}`; // 获取 id 的 sql 语句
        try {
            const result = await app.mysql.query(sql); // mysql 实例已经挂载到 app 对象下，可以通过 app.mysql 获取到。
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
module.exports = UserService;
