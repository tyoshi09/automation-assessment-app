import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { container } from '../cosmosClient';
import { v4 as uuidv4 } from 'uuid';

interface AssessmentResult {
  id: string;
  companyName: string;
  department: string;
  businessName: string;
  totalScore: number;
  knockoutFactors: string[];
  techLevel: 'Lv1:RPA' | 'Lv2:AI+ワークフロー' | 'Lv3:エージェントAI' | '導入困難';
  feasibility: '高' | '中' | '低';
  priority: '高' | '中' | '低';
  recommendedTool: string;
  evaluationDate: string;
  evaluator: string;
  createdAt: string;
}

// POST: 新しい評価結果を保存
export async function saveAssessment(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const assessmentData = await request.json() as AssessmentResult;
    
    // IDと作成日時を追加
    const assessmentResult: AssessmentResult = {
      ...assessmentData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };

    const { resource: createdItem } = await container.items.create(assessmentResult);
    
    return {
      status: 201,
      jsonBody: createdItem
    };
  } catch (error) {
    context.error('Error saving assessment:', error);
    return {
      status: 500,
      jsonBody: { error: 'Failed to save assessment' }
    };
  }
}

// GET: 企業名で評価結果を取得
export async function getAssessments(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const companyName = request.query.get('companyName');
    
    if (!companyName) {
      return {
        status: 400,
        jsonBody: { error: 'companyName query parameter is required' }
      };
    }

    const querySpec = {
      query: 'SELECT * FROM c WHERE c.companyName = @companyName ORDER BY c.createdAt DESC',
      parameters: [
        { name: '@companyName', value: companyName }
      ]
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();
    
    return {
      status: 200,
      jsonBody: items
    };
  } catch (error) {
    context.error('Error getting assessments:', error);
    return {
      status: 500,
      jsonBody: { error: 'Failed to get assessments' }
    };
  }
}

// GET: 全企業の評価結果を取得（統計用）
export async function getAllAssessments(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c.createdAt DESC'
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();
    
    return {
      status: 200,
      jsonBody: items
    };
  } catch (error) {
    context.error('Error getting all assessments:', error);
    return {
      status: 500,
      jsonBody: { error: 'Failed to get all assessments' }
    };
  }
}

// DELETE: 評価結果を削除
export async function deleteAssessment(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const assessmentId = request.params.id;
    const companyName = request.query.get('companyName');
    
    if (!assessmentId || !companyName) {
      return {
        status: 400,
        jsonBody: { error: 'Assessment ID and companyName are required' }
      };
    }

    await container.item(assessmentId, companyName).delete();
    
    return {
      status: 204
    };
  } catch (error) {
    context.error('Error deleting assessment:', error);
    return {
      status: 500,
      jsonBody: { error: 'Failed to delete assessment' }
    };
  }
}

// Azure Functions registration
app.http('saveAssessment', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'assessments',
  handler: saveAssessment
});

app.http('getAssessments', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'assessments',
  handler: getAssessments
});

app.http('getAllAssessments', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'assessments/all',
  handler: getAllAssessments
});

app.http('deleteAssessment', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'assessments/{id}',
  handler: deleteAssessment
});