const { app } = require('@azure/functions');
const DatabaseConnector = require('../database/databaseConnector');

app.http('createIdeaComment', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'ideaComments/create',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const data = await request.text()
        const { partitionkey, rowkey, timestamp, userid, comment, date, ideaid, version } = JSON.parse(data);
        
        const db = new DatabaseConnector();
        await db.connect();
        await db.migrate();

        const query = `INSERT INTO ideacomments(partitionkey, rowkey, timestamp, userid, comment, date, ideaid, version)
            VALUES ('${partitionkey}', '${rowkey}', '${timestamp}', '${userid}', '${comment}', '${date}', '${ideaid}', '${version}')`;
        
        const result = await db.create(query);

        return {
            status: 200,
            body: result ? "Created an ideaComment successfully" : "An error ocurred while creating an ideaComment",
        };
    }
});