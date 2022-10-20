'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'index'
  }
  async user() {
    const { ctx } = this;
    const result = await ctx.service.home.user();
    ctx.body = result
  }
  error(msg, data=null) {
    this.ctx.body = {
      code: 500,
      msg,
      data
    }
  }
  success(msg,data=null){
    this.ctx.body = {
      code: 200,
      msg,
      data
    }
  }
  findUser(name){
    return this.ctx.service.home.findUser(name)
  }
  async addUser() {
    const { ctx } = this;
    const { name, psd } = ctx.request.body;

    try {
      if (this.findUser(name)) {
        this.error('请求失败', '账号已存在')
        return
      }
      const result = await ctx.service.home.addUser(name, psd);
      this.success(msg,{name,psd})
    } catch (error) {
      this.error('请求失败', null)
    }
  }
  async updateUser(){
    const { ctx } = this;
    const { name, id } = ctx.request.body;
    const res = await this.findUser(name)
    if (res) {
      this.error('请求失败', '该账号已有人使用')
      return
    }
    const success = await ctx.service.home.updateUser(name, id);
    success && this.success('修改成功',{name})
  }
  async deleteUser(){
    const { ctx } = this;
    const { name } = ctx.request.body;
    const res = await this.findUser(name)
    console.log("🚀 ~ file: home.js ~ line 62 ~ HomeController ~ deleteUser ~ res", res)
    
    if (!res) {
      this.error('请求失败', '没有该账号')
      return
    }
    await ctx.service.home.deleteUser(name);
    this.success('删除成功')
  }

}

module.exports = HomeController;
