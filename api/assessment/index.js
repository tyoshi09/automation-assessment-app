const { CosmosClient } = require('@azure/cosmos');

const endpoint = process.env.COSMOS_DB_ENDPOINT || 'https://business-automation-assess-db.documents.azure.com:443/';
const key = process.env.COSMOS_DB_KEY || '';
const databaseId = 'AssessmentDB';
const containerId = 'AssessmentResults';

const cosmosClient = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const method = req.method;
    
    try {
        switch (method) {
            case 'POST':
                await saveAssessment(context, req);
                break;
            case 'GET':
                if (req.query.companyName) {
                    await getAssessments(context, req);
                } else {
                    await getAllAssessments(context, req);
                }
                break;
            case 'DELETE':
                await deleteAssessment(context, req);
                break;
            default:
                context.res = {
                    status: 405,
                    body: { error: 'Method not allowed' }
                };
        }
    } catch (error) {
        context.log.error('Error:', error);
        context.res = {
            status: 500,
            body: { error: 'Internal server error' }
        };
    }
};

async function saveAssessment(context, req) {
    const assessmentData = req.body;
    
    // IDと作成日時を追加
    const assessmentResult = {
        ...assessmentData,
        id: generateId(),
        createdAt: new Date().toISOString()
    };

    const database = cosmosClient.database(databaseId);
    const container = database.container(containerId);
    
    const { resource: createdItem } = await container.items.create(assessmentResult);
    
    context.res = {
        status: 201,
        body: createdItem
    };
}

async function getAssessments(context, req) {
    const companyName = req.query.companyName;
    
    const database = cosmosClient.database(databaseId);
    const container = database.container(containerId);
    
    const querySpec = {
        query: 'SELECT * FROM c WHERE c.companyName = @companyName ORDER BY c.createdAt DESC',
        parameters: [
            { name: '@companyName', value: companyName }
        ]
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();
    
    context.res = {
        status: 200,
        body: items
    };
}

async function getAllAssessments(context, req) {
    const database = cosmosClient.database(databaseId);
    const container = database.container(containerId);
    
    const querySpec = {
        query: 'SELECT * FROM c ORDER BY c.createdAt DESC'
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();
    
    context.res = {
        status: 200,
        body: items
    };
}

async function deleteAssessment(context, req) {
    const assessmentId = req.params.id;
    const companyName = req.query.companyName;
    
    if (!assessmentId || !companyName) {
        context.res = {
            status: 400,
            body: { error: 'Assessment ID and companyName are required' }
        };
        return;
    }

    const database = cosmosClient.database(databaseId);
    const container = database.container(containerId);
    
    await container.item(assessmentId, companyName).delete();
    
    context.res = {
        status: 204
    };
}

function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}