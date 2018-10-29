
const config = require('../config')
const Sequelize = require('sequelize')
const crypto = require('crypto')


var fn_index = async(ctx, next) => {
    // ctx.response.body = `<h1>Index</h1>
    // <form action="/signin" method="post">
    //     <p>Name: <input name="name" value="koa"></p>
    //     <p>Password: <input name="password" type="password"></p>
    //     <p><input type="submit" value="Submit"></p>
    // </form>`
    ctx.render('index.html', {title: 'Welcome'})
}


var conn = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});


var admins = conn.define('admins', {
    name: {
        type: Sequelize.STRING(20),
        primaryKey: true,
    },
    passwd: Sequelize.STRING(32),
    create_time: Sequelize.TIME,
    comment: Sequelize.STRING(30)
    },
    {
        timestamps: false
    })


var fn_signin = async(ctx, next) => {
    var name = ctx.request.body.name || ''
    var password = ctx.request.body.password || ''
    var passwdMd5 = crypto.createHash('md5').update(password).digest('hex')

    console.log(`Singin with name: ${name}, password: ${password}`)

    //Search the db
    await (async () => {
        var rows = await admins.findAll({
            where: {
                name: name,
            }
        })
        console.log(`>>Found ${rows.length} admins`)

        var valid = false;
        if(rows && rows.length > 0){
            for(let a of rows){
                console.log(JSON.stringify(a))
                console.log('password=' + passwdMd5)
                if(a.passwd == passwdMd5){
                    valid = true
                    break
                }
            }
        }

        
        // if(name === 'koa@163.com' && password === '12345'){
        if(valid){
            // ctx.response.body = `<h1>Welcome, ${name}`
            ctx.render('signin-ok.html', {
                title: 'Sign In OK',
                name: 'Mr Node'
            });
        }else{
            // ctx.response.body = `<h1>Login failed!</h1>
            // <p><a href='/'>try again</a></p>`
            ctx.render('signin-failed.html', {
                title: 'Sign In Failed'
            });
        }
    })();
}


module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_signin,
}