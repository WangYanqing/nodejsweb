

const db = require('../db')
const Sequelize = require('sequelize')
const crypto = require('crypto')

const defaultPasswd = '123456'

module.exports = db.defineModel(
    'users',
    {
        name: {
            type: db.STRING(30),
            unique: true,
            validate: {
                
            }
        },

        sex: {
            type: Sequelize.ENUM,
            values: ['u', 'm', 'f'], //0-unknown, 1-male, 2-female
            defaultValue: 'u',
        },

        password: {
            type: Sequelize.STRING(32),
            defaultValue: crypto.createHash('md5').update(defaultPasswd).digest('hex')
        },

        score: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        }
    }
)