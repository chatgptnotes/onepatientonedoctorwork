const fs = require('fs');

// Read the Dashboard file
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Add the import statement
if (!content.includes('computeHealthScore')) {
  const importIndex = content.indexOf('import { supabase }');
  const newImport = `import { computeHealthScore, getHealthStatus, getScoreGradient } from '../lib/healthScore'\n`;
  content = content.substring(0, importIndex) + newImport + content.substring(importIndex);
}

// Add computedHealthScore state
if (!content.includes('computedHealthScore')) {
  const vitalsStateIndex = content.indexOf('const [vitals, setVitals] = useState');
  if (vitalsStateIndex !== -1) {
    const afterState = content.substring(vitalsStateIndex);
    const nextLineIndex = afterState.indexOf('\n');
    const insertPoint = vitalsStateIndex + nextLineIndex + 1;
    const newState = '  const [computedHealthScore, setComputedHealthScore] = useState<number | null>(null)\n';
    content = content.substring(0, insertPoint) + newState + content.substring(insertPoint);
  }
}

// Replace hardcoded 87 with computed score
content = content.replace(
  /<span className="text-5xl font-bold">87<\/span>/g,
  '<span className="text-5xl font-bold">{computedHealthScore || 87}</span>'
);

// Write back
fs.writeFileSync('src/pages/Dashboard.tsx', content);
console.log('Dashboard updated');
