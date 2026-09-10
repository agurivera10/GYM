'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, BarChart2, Plus, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DashboardStats } from '@/components/DashboardStats'
import { MuscleGroupBreakdown } from '@/components/MuscleGroupBreakdown'
import { ProgressChart } from '@/components/ProgressChart'
import { HistoryCalendar } from '@/components/HistoryCalendar'
import { SessionDetailModal } from '@/components/SessionDetailModal'
import { LogSessionModal } from '@/components/LogSessionModal'
import {
  fetchDashboardStats,
  fetchTrainedDates,
  fetchSessionDetail,
  fetchExerciseProgress,
  fetchMuscleGroupStats,
  MuscleGroupStat
} from './actions'
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
  const [muscleStats, setMuscleStats] = useState<MuscleGroupStat[]>([])

  // Chart
  const [selectedExerciseId, setSelectedExerciseId] = useState('prensa')
  const [progressData, setProgressData] = useState<{ date: string; weight: number }[]>([])

  // Calendar
  const [trainedDays, setTrainedDays] = useState<any[]>([])

  // Session detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<{
    sessionId: string; dayId: string; date: string; logs: any[]
  } | null>(null)

  // Log session modal
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [logPreselectedDate, setLogPreselectedDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)
    })
  }, [router])

  const loadData = async (uid: string) => {
    setLoading(true)
    const [stats, dates, progress, muscles] = await Promise.all([
      fetchDashboardStats(uid),
      fetchTrainedDates(uid),
      fetchExerciseProgress(uid, selectedExerciseId),
      fetchMuscleGroupStats(uid),
    ])
    setTotalSessions(stats.totalSessions ?? 0)
    setTotalVolume(stats.totalVolume ?? 0)
    setTrainedDays(dates)
    setProgressData(progress)
    setMuscleStats(muscles)
    setLoading(false)
  }

  useEffect(() => {
    if (userId) loadData(userId)
  }, [userId, selectedExerciseId])

  const handleSelectDay = async (sessionId: string, dayId: string, date: string) => {
    if (!userId) return
    const { logs } = await fetchSessionDetail(sessionId, userId)
    setSelectedSession({ sessionId, dayId, date, logs })
    setDetailModalOpen(true)
  }

  const handleSelectEmptyDay = (date: Date) => {
    setLogPreselectedDate(date)
    setLogModalOpen(true)
  }

  const handleLogModalClose = () => {
    setLogModalOpen(false)
    if (userId) loadData(userId)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const allExercises = Array.from(
    new Set(workoutDays.flatMap(d => [...d.exercises, ...(d.alternatives || [])]))
  )

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <header className="bg-[#141415]/85 backdrop-blur-md pt-6 pb-4 px-5 border-b border-border-main sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="text-text-muted hover:text-text-main flex items-center gap-1 text-sm font-semibold">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>
          <h1 className="text-lg font-extrabold text-text-main">Mi Progreso</h1>
          <button
            onClick={handleSignOut}
            className="text-text-muted hover:text-red transition-colors p-1"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('stats')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
              tab === 'stats' ? 'bg-accent/15 text-accent border-accent' : 'bg-bg-elevated border-border-main text-text-muted'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Estadísticas
          </button>
          <button
            onClick={() => setTab('calendar')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
              tab === 'calendar' ? 'bg-accent/15 text-accent border-accent' : 'bg-bg-elevated border-border-main text-text-muted'
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
                {/* Métricas Generales */}
                <DashboardStats totalSessions={totalSessions} totalVolume={totalVolume} />

                {/* Desglose Visual por Grupo Muscular */}
                <MuscleGroupBreakdown stats={muscleStats} />

                {/* Selector de Ejercicio y Gráfico de Progreso */}
                <div className="bg-bg-card border border-border-main rounded-2xl p-4 mb-4 shadow-sm">
                  <p className="text-xs text-text-muted uppercase font-bold mb-2">Progreso por Ejercicio</p>
                  <select
                    value={selectedExerciseId}
                    onChange={e => setSelectedExerciseId(e.target.value)}
                    className="w-full bg-bg-elevated border border-border-main text-text-main rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-accent mb-4"
                  >
                    {allExercises.map(exId => (
                      <option key={exId} value={exId}>
                        {exerciseDB[exId]?.icon} {exerciseDB[exId]?.title || exId}
                      </option>
                    ))}
                  </select>

                  <ProgressChart
                    data={progressData}
                    exerciseName={exerciseDB[selectedExerciseId]?.title ?? selectedExerciseId}
                  />
                </div>
              </>
            )}

            {tab === 'calendar' && (
              <>
                {/* FAB - log past session */}
                <button
                  onClick={() => { setLogPreselectedDate(undefined); setLogModalOpen(true) }}
                  className="fixed bottom-6 right-5 z-50 bg-accent text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-accent/30 hover:scale-105 active:scale-95 transition-all"
                  title="Cargar sesión pasada"
                >
                  <Plus className="w-7 h-7" />
                </button>

                <HistoryCalendar
                  trainedDays={trainedDays}
                  onSelectDay={handleSelectDay}
                  onSelectEmptyDay={handleSelectEmptyDay}
                />

                {trainedDays.length === 0 && (
                  <div className="text-center mt-4">
                    <p className="text-text-muted text-sm">No hay sesiones registradas aún.</p>
                    <button
                      onClick={() => setLogModalOpen(true)}
                      className="text-accent font-bold text-sm mt-2 hover:underline"
                    >
                      + Registrar primera sesión
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <SessionDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        sessionId={selectedSession?.sessionId ?? null}
        dayId={selectedSession?.dayId ?? null}
        date={selectedSession?.date ?? null}
        logs={selectedSession?.logs ?? []}
        userId={userId}
        onSessionUpdated={() => {
          if (userId) loadData(userId)
        }}
      />

      {userId && (
        <LogSessionModal
          isOpen={logModalOpen}
          onClose={handleLogModalClose}
          userId={userId}
          preselectedDate={logPreselectedDate}
        />
      )}
    </div>
  )
}
