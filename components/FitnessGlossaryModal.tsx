'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BookOpen, Trophy, Dumbbell, Zap, TrendingUp } from 'lucide-react'
import { GLOSARIO_FITNESS } from '@/lib/fitness'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialTerm?: 'PR' | 'RM1' | 'SOBRECARGA' | 'VOLUMEN'
}

export function FitnessGlossaryModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 w-full max-h-[85vh] bg-bg-elevated rounded-t-3xl z-[111] flex flex-col"
          >
            <div className="w-10 h-1.5 bg-[#3A3A3C] rounded-full mx-auto my-3 shrink-0" />

            <div className="px-5 pb-4 border-b border-border-main flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-extrabold text-text-main">Guía para Principiantes</h3>
              </div>
              <button
                onClick={onClose}
                className="bg-[#2C2C2E] text-text-muted w-8 h-8 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 pb-10 flex flex-col gap-4">
              <p className="text-sm text-text-muted">
                En el gimnasio hay muchas siglas y términos raros. Acá te explicamos qué significa cada uno de forma fácil:
              </p>

              {/* PR */}
              <div className="bg-bg-card border border-border-main rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-accent font-extrabold text-base">
                  <Trophy className="w-5 h-5 text-[#FFD700]" />
                  <span>{GLOSARIO_FITNESS.PR.sigla}</span>
                </div>
                <p className="text-sm text-text-main font-semibold">{GLOSARIO_FITNESS.PR.titulo}</p>
                <p className="text-xs text-text-muted leading-relaxed">{GLOSARIO_FITNESS.PR.descripcion}</p>
                <div className="bg-bg-elevated p-2.5 rounded-xl border border-border-main/50 text-[11px] text-text-muted">
                  💡 <span className="text-text-main font-bold">Ejemplo:</span> {GLOSARIO_FITNESS.PR.ejemplo}
                </div>
              </div>

              {/* 1RM */}
              <div className="bg-bg-card border border-border-main rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-blue font-extrabold text-base">
                  <Dumbbell className="w-5 h-5 text-blue" />
                  <span>{GLOSARIO_FITNESS.RM1.sigla}</span>
                </div>
                <p className="text-sm text-text-main font-semibold">{GLOSARIO_FITNESS.RM1.titulo}</p>
                <p className="text-xs text-text-muted leading-relaxed">{GLOSARIO_FITNESS.RM1.descripcion}</p>
                <div className="bg-bg-elevated p-2.5 rounded-xl border border-border-main/50 text-[11px] text-text-muted">
                  💡 <span className="text-text-main font-bold">Ejemplo:</span> {GLOSARIO_FITNESS.RM1.ejemplo}
                </div>
              </div>

              {/* Sobrecarga Progresiva */}
              <div className="bg-bg-card border border-border-main rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-400 font-extrabold text-base">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span>{GLOSARIO_FITNESS.SOBRECARGA.sigla}</span>
                </div>
                <p className="text-sm text-text-main font-semibold">{GLOSARIO_FITNESS.SOBRECARGA.titulo}</p>
                <p className="text-xs text-text-muted leading-relaxed">{GLOSARIO_FITNESS.SOBRECARGA.descripcion}</p>
                <div className="bg-bg-elevated p-2.5 rounded-xl border border-border-main/50 text-[11px] text-text-muted">
                  💡 <span className="text-text-main font-bold">Ejemplo:</span> {GLOSARIO_FITNESS.SOBRECARGA.ejemplo}
                </div>
              </div>

              {/* Volumen */}
              <div className="bg-bg-card border border-border-main rounded-2xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-400 font-extrabold text-base">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>{GLOSARIO_FITNESS.VOLUMEN.sigla}</span>
                </div>
                <p className="text-sm text-text-main font-semibold">{GLOSARIO_FITNESS.VOLUMEN.titulo}</p>
                <p className="text-xs text-text-muted leading-relaxed">{GLOSARIO_FITNESS.VOLUMEN.descripcion}</p>
                <div className="bg-bg-elevated p-2.5 rounded-xl border border-border-main/50 text-[11px] text-text-muted">
                  💡 <span className="text-text-main font-bold">Ejemplo:</span> {GLOSARIO_FITNESS.VOLUMEN.ejemplo}
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
