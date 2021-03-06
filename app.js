
// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa           = require('koa');
const bodyparser    = require('koa-bodyparser')
const controller    = require('./controller')
const templating    = require('./templating')
const model         = require('./model')


const isProduction  = process.env.NODE_ENV === 'production'

// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
    console.log(`>>Process ${ctx.request.method} ${ctx.request.url}...`)
    await next()
});

if(!isProduction){
    let staticFiles = require('./static-files')
    app.use(staticFiles('/static/', __dirname + '/static'))
}
app.use(bodyparser())
app.use(templating('views', {noCache: !isProduction, watch: !isProduction}))
app.use(controller())

// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');

model.sync();
console.log('Init db ok!')
