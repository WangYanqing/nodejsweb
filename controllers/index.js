

var fn_index = async(ctx, next) => {
    // ctx.response.body = `<h1>Index</h1>
    // <form action="/signin" method="post">
    //     <p>Name: <input name="name" value="koa"></p>
    //     <p>Password: <input name="password" type="password"></p>
    //     <p><input type="submit" value="Submit"></p>
    // </form>`
    ctx.render('index.html', {title: 'Welcome'})
}


var fn_signin = async(ctx, next) => {
    var name = ctx.request.body.name || ''
    var password = ctx.request.body.password || ''

    console.log(`Singin with name: ${name}, password: ${password}`)

    if(name === 'koa@163.com' && password === '12345'){
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
}


module.exports = {
    'GET /': fn_index,
    'POST /signin': fn_signin,
}