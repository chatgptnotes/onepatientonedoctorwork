import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart, Brain, Shield, Zap, Users, Activity,
  CheckCircle, ArrowRight, Star, Globe, Lock, FileText
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI-Powered Digital Twin',
    description: 'A real-time virtual model of your health—genomics, vitals, immunizations, and more—updated continuously.',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Personalized AI Doctor',
    description: 'Context-aware AI reads your Digital Twin before responding. Multilingual support including Hindi, Telugu, Tamil.',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'ABHA Integration',
    description: "Connect your Ayushman Bharat Health Account for unified health ID verification and seamless data access.",
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'DPDP & HIPAA Compliant',
    description: 'End-to-end encryption, consent manager workflows, and strict adherence to Indian data protection laws.',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'FHIR Interoperability',
    description: 'Your health data in universal FHIR format—readable by any hospital, clinic, or health system in India.',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Offline-First Design',
    description: 'Built for rural India with spotty connectivity. Works offline and syncs when connected.',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  },
]

const stats = [
  { value: '1.4B+', label: 'Indians can benefit' },
  { value: '100+', label: 'Supported languages' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: 'ABHA', label: 'Health ID integrated' },
]

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Cardiologist, AIIMS Delhi',
    content: 'This platform has transformed how I monitor patients remotely. The Digital Twin gives me real-time insights I never had before.',
    rating: 5,
  },
  {
    name: 'Rajan Kumar',
    role: 'Patient from Bihar',
    content: 'Ab mujhe bar bar hospital nahi jana padta. AI doctor mere sawal ka jawab deta hai Hindi mein!',
    rating: 5,
  },
  {
    name: 'Dr. Meenakshi Pillai',
    role: 'General Physician, Chennai',
    content: 'ABHA integration is seamless. My patients can finally carry their entire health history on their phone.',
    rating: 5,
  },
]

export default function Landing() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-lg">1Patient1Doctor</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Pricing</a>
              <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Sign In</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Get Started Free</Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/signup" className="md:hidden bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              India's First AI-Powered Digital Twin Healthcare Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              One Patient.{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                One Doctor.
              </span>
              <br />Infinite Health Intelligence.
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
              Your personalized AI healthcare companion powered by a Digital Twin—a living model of your health updated in real-time with every heartbeat, lab report, and doctor visit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                Create Your Digital Twin <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Healthcare Ecosystem
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built for India—from metro cities to the remotest villages—with privacy-first architecture.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Twin Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">Digital Twin Technology</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6">
                Your Health, Mirrored in Real-Time
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                A Digital Twin is a virtual model of you—continuously updated with every lab report, vital sign, medication, and doctor visit. Your AI Doctor reads this twin before every consultation.
              </p>
              <ul className="space-y-4">
                {[
                  'Genomics & genetic predisposition mapping',
                  'Real-time vitals monitoring (BP, SpO2, glucose)',
                  'Complete immunization & vaccination history',
                  'Allergy registry with severity tracking',
                  'Health score with predictive risk factors',
                  'FHIR-compliant data export',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600/10 to-cyan-500/10 dark:from-blue-600/20 dark:to-cyan-500/20 rounded-3xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Health Score', value: '87/100', icon: <Activity className="w-4 h-4" />, color: 'text-green-500' },
                    { label: 'Heart Rate', value: '72 bpm', icon: <Heart className="w-4 h-4" />, color: 'text-red-500' },
                    { label: 'Blood Pressure', value: '120/80', icon: <Zap className="w-4 h-4" />, color: 'text-blue-500' },
                    { label: 'Vaccinations', value: '14/15', icon: <Shield className="w-4 h-4" />, color: 'text-purple-500' },
                    { label: 'Active Meds', value: '3', icon: <FileText className="w-4 h-4" />, color: 'text-orange-500' },
                    { label: 'Next Checkup', value: '15 days', icon: <Users className="w-4 h-4" />, color: 'text-cyan-500' },
                  ].map(item => (
                    <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                      <div className={`flex items-center gap-2 ${item.color} mb-1`}>
                        {item.icon}
                        <span className="text-xs font-medium">{item.label}</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">AI Risk Assessment</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full" style={{ width: '87%' }} />
                    </div>
                    <span className="text-sm font-semibold text-green-500">Low Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trusted by Patients & Doctors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">"{t.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 dark:text-gray-400">Affordable healthcare intelligence for every Indian</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '₹0',
                period: 'forever',
                description: 'For individuals getting started',
                features: ['Digital Twin (basic)', '5 health records', 'AI Doctor (10 queries/month)', 'ABHA ID linking', 'Hindi support'],
                cta: 'Get Started Free',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '₹299',
                period: 'per month',
                description: 'For active health management',
                features: ['Digital Twin (full)', 'Unlimited health records', 'AI Doctor (unlimited)', 'All 10+ languages', 'Family profiles (5)', 'PDF/Excel export', 'Priority support'],
                cta: 'Start Pro Trial',
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'per hospital/clinic',
                description: 'For healthcare organizations',
                features: ['Everything in Pro', 'Unlimited patients', 'EMR/HIS integration', 'FHIR API access', 'Custom AI models', 'Dedicated support', 'On-premise option'],
                cta: 'Contact Sales',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border ${
                  plan.highlight
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-500/25 relative'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-lg font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                <div className="mb-2">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{plan.price}</span>
                  {plan.period !== 'forever' && <span className={`text-sm ml-1 ${plan.highlight ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>/{plan.period}</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-blue-200' : 'text-gray-600 dark:text-gray-400'}`}>{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-blue-200' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-blue-100' : 'text-gray-700 dark:text-gray-300'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Health Journey Starts Here
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join millions of Indians taking control of their health with AI-powered Digital Twin technology.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            Create Your Digital Twin Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">1Patient1Doctor</span>
            </div>
            <p className="text-sm">© 2026 onepatientonedoctor.work · DPDP Compliant · HIPAA Standard · ABHA Integrated</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
