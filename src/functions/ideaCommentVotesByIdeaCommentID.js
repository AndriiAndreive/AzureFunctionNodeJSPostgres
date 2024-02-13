const { app } = require('@azure/functions');
const DatabaseConnector = require('../database/databaseConnector');

app.http('ideaCommentVotesByIdeaCommentID', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const ideacommentid = (request.query.get('ideacommentid') || (request.body && request.body.ideacommentid));
        
        if (ideacommentid) {

            const db = new DatabaseConnector();
            await db.connect();
            await db.migrate();
            const query = `SELECT * FROM ideacommentvotes WHERE ideacommentid = ${ideacommentid}`;
            const result = await db.getResult(query);
            return  {
                status: 200,
                body: JSON.stringify(result)
            };

        } else {
            return {
                status: 400,
                body: "Please pass a ideacommentid on the query string or in the request body."
            };
        }
        
    }
});
