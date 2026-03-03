import { Trophy, Flame, Star, Target, Zap, Award } from 'lucide-react'

const badges = [
  { name: 'Early Bird', desc: 'Logged vitals before 8 AM for 7 days', icon: <Star className="w-6 h-6" />, earned: true, color: 'yellow' },
  { name: 'Hydration Hero', desc: 'Met water goal for 5 consecutive days', icon: <Zap className="w-6 h-6" />, earned: true, color: 'blue' },
  { name: 'Med Master', desc: '100% medication adherence for 30 days', icon: <Award className="w-6 h-6" />, earned: false, color: 'purple' },
  { name: 'Fitness Freak', desc: '10,000 steps for 7 consecutive days', icon: <Target className="w-6 h-6" />, earned: false, color: 'green' },
  { name: 'Health Scholar', desc: 'Completed all health records', icon: <Trophy className="w-6 h-6" />, earned: true, color: 'orange' },
  { name: 'Streak Legend', desc: '30-day app usage streak', icon: <Flame className="w-6 h-6" />, earned: false, color: 'red' },
]

const challenges = [
  { title: 'Drink 8 glasses of water', progress: 4, total: 8, xp: 50 },
  { title: 'Walk 10,000 steps', progress: 6500, total: 10000, xp: 100 },
  { title: 'Log all 3 meals', progress: 2, total: 3, xp: 30 },
  { title: 'Take all medications', progress: 1, total: 2, xp: 40 },
]

const colorMap: Record<string, string> = {
  yellow: 'from-yellow-400 to-yellow-600', blue: 'from-blue-400 to-blue-600',
  purple: 'from-purple-400 to-purple-600', green: 'from-green-400 to-green-600',
  orange: 'from-orange-400 to-orange-600', red: 'from-red-400 to-red-600',
}

export default function HealthGamification() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Gamification</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Earn badges, maintain streaks, complete daily challenges</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-xs text-gray-500">Day Streak</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">1,250</p>
          <p className="text-xs text-gray-500">Total XP</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 text-center">
          <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">3/6</p>
          <p className="text-xs text-gray-500">Badges Earned</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Challenges</h3>
        <div className="space-y-4">
          {challenges.map((c, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{c.title}</span>
                <span className="text-xs text-blue-600 font-medium">+{c.xp} XP</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(c.progress / c.total) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{c.progress} / {c.total}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {badges.map((b, i) => (
            <div key={i} className={`rounded-2xl p-4 text-center ${b.earned ? '' : 'opacity-40'}`}>
              <div className={`w-14 h-14 bg-gradient-to-br ${colorMap[b.color]} rounded-2xl flex items-center justify-center text-white mx-auto mb-2`}>{b.icon}</div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{b.name}</p>
              <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
              {b.earned && <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">Earned</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
