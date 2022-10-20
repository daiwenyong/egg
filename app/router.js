'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const {index,user,addUser,updateUser,deleteUser} = controller.home
  router.get('/', index);
  router.get('/user', user);
  router.post('/add_user', addUser);
  router.post('/update_user', updateUser);
  router.delete('/delete_user',deleteUser);
};
