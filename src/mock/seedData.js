/* istanbul ignore file */
const bcrypt = require('bcryptjs')
const config = require('../config/config')
const logger = require('../config/winston')
const initMongo = require('../config/mongoose')

const User = require('../models/user.model')
const Token = require('../models/token.model')

if (config.node_env === 'mock') {
  initMongo(async () => {
    // 2nd: if needed: populate db w/ fake dataset
    if (config.populate) {
      logger.info('===== Started dataset =====')
      await this.removeAllData().then(async () => {
        await this.seedData().then(() => {
          logger.info('===== Dataset completed =====')
          process.exit(0)
        })
      })
    }
  })
}

// ===================================
// == start by removing all data
// ===================================
module.exports.removeAllData = async function removeAllData () {
  try {
    await User.deleteMany({})
    await Token.deleteMany({})
    logger.info('=> Successfully removed all existent data')
  } catch (err) {
    logger.error(err)
  }
}

// ===================================
// == add data
// ===================================
module.exports.seedData = async function seedData () {
  try {
    // users
    const user1 = new User({
      firstname: 'Arthur',
      lastname: 'Dufour',
      email: 'arthur.dufour1@epsi.fr',
      password: bcrypt.hashSync('password', 10),
      permissionLevel: 'MEMBER',
      grade: 'B3 G1',
      bts: false,
      isActive: true
    })
    const user2 = new User({
      firstname: 'Alexandre',
      lastname: 'Tuet',
      email: 'alexandre.tuet1@epsi.fr',
      password: bcrypt.hashSync('password', 10),
      permissionLevel: 'ADMIN',
      grade: 'B3 G1',
      bts: false,
      isActive: true
    })
    const user3 = new User({
      firstname: 'Thomas',
      lastname: 'Zimmermann',
      email: 'thomas.zimmermann@epsi.fr',
      password: bcrypt.hashSync('password', 10),
      permissionLevel: 'MEMBER',
      grade: 'B3 G1',
      bts: false,
      isActive: false
    })

    const token1 = new Token({
      user: user3._id,
      value: 'aValidToken',
      type: 'EMAIL_VERIFICATION'
    })

    const token2 = new Token({
      user: user2._id,
      value: 'aValidToken2',
      type: 'PASSWORD_RESET'
    })

    const token3 = new Token({
      user: user2._id,
      value: 'aValidToken3',
      type: 'EMAIL_VERIFICATION'
    })

    await user1.save()
    logger.info(`=> user1 (${user1.firstname} ${user1.lastname}) saved (${user1._id})`)
    await user2.save()
    logger.info(`=> user2 (${user2.firstname} ${user2.lastname}) saved (${user2._id})`)
    await user3.save()
    logger.info(`=> user3 (${user3.firstname} ${user3.lastname}) saved (${user3._id})`)

    await token1.save()
    logger.info(`=> token1 (${token1.type}) saved (${token1.user})`)
    await token2.save()
    logger.info(`=> token2 (${token2.type}) saved (${token2.user})`)
    await token3.save()
    logger.info(`=> token3 (${token3.type}) saved (${token3.user})`)
  } catch (err) {
    logger.error(err)
  }
}
