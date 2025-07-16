import { CosmosClient, Database, Container } from '@azure/cosmos';

const endpoint = process.env.COSMOS_DB_ENDPOINT || '';
const key = process.env.COSMOS_DB_KEY || '';
const databaseId = 'AssessmentDB';
const containerId = 'AssessmentResults';

export const cosmosClient = new CosmosClient({ endpoint, key });
export const database: Database = cosmosClient.database(databaseId);
export const container: Container = database.container(containerId);