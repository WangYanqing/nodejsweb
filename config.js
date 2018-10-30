

//Load config according to the ENV
const config_default  = './config_default'
const config_test     = './config_test'
const config_override = './config_override'
const fs = require('fs')


var config = null

if(process.env.NODE_ENV === 'test'){
    console.log(`Load ${config_test}`)
    config = require(config_test)
}else{
    console.log(`Load ${config_default}`)
    config = require(config_default)
    try {
        if(fs.statSync(config_override).isFile()){
            console.log(`Load ${config_override}`)
            config = Object.assign(config, require(config_override))
        }
    } catch (error) {
        console.log(`Cannot load ${config_override}`)
    }
}

module.exports = config