'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'index'
  }
  async user() {
    const { ctx } = this;
    const result = await ctx.service.user.user();
    ctx.body = result
  }
  error(msg, data = null) {
    this.ctx.body = {
      code: 500,
      msg,
      data
    }
  }
  success(msg, data = null) {
    this.ctx.body = {
      code: 200,
      msg,
      data
    }
  }
  findUser(name) {
    return this.ctx.service.user.findUser(name)
  }
  async addUser() {
    const { ctx } = this;
    const { name, psd } = ctx.request.body;

    try {
      const find = await this.findUser(name)

      if (find) {
        this.error('请求失败', '账号已存在')
        return
      }
      const result = await ctx.service.user.addUser(name, psd);
      this.success('注册成功', { name, psd })
    } catch (error) {
      this.error('请求失败', null)
    }
  }
  async updateUser() {
    const { ctx } = this;
    const { name, id } = ctx.request.body;
    const res = await this.findUser(name)
    if (res) {
      this.error('请求失败', '该账号已有人使用')
      return
    }
    const success = await ctx.service.user.updateUser(name, id);
    success && this.success('修改成功', { name })
  }
  async deleteUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    const res = await this.findUser(name)

    if (!res) {
      this.error('请求失败', '没有该账号')
      return
    }
    await ctx.service.user.deleteUser(name);
    this.success('删除成功')
  }

  async login() {
    const { ctx, app } = this;
    const { name, psd } = ctx.request.body;

    try {
      const find = await this.findUser(name)

      if (!find) {
        this.error('请求失败', '账号不存在')
        return
      }
      if (psd !== find.psd) {
        this.error('请求失败', '密码错误')
        return
      }

      const token = app.jwt.sign({
        id: find.id,
        username: find.name,
        // exp:Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 有效期24小时
      }, app.config.jwt.secret, {
        expiresIn: '2h'
      })
      this.success('登录成功', { token })
    } catch (error) {
      this.error('请求失败', error)
    }
  }

  async getUserInfo() {
    const { ctx, app } = this;
    // 通过 token 解析，拿到 user_id
    const token = ctx.request.header.authorization; // 请求头获取 authorization 属性，值为 token
    // 通过 app.jwt.verify + 加密字符串 解析出 token 的值 
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    // 响应接口
    ctx.body = {
      code: 200,
      message: '获取成功',
      data: {
        ...decode
      }
    }
  }

}

module.exports = UserController;
