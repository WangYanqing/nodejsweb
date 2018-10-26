

const fs = require('fs')

function addMapping(router, mapping){
    for (const url in mapping) {
        if(url.startsWith('GET ')){
            router.get(url.substring(4), mapping[url])
            console.log(`>>Register url mapping: ${url}`)
        }else if(url.startsWith('POST ')){
            router.post(url.substring(5), mapping[url])
            console.log(`>>Register url mapping: ${url}`)
        }else{
            console.log(`>>Invalid url: ${url}`)
        }
    }
}


function addControllers(router, dir){
    var files = fs.readdirSync(__dirname + '/' + dir)
    var js_files = files.filter((f) => {
        return f.endsWith('.js')
    })

    for (const f of js_files) {
        console.log(`>>Processing controller ${f}...`)
        let mapping = require(__dirname + '/' + dir + '/' + f)
        addMapping(router, mapping)
    }
}


module.exports = function(dir) {
    let dir0 = dir || 'controllers'
    let router = require('koa-router')()
    addControllers(router, dir0)

    return router.routes()
}