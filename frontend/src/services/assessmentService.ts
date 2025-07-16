import { AssessmentResult } from '../types/assessment';

const API_BASE_URL = '/api/assessments';

export const assessmentService = {
  // 評価結果を保存
  async saveAssessment(assessment: AssessmentResult): Promise<AssessmentResult> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assessment),
    });

    if (!response.ok) {
      throw new Error('Failed to save assessment');
    }

    return response.json();
  },

  // 企業名で評価結果を取得
  async getAssessmentsByCompany(companyName: string): Promise<AssessmentResult[]> {
    const response = await fetch(`${API_BASE_URL}?companyName=${encodeURIComponent(companyName)}`);

    if (!response.ok) {
      throw new Error('Failed to get assessments');
    }

    return response.json();
  },

  // 全企業の評価結果を取得（統計用）
  async getAllAssessments(): Promise<AssessmentResult[]> {
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error('Failed to get all assessments');
    }

    return response.json();
  },

  // 評価結果を削除
  async deleteAssessment(id: string, companyName: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}?companyName=${encodeURIComponent(companyName)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete assessment');
    }
  },

  // 企業統計を取得
  async getCompanyStatistics(companyName: string) {
    const assessments = await this.getAssessmentsByCompany(companyName);
    
    if (assessments.length === 0) {
      return null;
    }

    const techLevelCounts = assessments.reduce((acc, assessment) => {
      acc[assessment.techLevel] = (acc[assessment.techLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const feasibilityCounts = assessments.reduce((acc, assessment) => {
      acc[assessment.feasibility] = (acc[assessment.feasibility] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageScore = assessments.reduce((sum, assessment) => sum + assessment.totalScore, 0) / assessments.length;

    return {
      totalAssessments: assessments.length,
      averageScore: Math.round(averageScore * 10) / 10,
      techLevelDistribution: techLevelCounts,
      feasibilityDistribution: feasibilityCounts,
      recentAssessments: assessments.slice(0, 10),
    };
  },

  // 業界統計を取得
  async getIndustryStatistics() {
    const allAssessments = await this.getAllAssessments();
    
    if (allAssessments.length === 0) {
      return null;
    }

    const companyGroups = allAssessments.reduce((acc, assessment) => {
      if (!acc[assessment.companyName]) {
        acc[assessment.companyName] = [];
      }
      acc[assessment.companyName].push(assessment);
      return acc;
    }, {} as Record<string, AssessmentResult[]>);

    const companiesCount = Object.keys(companyGroups).length;
    const totalAssessments = allAssessments.length;
    const averageScore = allAssessments.reduce((sum, assessment) => sum + assessment.totalScore, 0) / totalAssessments;

    const techLevelCounts = allAssessments.reduce((acc, assessment) => {
      acc[assessment.techLevel] = (acc[assessment.techLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const feasibilityCounts = allAssessments.reduce((acc, assessment) => {
      acc[assessment.feasibility] = (acc[assessment.feasibility] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      companiesCount,
      totalAssessments,
      averageScore: Math.round(averageScore * 10) / 10,
      techLevelDistribution: techLevelCounts,
      feasibilityDistribution: feasibilityCounts,
      topCompanies: Object.entries(companyGroups)
        .map(([companyName, assessments]) => ({
          companyName,
          assessmentCount: assessments.length,
          averageScore: Math.round((assessments.reduce((sum, a) => sum + a.totalScore, 0) / assessments.length) * 10) / 10,
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 10),
    };
  }
};