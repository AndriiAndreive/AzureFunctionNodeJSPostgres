const { app } = require('@azure/functions');
const DatabaseConnector = require('../database/databaseConnector');

app.http('createIdea', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'ideas/create',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const data = await request.text()
        const { partitionkey, rowkey, timestamp, complete, completedate, date, idea, planned, title, userid, version } = JSON.parse(data);
        
        const db = new DatabaseConnector();
        await db.connect();
        await db.migrate();

        const query = `INSERT INTO idea(partitionkey, rowkey, timestamp, complete, completedate, date, idea, planned, title, userid, version)
            VALUES ('${partitionkey}', '${rowkey}', '${timestamp}', '${complete}', '${completedate}', '${date}', '${idea}', '${planned}', '${title}', '${userid}', '${version}')`;
        
        const result = await db.create(query);

        return {
            status: 200,
            body: result ? "Created an idea successfully" : "An error ocurred while creating an idea",
        };
    }
});