import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { AnalyticsStats } from "../api";
import { useTranslation } from "react-i18next";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface Props {
  stats: AnalyticsStats;
}

export const AnalyticsCharts = ({ stats }: Props) => {
  const { t } = useTranslation();
  const ageData = Object.entries(stats.age_group_counts).map(([name, value]) => ({ name: t(`options.${name}`) || name, value }));
  const genderData = Object.entries(stats.gender_counts).map(([name, value]) => ({ name: t(`options.${name}`) || name, value }));
  const conditionData = Object.entries(stats.condition_counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // Top 5
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Age Group Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('admin.ageDemographics')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name={t('admin.patients')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gender Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('admin.genderDistribution')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Conditions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('admin.topConditions')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conditionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name={t('admin.diagnoses')} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
