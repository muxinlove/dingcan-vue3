/**
 * 数据库操作的总接口模块
 */
var dao_user = require("./dao_user");
var dao_feedback = require("./dao_feedback");
var dao_address = require("./dao_address");
var dao_banner = require("./dao_banner");
var dao_meal = require("./dao_meal");
var dao_order = require("./dao_order");

module.exports = {
  /************************* 登 陆 **********************************/
  // 查询用户
  getUser: function (phone) {
    return new Promise((resolve, reject) => {
      dao_user.getUser(phone, function (err, user) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(user);
        }
      });
    });
  },
  // 新增用户
  addUser: function (phone) {
    return new Promise((resolve, reject) => {
      dao_user.addUser(phone, function (err, user) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(user);
        }
      });
    });
  },
  /************************* 意见反馈 **********************************/
  // 新增意见反馈
  addFeedback: function (feedback, cb) {
    return new Promise((resolve, reject) => {
      dao_feedback.addFeedback(feedback, function (err, feedback) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(feedback);
        }
      });
    });
  },
  /************************* 地址相关 **********************************/
  // 获取地址列表
  getAddrsByUserId: function (userId, cb) {
    return new Promise((resolve, reject) => {
      dao_address.getAddrsByUserId(userId, function (err, addrs) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(addrs);
        }
      });
    });
  },
  getAddrByAddrId: function (addrId, cb) {
    return new Promise((resolve, reject) => {
      dao_address.getAddrByAddrId(addrId, function (err, addr) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(addr);
        }
      });
    });
  },
  // 新增地址
  addAddr: function (addr, cb) {
    return new Promise((resolve, reject) => {
      dao_address.addAddr(addr, function (err, addr) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(addr);
        }
      });
    });
  },
  // 修改地址
  updateAddr: function (addr, cb) {
    return new Promise((resolve, reject) => {
      dao_address.updateAddr(addr, function (err, addr) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(addr);
        }
      });
    });
  },
  // 删除地址
  deleteAddrById: function (addrId, cb) {
    return new Promise((resolve, reject) => {
      dao_address.deleteAddrById(addrId, function (err, result) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(result);
        }
      });
    });
  },
  /************************* 首 页 **********************************/
  // 获取轮播图数据
  getBanners: function (cb) {
    return new Promise((resolve, reject) => {
      dao_banner.getBanners(function (err, banners) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(banners);
        }
      });
    });
  },
  // 获取菜品数据
  getMeals: function (cb) {
    return new Promise((resolve, reject) => {
      dao_meal.getMeals(function (err, meals) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(meals);
        }
      });
    });
  },

  /************************* 订 单 **********************************/
  // 获取默认地址
  getDefaultByUserId: function (userId, cb) {
    return new Promise((resolve, reject) => {
      dao_address.getDefaultByUserId(userId, function (err, addr) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(addr);
        }
      });
    });
  },
  // 下单
  addOrder: function (order, cb) {
    return new Promise((resolve, reject) => {
      dao_order.addOrder(order, function (err, order) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(order);
        }
      });
    });
  },
  // 获取订单详情
  getOrderById: function (id, cb) {
    return new Promise((resolve, reject) => {
      dao_order.getOrderById(id, function (err, order) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(order);
        }
      });
    });
  },
  // 根据用户id查询订单列表
  getOrdersByUserId: function (id, cb) {
    return new Promise((resolve, reject) => {
      dao_order.getOrdersByUserId(id, function (err, order) {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(order);
        }
      });
    });
  },
};
