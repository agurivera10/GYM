'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, BarChart2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DashboardStats } from '@/components/DashboardStats'
import { ProgressChart } from '@/components/ProgressChart'
import { HistoryCalendar } from '@/components/HistoryCalendar'
import { SessionDetailModal } from '@/components/SessionDetailModal'
import { fetchDashboardStats, fetchTrainedDates, fetchSessionDetail, fetchExerciseProgress } from './actions'
import { workoutDays, exerciseDB } from '@/lib/data'

type Tab = 'stats' | 'calendar'

export default function DashboardPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('stats')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Stats
  const [totalSessions, setTotalSessions] = useState(0)
  const [totalVolume, setTotalVolume] = useState(0)

  // Chart
  const [selectedExerciseId, setSelectedExerciseId] = useState('d1-ex1')
  const [progressData, setProgressData] = useState<{ date: string; weight: number }[]>([])

  // Calendar
  const [trainedDays, setTrainedDays] = useState<any[]>([])

  // Session detail modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<{
    sessionId: string
    dayId: string
    date: string
    logs: any[]
  } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      setUserId(data.user.id)
    })
  }, [router])

  useEffect(() => {
    if (!userId) return
    setLoading(true)

    Promise.all([
      fetchDashboardStats(userId),
      fetchTrainedDates(userId),
      fetchExerciseProgress(userId, selectedExerciseId),
    ]).then(([stats, dates, progress]) => {
      setTotalSessions(stats.totalSessions ?? 0)
      setTotalVolume(stats.totalVolume ?? 0)
      setTrainedDays(dates)
      setProgressData(progress)
      setLoading(false)
    })
  }, [userId, selectedExerciseId])

  const handleSelectDay = async (sessionId: string, dayId: string, date: string) => {
    if (!userId) return
    const { logs } = await fetchSessionDetail(sessionId, userId)
    setSelectedSession({ sessionId, dayId, date, logs })
    setModalOpen(true)
  }

  // Flatten all exercises for the selector
  const allExercises = workoutDays.flatMap(d => d.exercises)

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <header className="bg-[#141415]/85 backdrop-blur-md pt-6 pb-4 px-5 border-b border-border-main sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="text-text-muted">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-extrabold text-text-main">Mi Progreso</h1>
          <div className="w-6" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('stats')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
              tab === 'stats'
                ? 'bg-accent/15 text-accent border-accent'
                : 'bg-bg-elevated border-border-main text-text-muted'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Estadísticas
          </button>
          <button
            onClick={() => setTab('calendar')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
              tab === 'calendar'
                ? 'bg-accent/15 text-accent border-accent'
                : 'bg-bg-elevated border-border-main text-text-muted'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Calendario
          </button>
        </div>
      </header>

      <main className="p-5">
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {tab === 'stats' && (
              <>
                <DashboardStats totalSessions={totalSessions} totalVolume={totalVolume} />

                {/* Exercise selector */}
                <div className="mb-4">
                  <p className="text-xs text-text-muted uppercase font-bold mb-2">Ver progreso de ejercicio</p>
                  <select
                    value={selectedExerciseId}
                    onChange={e => setSelectedExerciseId(e.target.value)}
                    className="w-full bg-bg-elevated border border-border-main text-text-main rounded-xl p-3 text-base focus:outline-none focus:border-accent"
                  >
                    {allExercises.map(exId => (
                      <option key={exId} value={exId}>
                        {exerciseDB[exId]?.icon} {exerciseDB[exId]?.title}
                      </option>
                    ))}
                  </select>
                </div>

                <ProgressChart
                  data={progressData}
                  exerciseName={exerciseDB[selectedExerciseId]?.title ?? selectedExerciseId}
                />

                {/* Recent sessions list */}
                <div className="bg-bg-card border border-border-main rounded-2xl p-4">
                  <p className="text-xs text-text-muted uppercase font-bold mb-3">Últimas Sesiones</p>
                  {totalSessions === 0 ? (
                    <p className="text-text-muted text-sm text-center py-4">
                      Todavía no hay sesiones registradas.<br />
                      <span className="text-accent font-bold">¡Empezá a entrenar!</span>
                    </p>
                  ) : (
                    <p className="text-accent text-sm font-bold">{totalSessions} sesiones completadas</p>
                  )}
                </div>
              </>
            )}

            {tab === 'calendar' && (
              <HistoryCalendar
                trainedDays={trainedDays}
                onSelectDay={handleSelectDay}
              />
            )}
          </>
        )}
      </main>

      <SessionDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sessionId={selectedSession?.sessionId ?? null}
        dayId={selectedSession?.dayId ?? null}
        date={selectedSession?.date ?? null}
        logs={selectedSession?.logs ?? []}
      />
    </div>
  )
}
