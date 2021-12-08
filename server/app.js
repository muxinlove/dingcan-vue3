const Koa = require("koa");
const app = new Koa();
//引入koa-body模块
const bodyParser = require("koa-bodyparser");
const router = require("./router/index.js");

//app.js此文件在启动项目时只执行一次，此时可以去连接数据库
var connection = require("./db/connection");
connection.disconnect();
connection.connect(); //连接数据库

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Headers", "Content-Type");
  console.log("ctx", ctx.url);
  await next();
});

// body解析
app.use(bodyParser());

// 路由
app.use(router.routes());
app.use(router.allowedMethods());

// 监听
app.listen("5000", () => {
  console.log("listening at: 5000");
});

// 错误处理
app.on("error", (err) => {
  console.error("server error", err);
});

// process.on("exit", (code) => {
//   console.log(`About to exit with code: ${code}`);
// });
