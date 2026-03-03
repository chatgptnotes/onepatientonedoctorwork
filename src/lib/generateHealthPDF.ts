import jsPDF from 'jspdf'
import type { Profile, DigitalTwin, HealthRecord, Medication, Allergy, Immunization } from '../types/database'

interface HealthData {
  profile: Profile
  digitalTwin: DigitalTwin
  healthRecords?: HealthRecord[]
  medications?: Medication[]
  allergies?: Allergy[]
  immunizations?: Immunization[]
  healthScore: number
}

export function generateHealthPDF(data: HealthData): void {
  const doc = new jsPDF()
  const margin = 20
  let yPosition = margin

  // Header
  doc.setFillColor(59, 130, 246)
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Health Profile Report', margin, 25)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('1Patient1Doctor Digital Health Platform', margin, 35)

  yPosition = 60

  // Patient Info
  doc.setTextColor('#111827')
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Patient Information', margin, yPosition)
  yPosition += 15

  const today = new Date()
  const birthDate = data.profile.date_of_birth ? new Date(data.profile.date_of_birth) : null
  const age = birthDate ? today.getFullYear() - birthDate.getFullYear() : 'N/A'

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Name: ${data.profile.full_name || 'Not provided'}`, margin, yPosition)
  yPosition += 10
  doc.text(`Age: ${age} years`, margin, yPosition)
  yPosition += 10
  doc.text(`Gender: ${data.profile.gender?.charAt(0).toUpperCase()}${data.profile.gender?.slice(1)} || 'Not specified'}`, margin, yPosition)
  yPosition += 10
  doc.text(`Blood Group: ${data.profile.blood_group || 'Not specified'}`, margin, yPosition)
  yPosition += 20

  // Health Score
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Health Score', margin, yPosition)
  yPosition += 15

  doc.setFontSize(12)
  doc.text(`Overall Health Score: ${data.healthScore}/100`, margin, yPosition)
  yPosition += 10
  
  const status = data.healthScore >= 80 ? 'Excellent' : data.healthScore >= 60 ? 'Good' : 'Needs Attention'
  doc.text(`Status: ${status}`, margin, yPosition)
  yPosition += 20

  // Current Vitals
  if (data.digitalTwin) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Current Vitals', margin, yPosition)
    yPosition += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const vitals = [
      { label: 'Height', value: data.digitalTwin.height_cm, unit: 'cm' },
      { label: 'Weight', value: data.digitalTwin.weight_kg, unit: 'kg' },
      { label: 'BMI', value: data.digitalTwin.bmi, unit: 'kg/m²' },
      { label: 'Systolic BP', value: data.digitalTwin.systolic_bp, unit: 'mmHg' },
      { label: 'Diastolic BP', value: data.digitalTwin.diastolic_bp, unit: 'mmHg' },
      { label: 'Heart Rate', value: data.digitalTwin.heart_rate, unit: 'bpm' },
      { label: 'Blood Glucose', value: data.digitalTwin.glucose_level, unit: 'mg/dL' },
      { label: 'SpO2', value: data.digitalTwin.spo2, unit: '%' },
      { label: 'Temperature', value: data.digitalTwin.temperature, unit: '°C' },
    ]

    vitals.forEach(vital => {
      doc.text(`${vital.label}: ${vital.value || 'N/A'} ${vital.value ? vital.unit : ''}`, margin, yPosition)
      yPosition += 8
    })
    yPosition += 10
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.setTextColor('#6b7280')
  doc.setFont('helvetica', 'normal')
  doc.text(
    `Generated on ${today.toLocaleDateString()} via onepatientonedoctor.work`,
    margin,
    pageHeight - 20
  )
  doc.text(
    'Disclaimer: This report is for informational purposes only. Consult a healthcare provider for medical decisions.',
    margin,
    pageHeight - 10
  )

  // Save the PDF
  const fileName = `health-report-${data.profile.full_name?.replace(/\s+/g, '-') || 'patient'}-${today.toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}
