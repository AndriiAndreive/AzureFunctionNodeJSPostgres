const { app } = require('@azure/functions');
const DatabaseConnector = require('../database/databaseConnector');

app.http('createIdeaVersion', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'ideaVersions/create',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const data = await request.text()
        const { partitionkey, rowkey, timestamp, versiondate, versionname, id } = JSON.parse(data);
        
        const db = new DatabaseConnector();
        await db.connect();
        await db.migrate();

        const query = `INSERT INTO ideaversions(partitionkey, rowkey, timestamp, versiondate, versionname, id)
            VALUES ('${partitionkey}', '${rowkey}', '${timestamp}', '${versiondate}', '${versionname}', '${id}')`;
        
        const result = await db.create(query);

        return {
            status: 200,
            body: result ? "Created an ideaVersion successfully" : "An error ocurred while creating an ideaVersion",
        };
    }
});