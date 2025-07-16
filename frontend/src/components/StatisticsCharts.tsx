import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface StatisticsChartsProps {
  techLevelDistribution: Record<string, number>;
  feasibilityDistribution: Record<string, number>;
  totalAssessments: number;
}

const StatisticsCharts: React.FC<StatisticsChartsProps> = ({
  techLevelDistribution,
  feasibilityDistribution,
  totalAssessments,
}) => {
  const techLevelColors = {
    'Lv1:RPA': '#28a745',
    'Lv2:AI+ワークフロー': '#fd7e14',
    'Lv3:エージェントAI': '#6f42c1',
    '導入困難': '#dc3545',
  };

  const feasibilityColors = {
    '高': '#28a745',
    '中': '#ffc107',
    '低': '#dc3545',
  };

  const techLevelData = {
    labels: Object.keys(techLevelDistribution),
    datasets: [
      {
        data: Object.values(techLevelDistribution),
        backgroundColor: Object.keys(techLevelDistribution).map(
          (level) => techLevelColors[level as keyof typeof techLevelColors] || '#6c757d'
        ),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const feasibilityData = {
    labels: Object.keys(feasibilityDistribution),
    datasets: [
      {
        label: '評価件数',
        data: Object.values(feasibilityDistribution),
        backgroundColor: Object.keys(feasibilityDistribution).map(
          (level) => feasibilityColors[level as keyof typeof feasibilityColors] || '#6c757d'
        ),
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const percentage = ((context.parsed / totalAssessments) * 100).toFixed(1);
            return `${context.label}: ${context.parsed}件 (${percentage}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const percentage = ((context.parsed.y / totalAssessments) * 100).toFixed(1);
            return `${context.parsed.y}件 (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="statistics-charts">
      <div className="chart-container">
        <h4>技術レベル分布（円グラフ）</h4>
        <div className="chart-wrapper">
          <Pie data={techLevelData} options={pieOptions} />
        </div>
      </div>

      <div className="chart-container">
        <h4>導入可能性分布（棒グラフ）</h4>
        <div className="chart-wrapper">
          <Bar data={feasibilityData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsCharts;