const { app } = require('@azure/functions');
const DatabaseConnector = require('../database/databaseConnector');

app.http('ideas', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const db = new DatabaseConnector();
        await db.connect();
        await db.migrate();
        const query = 'SELECT * FROM idea';
        const result = await db.getResult(query);
        return  {
            status: 200,
            body: JSON.stringify(result)
        };

    }
});