import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import "./CategoryChart.css";

// Dummy sample data for now
const data = [
  { name: "Tiles", value: 250 },
  { name: "Sanitaryware", value: 150 },
  { name: "Bathroom Fittings", value: 100 },
];

const COLORS = ["#1976d2", "#42a5f5", "#90caf9"];

export default function CategoryChart() {
  return (
    
    <div className="category-chart">
      <h3 className="chart-title">Stock by Category</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="53%"
            label
            outerRadius={110}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={28} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
