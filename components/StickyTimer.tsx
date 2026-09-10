'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Timer } from 'lucide-react'

export function StickyTimer() {
  const [timeLeft, setTimeLeft] = useState(90)
  const [timerDuration, setTimerDuration] = useState(90)
  const [isRunning, setIsRunning] = useState(false)
  const [progressWidth, setProgressWidth] = useState(0)

  useEffect(() => {
    const handleStartTimer = () => {
      startRest(timerDuration)
    }
    window.addEventListener('start-rest-timer', handleStartTimer)
    return () => window.removeEventListener('start-rest-timer', handleStartTimer)
  }, [timerDuration])

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const beep = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = 600
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    } catch (e) {
        console.error(e)
    }
  }

  const startRest = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(seconds)
    setTimerDuration(seconds)
    setIsRunning(true)
    setProgressWidth(100)
    
    setTimeout(() => {
      setProgressWidth(0)
    }, 50)

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsRunning(false)
          beep()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const toggleTimer = () => {
    if (isRunning) {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsRunning(false)
    } else {
      startRest(timerDuration)
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1c1c1e]/95 backdrop-blur-md border-t border-border-main p-4 flex items-center justify-between z-40 pb-[max(16px,env(safe-area-inset-bottom))]">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent">
        <div 
          className="h-full bg-accent"
          style={{
            width: `${progressWidth}%`,
            transition: isRunning ? `width ${timerDuration}s linear` : 'none'
          }}
        />
      </div>
      
      <div className="flex items-center gap-2.5 text-2xl font-extrabold tabular-nums cursor-pointer text-text-main" onClick={toggleTimer}>
        <Timer className="w-5 h-5 text-accent fill-accent/20" />
        <span>{timeLeft === 0 && !isRunning ? '¡DALE!' : formatTime(timeLeft)}</span>
      </div>

      <div className="flex gap-2">
        {[60, 90, 120].map(sec => (
          <button
            key={sec}
            onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current)
                setIsRunning(false)
                setTimerDuration(sec)
                setTimeLeft(sec)
                setProgressWidth(0)
            }}
            className={`px-3 py-2 rounded-lg text-[13px] font-semibold border ${
              timerDuration === sec
                ? 'bg-accent/15 text-accent border-accent'
                : 'bg-bg-card border-border-main text-text-main'
            }`}
          >
            {sec}s
          </button>
        ))}
      </div>
    </div>
  )
}
