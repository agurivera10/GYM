'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

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
                    {exercise.title}
                  </div>
                  <button onClick={onClose} className="bg-[#2C2C2E] text-text-muted w-8 h-8 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto pb-[max(40px,env(safe-area-inset-bottom))]">
                  <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl mb-2 border border-border-main bg-black">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-none"
                      src={`https://www.youtube.com/embed/${exercise.ytId}?controls=1&modestbranding=1&playsinline=1&rel=0`}
                      allowFullScreen
                    />
                  </div>
                  <a 
                    className="block text-center text-blue text-xs font-semibold no-underline mb-5" 
                    href={`https://www.youtube.com/watch?v=${exercise.ytId}`} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    Abrir en YouTube (Si el video falla)
                  </a>

                  <div className="mb-5">
                    <h4 className="text-sm text-blue mb-2 uppercase flex items-center gap-1.5 font-bold">🎯 Dónde se siente</h4>
                    <p className="text-sm text-[#D1D1D6]">{exercise.focus}</p>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-sm text-accent mb-2 uppercase flex items-center gap-1.5 font-bold">✅ Paso a Paso</h4>
                    <ul className="list-none space-y-2">
                      {exercise.tech.map((t: string, i: number) => (
                        <li key={i} className="text-sm text-[#D1D1D6] pl-5 relative before:content-['•'] before:absolute before:left-0 before:text-text-muted before:text-lg before:leading-none">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-sm text-red mb-2 uppercase flex items-center gap-1.5 font-bold">❌ Evitá esto</h4>
                    <p className="text-sm text-[#D1D1D6]">{exercise.error}</p>
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
