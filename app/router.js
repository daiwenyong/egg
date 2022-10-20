'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller,middleware } = app;
  const {index,user,addUser,updateUser,deleteUser,login,getUserInfo} = controller.user
  const _jwt = middleware.jwtErr(app.config.jwt.secret)

  router.get('/', index);
  router.get('/user', user);
  router.post('/add_user', addUser);
  router.post('/update_user', updateUser);
  router.delete('/delete_user',deleteUser);
  router.post('/login',login);
  router.get('/user/getUserInfo',_jwt,getUserInfo);
};
