```
npm install -g azure-functions-core-tools@3 --unsafe-perm true
func new --name MyHttpFunction --template "HTTP triggeer"
npm install pg
```
### `Sample Code here`:
###
```
const { app } = require('@azure/functions');
const { Client } = require('pg');

app.http('ideas', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        
        const pgConfig = {
            host: process.env.PG_HOST,
            port: process.env.PG_PORT,
            database: process.env.PG_DATABASE,
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
        };

        const client = new Client(pgConfig);

        try {
            await client.connect();
            context.log('Connected to PostgreSQL');
    
            // Perform database operations here
            const result = await client.query('SELECT * FROM idea');
            console.log('Query result:', result.rows);

            return {
                status: 200,
                body: 'Connected to PostgreSQL'
            };
        } catch (error) {
            context.log.error('Error connecting to PostgreSQL:', error);
            return {
                status: 500,
                body: 'Error connecting to PostgreSQL'
            };
        } finally {
            await client.end();
        }

        const name = (request.query.get('name') || (request.body && request.body.name));
        // const name = request.query.get('name') || await request.text() || 'world';
        if (name) {
            return {
                status: 200,
                body: `Hello, ${name}!`
            };
        } else {
            return {
                status: 400,
                body: "Please pass a name on the query string or in the request body."
            };
        }
    }
});
```