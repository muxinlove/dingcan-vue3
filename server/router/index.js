const Router = require("koa-router");
var sms_util = require("../utils/sms_util.js");
const db = require("../db/db.js");
const moment = require("moment");

const router = new Router();

// 注册
router.get("/sendCode", sendCode);
router.post("/login", login);
// 首页
router.get("/index/banners", getHomeBanners);
router.get("/index/data", getHomeData);
// 意见反馈
router.post("/feedback", feedback);
// 地址
router.get("/getAddrsByUserId", getAddrsByUserId);
router.get("/getAddrByAddrId", getAddrByAddrId);
router.post("/createOrder", createOrder);
router.put("/updateAddr", updateAddr);
router.delete("/deleteAddrById", deleteAddrById);
// 订单
router.get("/order/getDefaultAddress", getDefaultAddress);
router.post("/order/createOrder", createOrder);
router.get("/order/list", getOrderList);
router.get("/order/detail", getOrderDetail);

//保存所有的phone:code的对象
const users = {};
// 获取手机验证码
async function sendCode(ctx) {
  // 获取数据
  const { phone } = ctx.request.query;
  // 生成随机6位码
  var code = sms_util.randomCode(6);
  // 发给指定的手机
  console.log(`向${phone}发送验证码短信:${code}`);
  // sms_util.sendCode(phone, code, function (success) {
  //   if (success) {
  //     // 保存验证码
  //     users[phone] = code;
  //     //返回数据
  //     ctx.body = { code: 0 };
  //   }
  // });
  // 保存验证码
  users[phone] = code;
  //返回数据
  ctx.body = { code: 0 };
}

// 登录
async function login(ctx) {
  // 获取数据
  const { phone, code } = ctx.request.body;
  // 比对验证码
  if (users[phone] != code) {
    ctx.body = { code: 1, msg: "验证码不正确" };
    return;
  }
  // 删除保存的验证码
  delete users[phone];

  // 查询用户 如果有 则返回用户数据 否则新增用户
  let user = await db.getUser(phone);
  if (user) {
    ctx.body = {
      code: 0,
      data: user,
    };
  } else {
    user = await db.addUser(phone);
    ctx.body = {
      code: 0,
      data: user,
    };
  }
}

// 查询轮播图
async function getHomeBanners(ctx) {
  const data = await db.getBanners();
  ctx.body = {
    code: 0,
    data: data,
  };
}

// 查询菜品
async function getHomeData(ctx) {
  const meals = await db.getMeals();
  ctx.body = {
    code: 0,
    data: {
      meals: meals,
      isMatched: "yes",
      restaurant: {
        _id: "xxxx",
        address: "上海市黄浦区雅居乐国际广场",
        cityId: 0,
        id: 1772,
        lat: 39.993403,
        lng: 116.311644,
        minMoney: 0,
        phone: "16600000001",
        rstName: "D1M店",
        songcanfei: 5,
        state: 1,
        workTime: "08:00-19:00",
      },
    },
  };
}

// 意见反馈
async function feedback(ctx) {
  // 获取数据
  const params = ctx.request.body;

  // 新增
  const feedback = await db.addFeedback(params);

  ctx.body = {
    code: 0,
    data: feedback,
  };
}

// 地址
async function getAddrsByUserId(ctx) {
  var { userId } = ctx.request.query;
  const addrs = await db.getAddrsByUserId(userId);
  ctx.body = {
    code: 0,
    data: addrs,
  };
}

async function getAddrByAddrId(ctx) {
  const { addrId } = ctx.request.query;
  const result = await db.getAddrByAddrId(addrId);
  ctx.body = {
    code: 0,
    data: result,
  };
}

async function addAddr(ctx) {
  const addr = ctx.request.body;
  const result = await db.addAddr(addr);
  ctx.body = {
    code: 0,
    data: result,
  };
}
async function updateAddr(ctx) {
  const addr = ctx.request.body;
  const result = db.updateAddr(addr);
  ctx.body = {
    code: 0,
    data: result,
  };
}
async function deleteAddrById(ctx) {
  const { addrId } = ctx.request.query;
  const result = await db.deleteAddrById(addrId);
  ctx.body = {
    code: 0,
    data: result,
  };
}

// 订单
async function getDefaultAddress(ctx) {
  const { userId } = ctx.request.query;
  const result = await db.getDefaultByUserId(userId);
  ctx.body = {
    code: 0,
    data: result,
  };
}

async function createOrder(ctx) {
  const order = ctx.request.body;
  order.state = 1;
  const result = await db.addOrder(order);
  ctx.body = {
    code: 0,
    data: result,
  };
}
async function getOrderList(ctx) {
  const { id } = ctx.request.query;
  const orders = await db.getOrdersByUserId(id);
  if (orders && orders.length) {
    orders.forEach(function (order) {
      order._doc.arrive_time = moment(order.arrive_time).format("HH:mm");
      order._doc.detail = JSON.parse(order._doc.detail);
    });
  }
  ctx.body = {
    code: 0,
    data: orders,
  };
}
async function getOrderDetail(ctx) {
  const { id } = ctx.request.query;
  const order = await db.getOrderById(id);
  var stateText;
  switch (order.state) {
    case 0:
      stateText = "待支付";
      break;
    case 1:
      stateText = "已付款";
      break;
    case 3:
      stateText = "已完成";
      break;
    case 4:
      stateText = "店铺拒单";
      break;
    case 5:
      stateText = " 商家已接单";
      break;
    case 6:
      stateText = "已退单";
      break;
    case 7:
      stateText = "未支付的取消订单";
      break;
    case 8:
      stateText = "订单异常";
      break;
    case 9:
      stateText = "退单中";
      break;
    case 10:
      stateText = "商家拒绝退单";
  }
  //给对象设置属性   需要写上 _doc
  order._doc.stateText = stateText;
  order._doc.arrive_time = moment(order.arrive_time).format("HH:mm");
  ctx.body = {
    code: 0,
    data: order,
  };
}

module.exports = router;
