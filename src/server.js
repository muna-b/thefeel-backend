const fastify = require('fastify')({
    logger: true
  })

require('dotenv').config()

fastify.register(require('fastify-mongodb'), {
    forceClose: true,
    url: process.env.MONGODBURL
})

fastify.register(require('fastify-cors',), {
    origin : process.env.URL,
    methods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue : false,
  })

const start = async () => {
    try {
        await fastify.listen(process.env.PORT)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()