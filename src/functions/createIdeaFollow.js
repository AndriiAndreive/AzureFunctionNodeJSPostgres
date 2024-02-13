const { app } = require('@azure/functions');
const DatabaseConnector = require('../database/databaseConnector');

app.http('createIdeaFollow', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'ideaFollows/create',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const data = await request.text()
        const { partitionkey, rowkey, timestamp, ideaid } = JSON.parse(data);
        
        const db = new DatabaseConnector();
        await db.connect();
        await db.migrate();

        const query = `INSERT INTO ideafollows(partitionkey, rowkey, timestamp, ideaid)
            VALUES ('${partitionkey}', '${rowkey}', '${timestamp}', ${ideaid})`;
        
        const result = await db.create(query);

        return {
            status: 200,
            body: result ? "Created an ideaFollow successfully" : "An error ocurred while creating an ideaFollow",
        };
    }
});