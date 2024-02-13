const { app } = require('@azure/functions');
const DatabaseConnector = require('../database/databaseConnector');

app.http('ideaVotesByIdeaID', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const ideaid = (request.query.get('ideaid') || (request.body && request.body.ideaid));
        
        if (ideaid) {

            const db = new DatabaseConnector();
            await db.connect();
            await db.migrate();
            const query = `SELECT * FROM ideavotes WHERE ideaid = ${ideaid}`;
            const result = await db.getResult(query);
            return  {
                status: 200,
                body: JSON.stringify(result)
            };

        } else {
            return {
                status: 400,
                body: "Please pass a ideaid on the query string or in the request body."
            };
        }
        
    }
});
