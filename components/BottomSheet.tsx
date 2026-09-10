'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, PlayCircle, ShieldAlert, CheckCircle2, Target } from 'lucide-react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  exercise: any
}

export function BottomSheet({ isOpen, onClose, exercise }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full max-h-[90vh] bg-bg-elevated rounded-t-3xl z-[101] flex flex-col"
          >
            <div className="w-10 h-1.5 bg-[#3A3A3C] rounded-full mx-auto my-3 shrink-0" />
            
            {exercise && (
              <>
                <div className="px-5 pb-4 border-b border-border-main flex justify-between items-center shrink-0">
                  <div className="text-lg font-extrabold text-white flex items-center gap-2">
                    <span className="text-xl bg-[#2C2C2E] w-8 h-8 flex items-center justify-center rounded-lg">{exercise.icon}</span>
                    <span className="truncate max-w-[240px]">{exercise.title}</span>
                  </div>
                  <button onClick={onClose} className="bg-[#2C2C2E] text-text-muted w-8 h-8 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto pb-[max(40px,env(safe-area-inset-bottom))] flex flex-col gap-5">
                  {/* Tarjeta de Guía Visual Externa (MuscleWiki / Guía) */}
                  {exercise.guideUrl && (
                    <div className="bg-gradient-to-br from-[#1C1C1E] to-[#252528] border border-border-main/80 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-accent/15 w-9 h-9 rounded-xl flex items-center justify-center text-accent shrink-0">
                          <PlayCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-text-main">Animación y Mapa Muscular</p>
                          <p className="text-[11px] text-text-muted">Demostración en video/3D paso a paso</p>
                        </div>
                      </div>

                      <a
                        href={exercise.guideUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-accent text-black font-extrabold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                      >
                        <span>Abrir Guía Visual Completa</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Dónde se siente */}
                  <div className="bg-bg-card border border-border-main rounded-2xl p-4">
                    <h4 className="text-xs text-blue mb-1.5 uppercase flex items-center gap-1.5 font-extrabold">
                      <Target className="w-4 h-4" />
                      <span>Dónde se siente</span>
                    </h4>
                    <p className="text-sm text-[#E5E5EA] font-medium leading-relaxed">{exercise.focus}</p>
                  </div>

                  {/* Paso a paso */}
                  <div className="bg-bg-card border border-border-main rounded-2xl p-4">
                    <h4 className="text-xs text-accent mb-2.5 uppercase flex items-center gap-1.5 font-extrabold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Técnica Paso a Paso</span>
                    </h4>
                    <ul className="list-none space-y-2.5">
                      {exercise.tech.map((t: string, i: number) => (
                        <li key={i} className="text-xs text-[#D1D1D6] pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-accent before:text-lg before:leading-none">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Evitá esto */}
                  <div className="bg-red/10 border border-red/30 rounded-2xl p-4">
                    <h4 className="text-xs text-red mb-1.5 uppercase flex items-center gap-1.5 font-extrabold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Evitá esto (Errores comunes)</span>
                    </h4>
                    <p className="text-xs text-[#FF857F] leading-relaxed">{exercise.error}</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
