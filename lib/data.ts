export interface ExerciseInfo {
  icon: string
  title: string
  ytId: string
  tech: string[]
  error: string
  focus: string
  target: string
  reps: string
  ref: string
  sets: number
}

export const exerciseDB: Record<string, ExerciseInfo> = {
  // LUNES - PIERNAS / GLÚTEOS
  'prensa': {
    icon: '🦵',
    title: 'Prensa (Leg Press)',
    ytId: 'IZxyjW7OSvc',
    target: 'Cuádriceps y Glúteos',
    reps: '10-12',
    ref: '80-100 kg',
    sets: 3,
    tech: [
      'Apoyá toda la planta del pie en la plataforma a la altura de hombros.',
      'No extiendas del todo la rodilla (evitá trabar o bloquear).',
      'Bajá hasta formar ~90° de rodilla sin despegar la lumbar del respaldo.',
      'Empujá con todo el pie, no solo con la punta.'
    ],
    error: 'Despegar la cintura del respaldo o trabar las rodillas arriba.',
    focus: 'Sentir la fuerza en cuádriceps y glúteos de forma constante.'
  },
  'hip-thrust-maq': {
    icon: '🍑',
    title: 'Hip Thrust en Máquina',
    ytId: 'SEdqd1n0cvg',
    target: 'Glúteos',
    reps: '10-12',
    ref: '30-45 kg',
    sets: 3,
    tech: [
      'Apoyá la parte superior de la espalda (omóplatos) en el respaldo.',
      'Pies firmes, un poco adelantados respecto a las rodillas.',
      'Subí apretando el glúteo, sin arquear la zona lumbar.',
      'Hacé una pausa de 1 segundo arriba apretando fuerte.',
      'Mentón metido mirando al frente (no hacia el techo).'
    ],
    error: 'Arquear la columna lumbar en vez de empujar con la cadera.',
    focus: 'Contracción máxima del glúteo arriba.'
  },
  'curl-femoral-acostado': {
    icon: '🪝',
    title: 'Curl Femoral Acostado',
    ytId: 'F488k67BTNo',
    target: 'Isquiotibiales (Atrás del muslo)',
    reps: '10-12',
    ref: '20-30 kg',
    sets: 3,
    tech: [
      'Rodillo ajustado justo arriba del tobillo.',
      'Cadera pegada al banco durante todo el movimiento.',
      'Flexioná llevando el talón hacia el glúteo sin tirones.',
      'Controlá la bajada lenta, no sueltes el peso de golpe.'
    ],
    error: 'Levantar la cadera del banco o tirar con la cintura.',
    focus: 'Sentir el isquiotibial trabajando en la parte trasera del muslo.'
  },
  'abductores-maq': {
    icon: '🛸',
    title: 'Abductores en Máquina',
    ytId: 'FnbJCpG78tQ',
    target: 'Glúteo Medio (Lateral)',
    reps: '12-15',
    ref: '25-35 kg',
    sets: 3,
    tech: [
      'Espalda bien apoyada en el respaldo.',
      'Rodillas alineadas con las almohadillas.',
      'Abrí controlado sin usar impulso.',
      'Sentí la contracción en el lateral del glúteo.',
      'Volvé controlado sin dejar caer las placas.'
    ],
    error: 'Usar impulso del torso o hacer rebotes rápidos.',
    focus: 'Apertura amplia apretando el glúteo lateral 1 segundo.'
  },
  'gemelos-prensa': {
    icon: '🏔️',
    title: 'Gemelos en Prensa',
    ytId: 'Kteh7u1-s8k',
    target: 'Pantorrillas',
    reps: '15',
    ref: '70-90 kg',
    sets: 3,
    tech: [
      'Solo la punta del pie apoyada en la plataforma, talón libre.',
      'Extendé el tobillo empujando fuerte con la punta.',
      'Bajá controlado sintiendo el estiramiento completo.',
      'Mantené las rodillas firmes sin trabarlas.',
      'Rango completo: bajada y subida totales.'
    ],
    error: 'Rebotar rápido sin estirar abajo ni contraer arriba.',
    focus: 'Estiramiento profundo abajo y pico de puntas arriba.'
  },

  // MARTES - TIRÓN (ESPALDA / BÍCEPS)
  'jalon-pecho': {
    icon: '🦍',
    title: 'Jalón al Pecho (Polea)',
    ytId: 'EUIri47Epcg',
    target: 'Dorsales (Espalda)',
    reps: '10-12',
    ref: '30-40 kg',
    sets: 3,
    tech: [
      'Agarre un poco más ancho que el ancho de hombros.',
      'Pecho arriba, ligera inclinación del torso hacia atrás.',
      'Llevá la barra a la parte superior del pecho, nunca tras nuca.',
      'Contraé la espalda y bajá los codos antes de tirar con brazos.',
      'Controlá la subida, no dejes que el peso tire de vos.'
    ],
    error: 'Tirar la barra detrás del cuello o hamacar el torso.',
    focus: 'Clavar los codos hacia abajo y juntar las alas de la espalda.'
  },
  'remo-maq-sentado': {
    icon: '🛶',
    title: 'Remo en Máquina Sentado',
    ytId: 'H75im9fAUMc',
    target: 'Espalda Media',
    reps: '10-12',
    ref: '25-35 kg',
    sets: 3,
    tech: [
      'Pecho apoyado en el cojín o espalda bien recta.',
      'Tirá llevando los codos hacia atrás cerca del cuerpo.',
      'Apretá los omóplatos al final del tirón.',
      'Evitá usar impulso con todo el torso.',
      'Volvé controlado estirando bien adelante.'
    ],
    error: 'Despegar el pecho del apoyo o tironear con la cintura.',
    focus: 'Juntar las escápulas atrás como agarrando una moneda.'
  },
  'remo-alto-polea': {
    icon: '🚣‍♂️',
    title: 'Remo Alto en Polea',
    ytId: 'GZbfZ033f74',
    target: 'Espalda Alta y Deltoides Posterior',
    reps: '10-12',
    ref: '25-30 kg',
    sets: 3,
    tech: [
      'Codos altos, a la altura de los hombros.',
      'Tirá llevando la barra o cuerda hacia la parte alta del pecho.',
      'Apretá los omóplatos juntos al final del recorrido.',
      'Mantené el torso estable sin balancear.',
      'Controlá la fase de vuelta.'
    ],
    error: 'Bajar los codos o impulsarse hacia atrás con la cadera.',
    focus: 'Espalda alta y parte posterior de hombros.'
  },
  'curl-biceps-polea': {
    icon: '🦾',
    title: 'Curl de Bíceps en Polea',
    ytId: 'kwG2ipFRgfo',
    target: 'Bíceps',
    reps: '10-12',
    ref: '15-20 kg',
    sets: 3,
    tech: [
      'Codos pegados al torso, fijos durante todo el movimiento.',
      'Subí controlado sin balancear la espalda ni cadera.',
      'Apretá el bíceps en el punto más alto.',
      'Bajá lento (la bajada en 3 segundos estimula más crecimiento).',
      'No extiendas del todo de golpe abajo.'
    ],
    error: 'Mover los codos hacia adelante o impulsarse hacia atrás.',
    focus: 'Aislar el bíceps sintiendo la bola del músculo.'
  },
  'face-pull': {
    icon: '🎭',
    title: 'Face Pull en Polea',
    ytId: 'rep-qVOkqgk',
    target: 'Hombro Posterior y Postura',
    reps: '12-15',
    ref: '15-20 kg',
    sets: 3,
    tech: [
      'Polea ajustada a la altura de los ojos/cara.',
      'Tirá llevando las manos hacia tu cara con codos altos.',
      'Rotá las manos hacia atrás y afuera al final.',
      'Apretá los omóplatos y hombros traseros.',
      'Usá peso liviano, priorizá la técnica sobre los kilos.'
    ],
    error: 'Cargar mucho peso y tirar al pecho o cuello con impulso.',
    focus: 'Postura derecha y salud articular de hombros.'
  },

  // MIÉRCOLES - PIERNAS (TODO MÁQUINA)
  'hack-squat': {
    icon: '🏋️',
    title: 'Hack Squat',
    ytId: '0tn5K9NlCfo',
    target: 'Cuádriceps y Glúteos',
    reps: '10-12',
    ref: '40-60 kg',
    sets: 3,
    tech: [
      'Espalda y cabeza bien apoyadas en el respaldo.',
      'Pies al ancho de hombros, un poco adelantados.',
      'Bajá controlado hasta 90° de rodilla.',
      'Rodillas alineadas con la punta de los pies, sin colapsar adentro.',
      'Empujá con todo el pie, no solo con la punta.'
    ],
    error: 'Despegar la espalda del respaldo o juntar las rodillas al subir.',
    focus: 'Cuádriceps con máxima estabilidad de columna.'
  },
  'extension-cuadriceps': {
    icon: '🦿',
    title: 'Extensión de Cuádriceps',
    ytId: 'YyvSfVjQeL0',
    target: 'Cuádriceps (Frente del muslo)',
    reps: '12-15',
    ref: '25-35 kg',
    sets: 3,
    tech: [
      'Espalda bien apoyada en el respaldo.',
      'Rodillas alineadas con el eje giratorio de la máquina.',
      'Extendé controlado, sin dar latigazos ni rebotes.',
      'Pausa breve de 1 seg arriba apretando el cuádriceps.',
      'Bajá en 2-3 segundos sin dejar caer el peso.'
    ],
    error: 'Patear con impulso o no controlar la bajada.',
    focus: 'Sensación de quemazón en la parte frontal del muslo.'
  },
  'curl-femoral-sentado': {
    icon: '🪝',
    title: 'Curl Femoral Sentado',
    ytId: 'ELOCsoDSmrg',
    target: 'Isquiotibiales (Atrás del muslo)',
    reps: '10-12',
    ref: '25-35 kg',
    sets: 3,
    tech: [
      'Espalda apoyada, rodillas alineadas al eje de la máquina.',
      'Rodillo ajustado justo arriba del talón.',
      'Flexioná llevando los talones hacia abajo y atrás.',
      'Apretá el isquiotibial al final del recorrido.',
      'Volvé controlado sin soltar el peso.'
    ],
    error: 'Despegar la espalda o dejar caer las pesas de golpe.',
    focus: 'Apretar debajo del muslo al flexionar las rodillas.'
  },
  'aductores-maq': {
    icon: '🗜️',
    title: 'Aductores en Máquina',
    ytId: 'b2C2_P9L1cE',
    target: 'Aductores (Interior del muslo)',
    reps: '12-15',
    ref: '25-35 kg',
    sets: 3,
    tech: [
      'Espalda apoyada y postura firme.',
      'Cerrá las piernas controlado sintiendo el interior del muslo.',
      'No uses impulso ni rebote rápido.',
      'Rango completo de movimiento.',
      'Volvé abriendo con control.'
    ],
    error: 'Rebotar las piernas sin controlar la apertura.',
    focus: 'Cerrar con fuerza interna y sostener 1 segundo.'
  },
  'gemelos-sentado': {
    icon: '🏔️',
    title: 'Gemelos Sentado',
    ytId: 'JbyjNymZOt0',
    target: 'Pantorrillas (Sóleo)',
    reps: '15',
    ref: '20-30 kg',
    sets: 3,
    tech: [
      'Almohadilla apoyada sobre el muslo (cerca de rodillas, no en espinilla).',
      'Solo la punta del pie en la plataforma.',
      'Extendé el tobillo empujando fuerte con la punta.',
      'Bajá controlado sintiendo el estiramiento.',
      'Rango completo: estirar abajo y subir arriba del todo.'
    ],
    error: 'Movimientos cortos y rápidos sin estiramiento.',
    focus: 'Apretar arriba y bajar despacio.'
  },

  // JUEVES - EMPUJE (PECHO / HOMBRO / TRÍCEPS)
  'press-banca': {
    icon: '🧱',
    title: 'Press de Banca',
    ytId: 'rT7DgCr-3pg',
    target: 'Pecho (Pectoral)',
    reps: '8-10',
    ref: '40-60 kg',
    sets: 3,
    tech: [
      'Escápulas retraídas y pegadas al banco (juntá omóplatos).',
      'Pies bien apoyados y firmes en el piso.',
      'Agarre un poco más ancho que los hombros.',
      'Bajá la barra controlada al pecho medio-bajo.',
      'Empujá hacia arriba sin trabar los codos de golpe.'
    ],
    error: 'Separar los hombros del banco o rebotar la barra en el pecho.',
    focus: 'Pecho inflado empujando con fuerza pareja.'
  },
  'press-inclinado-maq': {
    icon: '📐',
    title: 'Press Inclinado en Máquina',
    ytId: 'SrqOu55lrYU',
    target: 'Pecho Superior',
    reps: '10-12',
    ref: '25-35 kg',
    sets: 3,
    tech: [
      'Espalda bien apoyada en el respaldo inclinado.',
      'Agarre a la altura del pecho superior.',
      'Empujá controlado sin trabar codos del todo.',
      'Bajá controlado sin dejar caer el peso.',
      'Hombros hacia abajo, no encogidos hacia las orejas.'
    ],
    error: 'Adelantar los hombros o arquear exageradamente la cintura.',
    focus: 'Parte superior del pecho (cerca de la clavícula).'
  },
  'pec-deck': {
    icon: '🦋',
    title: 'Pec Deck (Aperturas)',
    ytId: 'eGjt4jcWA9c',
    target: 'Pecho',
    reps: '10-12',
    ref: '20-30 kg',
    sets: 3,
    tech: [
      'Espalda bien pegada al respaldo.',
      'Codos ligeramente flexionados, fijos durante el movimiento.',
      'Juntá los brazos al frente como abrazando un árbol.',
      'Movimiento controlado sin usar impulso.',
      'Abrí sintiendo el estiramiento del pecho sin forzar hombros.'
    ],
    error: 'Empujar con manos en lugar de juntar codos o estirar de más.',
    focus: 'Apretar el pecho al centro 1 segundo.'
  },
  'press-hombro-maq': {
    icon: '🏋️‍♂️',
    title: 'Press de Hombro en Máquina',
    ytId: 'WvjOMR-8E5Y',
    target: 'Hombros',
    reps: '10-12',
    ref: '15-25 kg',
    sets: 3,
    tech: [
      'Espalda bien apoyada, abdomen firme.',
      'Agarre a la altura de los hombros.',
      'Empujá hacia arriba sin arquear la cintura.',
      'No trabes los codos del todo arriba.',
      'Bajá controlado hasta la altura de las orejas.'
    ],
    error: 'Arquear la zona lumbar para empujar con el pecho.',
    focus: 'Deltoides anterior y lateral con movimiento vertical.'
  },
  'extension-triceps-polea': {
    icon: '🪢',
    title: 'Extensión de Tríceps en Polea',
    ytId: '2-LAMcpzODU',
    target: 'Tríceps',
    reps: '10-12',
    ref: '15-20 kg',
    sets: 3,
    tech: [
      'Codos pegados al torso, fijos durante todo el ejercicio.',
      'Solo se mueve el antebrazo, no el hombro.',
      'Extendé completo apretando el tríceps abajo.',
      'Volvé controlado (la subida lenta también trabaja).',
      'Evitá balancear el cuerpo para generar impulso.'
    ],
    error: 'Separar los codos de las costillas o hamacarse con la espalda.',
    focus: 'Apretar la parte trasera del brazo abajo del todo.'
  },

  // EJERCICIOS ALTERNATIVOS
  'patada-gluteo-polea': {
    icon: '🍑',
    title: 'Patada de Glúteo en Polea',
    ytId: 'Z3Q0w3JtGzQ',
    target: 'Glúteo Mayor',
    reps: '12-15',
    ref: '10-15 kg',
    sets: 3,
    tech: [
      'Tobillera ajustada, anclaje bajo de la polea.',
      'Apoyate en la máquina o marco para mantener equilibrio.',
      'Llevá la pierna hacia atrás y arriba apretando el glúteo.',
      'No arquees la zona lumbar, torso estable.',
      'Controlá la vuelta sin dejar caer la pierna.'
    ],
    error: 'Arquear la espalda baja en vez de apretar el glúteo.',
    focus: 'Apretar el glúteo en el punto de máxima patada.'
  },
  'remo-polea-baja': {
    icon: '🚣',
    title: 'Remo Polea Baja (Agarre Neutro)',
    ytId: 'GZbfZ033f74',
    target: 'Espalda Media y Dorsal',
    reps: '10-12',
    ref: '30-40 kg',
    sets: 3,
    tech: [
      'Sentado, rodillas ligeramente flexionadas, pies firmes.',
      'Espalda recta, pecho arriba.',
      'Tirá el agarre hacia el abdomen, codos cerca del cuerpo.',
      'Apretá los omóplatos al final del recorrido.',
      'Volvé controlado sin encorvar la espalda.'
    ],
    error: 'Encorvar los hombros o hamacarse adelante y atrás.',
    focus: 'Tirar con codos pegados y juntar escápulas.'
  },
  'jalon-tras-nuca': {
    icon: '🪁',
    title: 'Jalón Tras Nuca en Polea',
    ytId: 'EUIri47Epcg',
    target: 'Espalda Alta',
    reps: '10-12',
    ref: '25-35 kg',
    sets: 3,
    tech: [
      'Agarre ancho, similar al jalón frontal.',
      'Llevá la barra hasta la nuca, sin bajar más de la cabeza.',
      'Si sentís molestia en hombros, cambiá a jalón frontal.',
      'Torso estable sin balancear.',
      'Peso moderado — priorizá movilidad sobre kilos.'
    ],
    error: 'Forzar el cuello hacia adelante o cargar demasiado.',
    focus: 'Rango seguro y apertura de espalda alta.'
  },
  'curl-martillo-polea': {
    icon: '🔨',
    title: 'Curl Martillo en Polea (Cuerda)',
    ytId: 'TwD-YGVP4Bk',
    target: 'Braquial y Antebrazo',
    reps: '10-12',
    ref: '15-20 kg',
    sets: 3,
    tech: [
      'Agarre neutro (palmas enfrentadas) con la cuerda.',
      'Codos pegados al torso, fijos durante el movimiento.',
      'Subí controlado sin balancear el cuerpo.',
      'Apretá arriba, bajá lento y controlado.',
      'Trabaja más el braquial y antebrazo que el curl tradicional.'
    ],
    error: 'Abrir los codos o impulsarse con las rodillas.',
    focus: 'Grosor de brazo y fuerza de agarre.'
  },
  'prensa-horizontal': {
    icon: '🦵',
    title: 'Prensa Horizontal',
    ytId: 'IZxyjW7OSvc',
    target: 'Piernas / Cuádriceps',
    reps: '10-12',
    ref: '60-80 kg',
    sets: 3,
    tech: [
      'Pies al ancho de hombros en el centro de la placa.',
      'Espalda bien apoyada contra el respaldo.',
      'Empujá hasta extender casi por completo (sin trabar rodillas).',
      'Bajá lento hasta 90 grados.',
      'Empujá con toda la planta del pie.'
    ],
    error: 'Despegar la cadera al flexionar o trabar rodillas.',
    focus: 'Empuje parejo y fluido.'
  },
  'gluteo-maquina': {
    icon: '🍑',
    title: 'Glúteo en Máquina (Kickback)',
    ytId: 'Z3Q0w3JtGzQ',
    target: 'Glúteos',
    reps: '12-15',
    ref: '20-30 kg',
    sets: 3,
    tech: [
      'Apoyá pecho y manos en los soportes.',
      'Empujá hacia atrás y arriba con la planta del pie.',
      'Apretá el glúteo 1 segundo arriba.',
      'Volvé controlado sin que las placas choquen con fuerza.',
      'Mantené el abdomen firme.'
    ],
    error: 'Mover la cadera de lado o arquear la cintura.',
    focus: 'Aislar el glúteo en la extensión hacia atrás.'
  },
  'gemelos-pie-maq': {
    icon: '🏔️',
    title: 'Gemelos de Pie en Máquina',
    ytId: 'Kteh7u1-s8k',
    target: 'Gemelos (Pantorrillas)',
    reps: '12-15',
    ref: '40-60 kg',
    sets: 3,
    tech: [
      'Hombros bien colocados bajo almohadillas, espalda recta.',
      'Solo la punta de los pies apoyada en la plataforma.',
      'Extendé el tobillo empujando hacia arriba al máximo.',
      'Bajá controlado sintiendo el estiramiento completo.',
      'Rango completo, sin rebotar entre repeticiones.'
    ],
    error: 'Rebotar sin estirar abajo o flexionar las rodillas.',
    focus: 'Subir bien alto en puntas y bajar estirando el gemelo.'
  },
  'press-banca-inclinado': {
    icon: '📐',
    title: 'Press de Banca Inclinado (Barra)',
    ytId: 'SrqOu55lrYU',
    target: 'Pecho Superior',
    reps: '8-10',
    ref: '30-45 kg',
    sets: 3,
    tech: [
      'Banco entre 30-45° (no más inclinado para no cargar puro hombro).',
      'Escápulas retraídas, pecho arriba.',
      'Bajá la barra hasta la parte superior del pecho/clavícula.',
      'Empujá derecho hacia arriba.',
      'Pies firmes en el piso para dar estabilidad.'
    ],
    error: 'Rebotar la barra en el pecho o despegar los hombros.',
    focus: 'Fuerza en la parte alta del pecho.'
  },
  'elevaciones-laterales-polea': {
    icon: '🦅',
    title: 'Elevaciones Laterales en Polea',
    ytId: 'WJm9ZA2PjaG',
    target: 'Hombro Lateral',
    reps: '12-15',
    ref: '2.5-5 kg',
    sets: 3,
    tech: [
      'Polea baja, parate de costado a la máquina.',
      'Brazo casi extendido, ligera flexión en el codo.',
      'Subí hasta la altura del hombro, no más arriba.',
      'Controlá la bajada, no dejes caer el peso.',
      'Evitá balancear el torso para generar impulso.'
    ],
    error: 'Subir con tirones de espalda o elevar el brazo por encima del hombro.',
    focus: 'Tensión continua en el lateral del hombro.'
  },
  'fondos-maq-asistida': {
    icon: '🛹',
    title: 'Fondos en Máquina Asistida',
    ytId: 'ZCG6hAOrQj8',
    target: 'Pecho y Tríceps',
    reps: '8-10',
    ref: 'Asistencia 30-40 kg',
    sets: 3,
    tech: [
      'Ajustá el contrapeso (más peso en la máquina = más ayuda, más fácil).',
      'Torso ligeramente inclinado adelante para pecho (o recto para tríceps).',
      'Bajá controlado hasta sentir estiramiento en pecho/hombro.',
      'Empujá hacia arriba sin trabar los codos de golpe.',
      'Core firme durante todo el movimiento.'
    ],
    error: 'Bajar en exceso comprometiendo los hombros o soltarse rápido.',
    focus: 'Empuje de pecho y tríceps con ayuda controlada.'
  }
}

export interface WorkoutDay {
  id: string
  label: string
  title: string
  exercises: string[]
  alternatives: string[]
}

export const workoutDays: WorkoutDay[] = [
  {
    id: 'd1',
    label: 'D1: Pierna/Glúteo',
    title: 'Lunes: Piernas / Glúteos',
    exercises: ['prensa', 'hip-thrust-maq', 'curl-femoral-acostado', 'abductores-maq', 'gemelos-prensa'],
    alternatives: ['hack-squat', 'patada-gluteo-polea', 'aductores-maq']
  },
  {
    id: 'd2',
    label: 'D2: Tirón',
    title: 'Martes: Tirón (Espalda / Bíceps)',
    exercises: ['jalon-pecho', 'remo-maq-sentado', 'remo-alto-polea', 'curl-biceps-polea', 'face-pull'],
    alternatives: ['remo-polea-baja', 'jalon-tras-nuca', 'curl-martillo-polea']
  },
  {
    id: 'd3',
    label: 'D3: Piernas Máq.',
    title: 'Miércoles: Piernas (Todo Máquina)',
    exercises: ['hack-squat', 'extension-cuadriceps', 'curl-femoral-sentado', 'aductores-maq', 'gemelos-sentado'],
    alternatives: ['prensa-horizontal', 'gluteo-maquina', 'gemelos-pie-maq']
  },
  {
    id: 'd4',
    label: 'D4: Empuje',
    title: 'Jueves: Empuje (Pecho / Hombro / Tríceps)',
    exercises: ['press-banca', 'press-inclinado-maq', 'pec-deck', 'press-hombro-maq', 'extension-triceps-polea'],
    alternatives: ['press-banca-inclinado', 'elevaciones-laterales-polea', 'fondos-maq-asistida']
  },
  {
    id: 'd5',
    label: 'D5: Full Body',
    title: 'Viernes: Full Body',
    exercises: ['prensa', 'press-banca', 'jalon-pecho', 'press-hombro-maq', 'curl-femoral-sentado'],
    alternatives: ['hack-squat', 'pec-deck', 'remo-polea-baja']
  }
]

export const getExerciseDetails = (id: string): ExerciseInfo => {
  return exerciseDB[id] || {
    icon: '💪',
    title: id,
    ytId: '',
    tech: ['Controlá la respiración.', 'Mantené el torso firme.'],
    error: 'Hacer movimientos bruscos sin control.',
    focus: 'Músculo objetivo.',
    target: 'General',
    reps: '10-12',
    ref: 'Ajustar según nivel',
    sets: 3
  }
}
