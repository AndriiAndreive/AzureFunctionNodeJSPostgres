const { app } = require('@azure/functions');
const DatabaseConnector = require('../database/databaseConnector');

app.http('getIdeaIdsByIdeaVersion', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const db = new DatabaseConnector();
        await db.connect();
        await db.migrate();
        const query = `SELECT ideaversions.id FROM ideaversions LEFT JOIN idea ON idea.version = ideaversions.id`;
        const result = await db.getResult(query);
        return  {
            status: 200,
            body: JSON.stringify(result)
        };

    }
});
