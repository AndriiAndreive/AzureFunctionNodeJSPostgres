const { app } = require('@azure/functions');
const DatabaseConnector = require('../database/databaseConnector');

app.http('createIdeaCommentVote', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'ideaCommentVotes/create',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const data = await request.text()
        const { partitionkey, rowkey, timestamp, userid, version, ideacommentid } = JSON.parse(data);
        
        const db = new DatabaseConnector();
        await db.connect();
        await db.migrate();

        const query = `INSERT INTO ideacommentvotes(partitionkey, rowkey, timestamp, userid, version, ideacommentid)
            VALUES ('${partitionkey}', '${rowkey}', '${timestamp}', '${userid}', '${version}', '${ideacommentid}')`;
        
        const result = await db.create(query);

        return {
            status: 200,
            body: result ? "Created an ideaCommentVote successfully" : "An error ocurred while creating an ideaCommentVote",
        };
    }
});