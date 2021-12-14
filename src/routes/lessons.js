const createError = require('http-errors')
const { ObjectId } = require('mongodb')
async function routes(fastify) {
    //#region POST New lesson
    const opts = {
        schema: {
            body: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    content: { type: 'string' },
                    image: { type:'string' },
                    video: { type: 'string' },
                },
                additionalProperties: false,
                required: [ 'title', 'description' ]
            }

        }
    }
    fastify.route({
        method: 'POST',
        url: '/lessons',
        option: upload,
        schema: opts.schema,
        // preValidation: fastify.authenticateAdmin,
        handler: async(request, reply)=>{
            const db = fastify.mongo.db
            const collection = db.collection('lessons')
            const result = await collection.insertOne(request.body)
            return result.ops[0]
        }
    })
    //#endregion

    //#region GET All lessons
    fastify.get('/lessons', async(request, reply) => {
        const db = fastify.mongo.db
        const collection = db.collection('lessons')
        const result = await collection.find().toArray()
        return result
    })

    //#region GET Lesson by Id
    fastify.get('/lessons/:id', async(request, reply) => {
        const db = fastify.mongo.db
        const collection = db.collection('lessons')
        const result = await collection.findOne({
            _id: new ObjectId(request.params.id)
        })
        if (result === null){
            throw new createError.NotFound()
        }
        return result
    })
    //#endregion

    //#region UPDATE Lesson
    fastify.route({
        method: 'PATCH',
        url: '/lessons/:id',
        handler: async(request, reply) =>{
            const db = fastify.mongo.db
            const collection = db.collection('lessons')
            const result = collection.findOneAndUpdate(
                { _id: new ObjectId(request.params.id) },
                { $set: request.body },
                { returnOriginal: false }
            )
            if (!result.value){
                throw new createError.NotFound()
            }
            return result.value
        }
    })
    //#region 

    //#region DELETE
    fastify.route({
        method: 'DELETE',
        url: '/lessons/:id',
        handler: async(request, reply) =>{
            const db = fastify.mongo.db
            const collection = db.collection('lessons')
            const result = collection.findOneAndDelete(
                { _id: new ObjectId(request.params.id) }
            )
            if (!result.value) {
                throw new createError.NotFoud()
            }
            return result.value
        }
    
    })
    //#endregion
}
module.exports = routes