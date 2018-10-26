
const path = require('path')
const mime = require('mime')
const fs = require('mz/fs')


function staticFiles(url, dir){
    return async(ctx, next) => {
        let rpath = ctx.request.url
        if(rpath.startsWith(url)){
            //Get a full path
            let fp = path.join(dir, rpath.substring(url.length))

            //Check existense
            if(await fs.exists(fp)){
                //Check the file's mime
                ctx.response.type = mime.getType(rpath)
                ctx.response.body = await fs.readFile(fp)
            }else{
                ctx.response.status = 404
            }
        }else{
            await next()
        }
    }
}


module.exports = staticFiles