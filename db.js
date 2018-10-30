
const Sequelize = require('sequelize')
const uuid = require('node-uuid')
const config = require('./config')


function generateId(){
    return uuid.v4()
}

console.log('Init sequelize...')

var sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            dialect: config.dialect || 'mysql',
            host: config.host,
            port: config.port || 3306,
            pool: {
                max: 5,
                min: 0,
                idle: 10000,
            }
        })

const ID_TYPE = Sequelize.STRING(50)

function defineModel(name, attributes){
    if(attributes == null){
        return
    }

    var attrs = {}
    for (const a in attributes) {
        if (attributes.hasOwnProperty(a)) {
            const element = attributes[a];
            if(typeof(element) === 'object' && element['type']){
                element.allowNull = element.allowNull || false
                attrs[a] = element
            }else{
                attrs[a] = {
                    type: element,
                    allowNull: false,
                }
            }
        }
    }

    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    }

    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    }

    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    }

    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    }

    //--------------------------------
    // console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
    //     if (k === 'type') {
    //         for (let key in Sequelize) {
    //             if (key === 'ABSTRACT' || key === 'NUMBER') {
    //                 continue;
    //             }
    //             let dbType = Sequelize[key];
    //             if (typeof(dbType) === 'function') {
    //                 if (v instanceof dbType) {
    //                     if (v._length) {
    //                         return `${dbType.key}(${v._length})`;
    //                     }
    //                     return dbType.key;
    //                 }
    //                 if (v === dbType) {
    //                     return dbType.key;
    //                 }
    //             }
    //         }
    //     }
    //     return v;
    // }, '  '));
    //--------------------------------


    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function(obj){
                let now = Date.now();
                if(obj.isNewRecord){
                    console.log('Will create entry...' + obj)
                    if(!obj.id){
                        obj.id = generateId()
                    }
                    obj.createdAt = now
                    obj.updatedAt = now
                    obj.version = 0
                }else{
                    console.log('Will update entry...' + obj)
                    obj.createdAt = now
                    obj.version++
                }
            }
        }
    })
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];
var exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({ force: true });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    },
    generateId: generateId,
    ID: ID_TYPE,
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}


module.exports = exp