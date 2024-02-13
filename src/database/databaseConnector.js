const { Client } = require('pg');

const pgConfig = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
};

// SQL script to create the 'idea' table
const createIdeaTableScript = `
  CREATE TABLE IF NOT EXISTS idea
  (
      "partitionkey" bigint,
      "rowkey" bigint,
      "timestamp" timestamp without time zone,
      "complete" boolean,
      "completedate" date,
      "date" date,
      "idea" text COLLATE pg_catalog."default",
      "planned" boolean,
      "title" text COLLATE pg_catalog."default",
      "userid" bigint,
      "version" integer
  );
`;

const createIdeaCommentsTableScript = `
  CREATE TABLE IF NOT EXISTS ideacomments
  (
      "partitionkey" bigint,
      "rowkey" bigint,
      "timestamp" timestamp without time zone,
      "userid" bigint,
      "comment" text COLLATE pg_catalog."default",
      "date" date,
      "ideaid" integer,
      "version" integer
  );
`;

const createIdeaCommentVotesTableScript = `
  CREATE TABLE IF NOT EXISTS ideacommentvotes
  (
      "partitionkey" bigint,
      "rowkey" bigint,
      "timestamp" timestamp without time zone,
      "userid" bigint,
      "version" integer,
      "ideacommentid" integer
  );
`;
const createIdeaVotesTableScript = `
  CREATE TABLE IF NOT EXISTS ideavotes
  (
    "partitionkey" bigint,
    "rowkey" bigint,
    "timestamp" timestamp without time zone,
    "ideaid" integer
  );
`;

const createIdeaFollowsTableScript = `
  CREATE TABLE IF NOT EXISTS ideafollows
  (
    "partitionkey" bigint,
    "rowkey" bigint,
    "timestamp" timestamp without time zone,
    "ideaid" integer
  );
`;

const createIdeaVersionsTableScript = `
  CREATE TABLE IF NOT EXISTS ideaversions
  (
      "partitionkey" bigint,
      "rowkey" bigint,
      "timestamp" timestamp without time zone,
      "versiondate" date,
      "versionname" integer,
      "id" integer
  );
`;

class DatabaseConnector {
  constructor() {
    this.client = new Client(pgConfig);
  }

  async connect() {

    try {
        await this.client.connect();
        console.log('Connected to the database');
    } catch (error) {
        context.log.error('Error connecting to the database:', error);
    }
    
  }

  async disconnect() {
    await this.client.end();
    console.log('Disconnected from the database');
  }

  async getResult(query) {
    try {
      const result = await this.client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error; // Propagate the error for handling at a higher level
    }
  }

  async create(query) {
    try {
      const result = await this.client.query(query);
      if(result.rowCount === 1){
        return true;
      }else{
        return false;
      }
    } catch (error) {
      console.error('Error executing query:', error);
      throw error; // Propagate the error for handling at a higher level
    }
  }

  async migrate() {
    try {  
      // Execute the SQL script to create the table
      await this.client.query(createIdeaTableScript);
      await this.client.query(createIdeaCommentsTableScript);
      await this.client.query(createIdeaVotesTableScript);
      await this.client.query(createIdeaFollowsTableScript);
      await this.client.query(createIdeaVersionsTableScript);
      await this.client.query(createIdeaCommentVotesTableScript);
      console.log('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }
}

module.exports = DatabaseConnector;