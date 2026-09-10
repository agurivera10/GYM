/**
 * Utilidades de entrenamiento y explicaciones en español sencillo para el usuario
 */

// Estimador de 1RM (Fórmula de Epley)
// 1RM = Peso * (1 + Reps / 30)
export function calculate1RM(weight: number, reps: number): number {
  if (!weight || !reps || reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

// Glosario de términos para principiantes
export const GLOSARIO_FITNESS = {
  PR: {
    sigla: "PR (Personal Record)",
    titulo: "Récord Personal",
    descripcion: "Es tu mejor marca histórica en este ejercicio. Si levantás más kilos que nunca antes, ¡rompiste un PR!",
    ejemplo: "Si tu récord en Press de Pecho era 60 kg y hoy levantás 62.5 kg, lograste un PR."
  },
  RM1: {
    sigla: "1RM (Una Repetición Máxima)",
    titulo: "Fuerza Máxima Teórica",
    descripcion: "Es el peso máximo que podrías levantar una sola vez antes de quedarte sin fuerza. La app lo calcula automáticamente con una fórmula matemática para que no tengas que arriesgarte a levantar pesos peligrosos.",
    ejemplo: "Si hiciste 8 repeticiones con 70 kg, tu 1RM estimado es de aproximadamente 89 kg."
  },
  SOBRECARGA: {
    sigla: "Sobrecarga Progresiva",
    titulo: "La Regla de Oro del Progreso",
    descripcion: "Para que el músculo crezca o ganes tono y fuerza, cada semana tenés que exigirle un poquito más: o le agregás 1 kilo, o hacés 1 repetición más que la semana pasada.",
    ejemplo: "Semana 1: 50 kg × 10 reps. Semana 2: 50 kg × 11 reps (o 52 kg × 10 reps)."
  },
  VOLUMEN: {
    sigla: "Volumen de Carga",
    titulo: "Trabajo Total Realizado",
    descripcion: "Es la multiplicación de Peso × Repeticiones × Series. Mide cuánto peso total moviste en total durante tu sesión.",
    ejemplo: "3 series de 10 repeticiones con 50 kg = 1.500 kg (1.5 toneladas) de volumen."
  }
}
