import { Watch, Smartphone, Wifi, WifiOff, RefreshCw, Activity, Heart, Footprints } from 'lucide-react'

const devices = [
  { name: 'Apple Watch Series 9', type: 'Smartwatch', icon: <Watch className="w-6 h-6" />, connected: true, lastSync: '2 min ago', metrics: ['Heart Rate', 'Steps', 'SpO2', 'ECG'] },
  { name: 'Fitbit Charge 6', type: 'Fitness Tracker', icon: <Activity className="w-6 h-6" />, connected: false, lastSync: '3 days ago', metrics: ['Steps', 'Sleep', 'Heart Rate'] },
  { name: 'Omron Blood Pressure', type: 'BP Monitor', icon: <Heart className="w-6 h-6" />, connected: true, lastSync: '1 hour ago', metrics: ['Blood Pressure', 'Pulse'] },
  { name: 'Accu-Chek Guide', type: 'Glucometer', icon: <Smartphone className="w-6 h-6" />, connected: false, lastSync: 'Never', metrics: ['Blood Glucose'] },
]

const recentData = [
  { device: 'Apple Watch', metric: 'Heart Rate', value: '72 bpm', time: '2 min ago' },
  { device: 'Apple Watch', metric: 'Steps', value: '6,450', time: '5 min ago' },
  { device: 'Omron BP', metric: 'Blood Pressure', value: '120/78 mmHg', time: '1 hour ago' },
  { device: 'Apple Watch', metric: 'SpO2', value: '98%', time: '15 min ago' },
]

export default function WearableIntegration() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wearable Integration</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Connect your health devices for automatic data sync</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((d, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.connected ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>{d.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{d.name}</p>
                  <p className="text-xs text-gray-500">{d.type}</p>
                </div>
              </div>
              {d.connected ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-gray-400" />}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>Last sync: {d.lastSync}</span>
              <span className={`px-2 py-0.5 rounded-full ${d.connected ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>{d.connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {d.metrics.map((m, j) => <span key={j} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400">{m}</span>)}
            </div>
            <button className={`mt-3 w-full py-2 rounded-xl text-sm font-medium ${d.connected ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              {d.connected ? 'Sync Now' : 'Connect Device'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Synced Data</h3>
        <div className="space-y-2">
          {recentData.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{d.metric}</p>
                <p className="text-xs text-gray-500">{d.device} - {d.time}</p>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white text-sm">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
