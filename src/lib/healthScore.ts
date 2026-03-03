export interface DigitalTwinVitals {
  heart_rate?: number | null
  systolic_bp?: number | null
  diastolic_bp?: number | null
  spo2?: number | null
  glucose_level?: number | null
  bmi?: number | null
  temperature?: number | null
}

/**
 * Computes a health score from 0-100 based on vital signs
 * Each vital contributes equally to the final score
 * Returns null if no vitals data exists
 */
export function computeHealthScore(vitals: DigitalTwinVitals): number | null {
  // Check if any vital data exists
  const hasData = Object.values(vitals).some(value => value != null && value !== undefined)
  if (!hasData) return null

  const scores: number[] = []

  // Heart Rate: 60-100 bpm = full marks (100 points)
  if (vitals.heart_rate != null) {
    if (vitals.heart_rate >= 60 && vitals.heart_rate <= 100) {
      scores.push(100)
    } else {
      // Calculate penalty based on deviation from optimal range (70-80 bpm)
      const optimal = 75
      const deviation = Math.abs(vitals.heart_rate - optimal)
      const maxDeviation = 40 // Beyond this, score approaches 0
      const score = Math.max(0, 100 - (deviation / maxDeviation) * 100)
      scores.push(score)
    }
  }

  // Systolic BP: 90-120 mmHg = full, 120-140 = partial, >140 = low
  if (vitals.systolic_bp != null) {
    if (vitals.systolic_bp >= 90 && vitals.systolic_bp <= 120) {
      scores.push(100)
    } else if (vitals.systolic_bp > 120 && vitals.systolic_bp <= 140) {
      // Linear decrease from 100 to 60
      const score = 100 - ((vitals.systolic_bp - 120) / 20) * 40
      scores.push(Math.max(60, score))
    } else if (vitals.systolic_bp > 140) {
      // High BP - low score with further penalties
      const penalty = Math.min((vitals.systolic_bp - 140) / 40, 1)
      scores.push(Math.max(10, 60 - penalty * 50))
    } else {
      // Too low BP (< 90)
      const penalty = (90 - vitals.systolic_bp) / 30
      scores.push(Math.max(20, 100 - penalty * 80))
    }
  }

  // Diastolic BP: 60-80 mmHg = full, 80-90 = partial, >90 = low
  if (vitals.diastolic_bp != null) {
    if (vitals.diastolic_bp >= 60 && vitals.diastolic_bp <= 80) {
      scores.push(100)
    } else if (vitals.diastolic_bp > 80 && vitals.diastolic_bp <= 90) {
      const score = 100 - ((vitals.diastolic_bp - 80) / 10) * 40
      scores.push(Math.max(60, score))
    } else if (vitals.diastolic_bp > 90) {
      const penalty = Math.min((vitals.diastolic_bp - 90) / 20, 1)
      scores.push(Math.max(10, 60 - penalty * 50))
    } else {
      // Too low (< 60)
      const penalty = (60 - vitals.diastolic_bp) / 20
      scores.push(Math.max(20, 100 - penalty * 80))
    }
  }

  // SpO2: >95% = full, 90-95% = partial, <90% = low
  if (vitals.spo2 != null) {
    if (vitals.spo2 >= 95) {
      scores.push(100)
    } else if (vitals.spo2 >= 90) {
      // Linear decrease from 95% to 90%
      const score = 60 + ((vitals.spo2 - 90) / 5) * 40
      scores.push(score)
    } else {
      // Critical low oxygen
      const score = Math.max(0, (vitals.spo2 / 90) * 60)
      scores.push(score)
    }
  }

  // Blood Glucose: 70-100 mg/dL = full, 100-126 = partial, >126 = low
  if (vitals.glucose_level != null) {
    if (vitals.glucose_level >= 70 && vitals.glucose_level <= 100) {
      scores.push(100)
    } else if (vitals.glucose_level > 100 && vitals.glucose_level <= 126) {
      // Pre-diabetic range
      const score = 100 - ((vitals.glucose_level - 100) / 26) * 40
      scores.push(Math.max(60, score))
    } else if (vitals.glucose_level > 126) {
      // Diabetic range
      const penalty = Math.min((vitals.glucose_level - 126) / 74, 1) // Up to 200 mg/dL
      scores.push(Math.max(10, 60 - penalty * 50))
    } else {
      // Hypoglycemic (< 70)
      const penalty = (70 - vitals.glucose_level) / 30
      scores.push(Math.max(10, 100 - penalty * 90))
    }
  }

  // BMI: 18.5-24.9 kg/m² = full, 25-30 = partial, >30 or <18.5 = low
  if (vitals.bmi != null) {
    if (vitals.bmi >= 18.5 && vitals.bmi <= 24.9) {
      scores.push(100)
    } else if (vitals.bmi >= 25 && vitals.bmi <= 30) {
      // Overweight
      const score = 100 - ((vitals.bmi - 24.9) / 5.1) * 40
      scores.push(Math.max(60, score))
    } else if (vitals.bmi > 30) {
      // Obese
      const penalty = Math.min((vitals.bmi - 30) / 20, 1)
      scores.push(Math.max(20, 60 - penalty * 40))
    } else {
      // Underweight (< 18.5)
      const penalty = (18.5 - vitals.bmi) / 8.5 // Down to BMI 10
      scores.push(Math.max(20, 100 - penalty * 80))
    }
  }

  // Temperature: 36.1-37.2°C = full, outside = penalty
  if (vitals.temperature != null) {
    if (vitals.temperature >= 36.1 && vitals.temperature <= 37.2) {
      scores.push(100)
    } else {
      // Calculate deviation from normal range
      const normal = 36.65 // Mid-point of normal range
      const deviation = Math.abs(vitals.temperature - normal)
      const maxDeviation = 3 // ±3°C from normal
      const score = Math.max(20, 100 - (deviation / maxDeviation) * 80)
      scores.push(score)
    }
  }

  // Calculate average score
  if (scores.length === 0) return null
  
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
  return Math.round(averageScore)
}

/**
 * Get health status text based on score
 */
export function getHealthStatus(score: number | null): string {
  if (score === null) return 'No Data'
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 55) return 'Fair'
  return 'Needs Attention'
}

/**
 * Get score color based on value
 */
export function getScoreColor(score: number | null): string {
  if (score === null) return 'text-gray-500'
  if (score >= 85) return 'text-green-500'
  if (score >= 70) return 'text-blue-500'
  if (score >= 55) return 'text-yellow-500'
  return 'text-red-500'
}

/**
 * Get score background gradient based on value
 */
export function getScoreGradient(score: number | null): string {
  if (score === null) return 'from-gray-500 to-gray-400'
  if (score >= 85) return 'from-green-500 to-emerald-400'
  if (score >= 70) return 'from-blue-500 to-cyan-400'
  if (score >= 55) return 'from-yellow-500 to-orange-400'
  return 'from-red-500 to-rose-400'
}
