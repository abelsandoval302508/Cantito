(function(){
// Catálogo y contenido del taller «El poder de conectar, el arte de comunicar» (Versania Nova). Compartido por la app y el panel.
const AGES = [
  { label: '0–6 meses', short: '0–6 m', hito: 'Llanto, sonidos y sonrisa refleja, sonrisa social, risa a carcajadas, fija mirada, seguimiento visual, permanencia del objeto, balbuceo, reconocimiento de voces familiares, ubicación de fuente sonora, gestos agrado vs. desagrado.' },
  { label: '6–12 meses', short: '6–12 m', hito: 'Silabeo, aparición de primeras palabras, incremento en el uso de gestos, señala y comprende más vocabulario, tiene juguete favorito, aumenta su independencia y curiosidad.' },
  { label: '12–24 meses', short: '12–24 m', hito: 'Aumenta la adquisición de nuevas palabras y empieza a combinar progresivamente palabras con errores frecuentes. Mayor interés en explorar libros y juguetes, así como el juego con otros.' },
  { label: '2–4 años', short: '2–4 a', hito: 'Lenguaje más estructurado, con errores fonético-fonológicos, toma de turnos, conversaciones espontáneas, iniciativa en el diálogo, interés especial en el juego, época del ¿por qué?' },
  { label: '4–6 años', short: '4–6 a', hito: 'Lenguaje amplio, se consolida nivel fonético-fonológico, conversaciones espontáneas: ideas, sentimientos, etc. Comprensión de órdenes de 2 y 3 pasos. Disfruta de los juegos / actividades grupales.' },
];
const PURPOSES = [
  { label: 'Vocabulario', icon: 'ph-chat-circle-text' },
  { label: 'Articulación', icon: 'ph-waveform' },
  { label: 'Conexión', icon: 'ph-smiley' },
  { label: 'Imitación', icon: 'ph-copy' },
  { label: 'Instrucciones', icon: 'ph-hand-pointing' },
  { label: 'Cuerpo y movimiento', icon: 'ph-person-arms-spread' },
  { label: 'Ritmo y rima', icon: 'ph-music-notes' },
  { label: 'Memoria y atención', icon: 'ph-brain' },
  { label: 'Turnos', icon: 'ph-chats' },
];
const MOMENTS = [
  { key: 'Despertar', label: 'Al despertar', icon: 'ph-sun-horizon', hint: '' },
  { key: 'Comidas', label: 'Comidas', icon: 'ph-fork-knife', hint: 'Amamantamiento / hora de comidas' },
  { key: 'Higiene', label: 'Baño y vestido', icon: 'ph-bathtub', hint: 'Cambio de pañal, baño, cepillado de dientes, vestido' },
  { key: 'Juego', label: 'Juego', icon: 'ph-puzzle-piece', hint: 'Hora de juego diario' },
  { key: 'Salidas', label: 'Salidas', icon: 'ph-tree', hint: 'Ir al supermercado, parque, médico, zoológico, etc.' },
  { key: 'Dormir', label: 'Dormir', icon: 'ph-moon-stars', hint: '' },
];
const STRATEGIES = [
  { n: 1, title: 'Organización del ambiente', points: ['Hable del horario del día con los niños.', 'Acompañe con canciones mientras ejecuta las actividades y en las transiciones: cambio de pañal, guardar, etc.', 'Hora del cuento diaria – lectura compartida.', 'Limite los tiempos de pantalla. Promueva el diálogo en actividad conjunta con el niño.'] },
  { n: 2, title: 'Siga las iniciativas y respuestas del niño', points: ['Mayor nivel de alerta y atención hacia estímulos.', 'Incrementa la posibilidad de comunicarse.', 'Cerebro motivado aprende con mayor facilidad.', 'Repita las palabras del niño, expandiendo el lenguaje.'] },
  { n: 3, title: 'Hacer comentarios y nombrar los estímulos, expandiendo el lenguaje', points: ['Retroalimente de manera positiva.', 'Hable mientras se asisten las AVD. Utilice voz entonada, música, cante canciones infantiles.', 'Toma de turnos y tiempos de espera. Practicar la escucha activa.'] },
  { n: 4, title: 'Música y canto. Tu voz es la clave', points: ['Conexión: contacto visual, sonrisas, movimiento.', 'Imaginación y creatividad.', 'Aprendizaje: nuevo vocabulario – mejora proceso de articulación.', 'Memoria y concentración.', 'Autoestima.'] },
];
const SCREEN_TIP = 'Limite los tiempos de pantalla. Promueva el diálogo en actividad conjunta con el niño.';

const C = 'cancionero', Y = 'youtube';
const SONGS = [
  { id: 'cocodrilo', src: C, title: 'Un cocodrilo se metió en la cueva', yt: 'Eb5O7wUQpMY', channel: 'Nora Galit', ages: [2,3,4], purposes: ['Imitación','Memoria y atención','Cuerpo y movimiento'], moments: ['Juego'], strat: 2,
    goal: 'Juego de manos con pausa y sorpresa: anticipación, atención e imitación de gestos.', steps: ['Haz la cueva con un brazo y el cocodrilo con la otra mano.', 'Antes de «¿y qué pasó?» haz una pausa larga y espera su respuesta.', 'Repite lo que diga y amplíalo: «¡Sí, se durmió el cocodrilo!».'], words: ['cocodrilo','cueva','cabeza','lado'] },
  { id: 'mi-cuerpo', src: C, title: 'Mi cuerpo hace música', yt: 'OrPGWEm4tAM', channel: 'Sol y Canto Kids', ages: [2,3,4], purposes: ['Cuerpo y movimiento','Imitación','Articulación'], moments: ['Juego','Higiene'], strat: 4,
    goal: 'Partes del cuerpo unidas a sonidos fáciles de imitar: pom, bom, la la la.', steps: ['Haz cada sonido con la parte del cuerpo: palmas, pies, boca.', 'Deja que complete el sonido: «mis manos hacen…».', 'Cambia el orden para mantener su atención.'], words: ['manos','pies','boca','cuerpo'] },
  { id: 'palmas', src: C, title: 'Palmas, palmitas', yt: null, channel: '', ages: [0,1,2], purposes: ['Conexión','Imitación','Ritmo y rima'], moments: ['Comidas','Juego'], strat: 4,
    goal: 'Juego de palmas cara a cara: contacto visual y primeras imitaciones.', steps: ['Siéntense frente a frente y busca su mirada.', 'Aplaude despacio y espera a que te imite.', 'Celebra cualquier intento con una sonrisa.'], words: ['palmas','papá','mamá'] },
  { id: 'vuelta', src: C, title: 'Da una vuelta en tu lugar', yt: null, channel: '', ages: [3,4], purposes: ['Instrucciones','Cuerpo y movimiento'], moments: ['Juego'], strat: 3,
    goal: 'Comprender órdenes de movimiento de uno y dos pasos.', steps: ['Hagan cada movimiento juntos la primera vez.', 'Luego da tú la orden y deja que la haga solo.', 'Combina dos órdenes: «da una vuelta y siéntate».'], words: ['vuelta','lugar','arriba','abajo'] },
  { id: 'me-muevo', src: C, title: 'Me muevo', yt: null, channel: '', ages: [2,3,4], purposes: ['Cuerpo y movimiento','Instrucciones','Vocabulario'], moments: ['Despertar','Juego'], strat: 3,
    goal: 'Verbos de movimiento y contrastes: rápido, lento, alto, bajo.', steps: ['Nombra el movimiento mientras lo hacen.', 'Exagera los contrastes de velocidad.', 'Pregúntale «¿cómo nos movemos ahora?».'], words: ['muevo','rápido','lento','salto'] },
  { id: 'pelota', src: C, title: 'La pelota', yt: null, channel: '', ages: [1,2,3], purposes: ['Turnos','Vocabulario','Conexión'], moments: ['Juego'], strat: 2,
    goal: 'Turnos con un objeto: lanzar, esperar y recibir.', steps: ['Usa una pelota real mientras cantan.', 'Di «¡te toca!» antes de cada lanzamiento.', 'Espera a que pida la pelota con un gesto o palabra.'], words: ['pelota','toma','mía','tuya'] },
  { id: 'pez-tiburon', src: C, title: 'Pez tiburón', yt: null, channel: '', ages: [2,3], purposes: ['Ritmo y rima','Imitación','Memoria y atención'], moments: ['Higiene','Juego'], strat: 4,
    goal: 'Repetición con gestos que ayudan a recordar la secuencia.', steps: ['Cántala en el baño moviendo las manos como aletas.', 'Repite cada estrofa con un gesto distinto.', 'Pídele que recuerde qué viene después.'], words: ['pez','tiburón','nadar','mar'] },
  { id: 'cabeza-si', src: C, title: 'Con mi cabeza digo sí', yt: '_547dfPWG98', channel: 'Tío Ariel (canción de Miss Cuqui)', ages: [1,2,3], purposes: ['Conexión','Imitación','Cuerpo y movimiento'], moments: ['Comidas','Juego'], strat: 2,
    goal: 'Gestos de sí y no: la base para responder y elegir.', steps: ['Exagera el gesto de la cabeza al decir sí y no.', 'Úsalo en la comida: «¿quieres más?» y espera su gesto.', 'Acepta el gesto como respuesta y ponle palabra.'], words: ['sí','no','cabeza','dedito'] },
  { id: 'arriba-abajo', src: C, title: 'Arriba y abajo', yt: null, channel: '', ages: [1,2,3], purposes: ['Vocabulario','Instrucciones'], moments: ['Higiene','Juego'], strat: 3,
    goal: 'Conceptos espaciales arriba y abajo con el cuerpo.', steps: ['Al vestirse, sube y baja los brazos cantando.', 'Señala objetos arriba y abajo en la habitación.', 'Deja que él dé la orden.'], words: ['arriba','abajo','manos','pies'] },
  { id: 'mi-cara', src: C, title: 'En mi cara tengo', yt: null, channel: '', ages: [1,2,3], purposes: ['Vocabulario','Cuerpo y movimiento','Articulación'], moments: ['Higiene'], strat: 3,
    goal: 'Partes de la cara frente al espejo.', steps: ['Cántenla frente al espejo del baño.', 'Toca cada parte de su cara y de la tuya.', 'Pregunta «¿dónde está tu nariz?» y espera.'], words: ['ojos','nariz','boca','orejas'] },
  { id: 'movernos', src: C, title: 'Todos a movernos', yt: null, channel: '', ages: [3,4], purposes: ['Cuerpo y movimiento','Instrucciones','Memoria y atención'], moments: ['Juego','Despertar'], strat: 1,
    goal: 'Seguir una secuencia de movimientos y parar a tiempo.', steps: ['Juega a «parar» cuando la música se detiene.', 'Agreguen un movimiento nuevo en cada ronda.', 'Que recuerde la secuencia completa.'], words: ['saltar','girar','parar'] },
  { id: 'pulga', src: C, title: 'Una pulga por aquí', yt: 'nS9roio8bLU', channel: 'Tu Rockcito', ages: [1,2,3], purposes: ['Cuerpo y movimiento','Conexión','Vocabulario'], moments: ['Higiene','Juego'], strat: 4,
    goal: 'Cosquillas y risa compartida mientras se nombran partes del cuerpo.', steps: ['Haz cosquillas en la parte del cuerpo que nombra la canción.', 'Pausa antes de la parte («en la…») para que la diga.', 'Disfruten la risa: también es comunicación.'], words: ['cabeza','nariz','mejillas','barriga'] },
  { id: 'ki-ki-ki', src: C, title: '¡Ki ki ki!', yt: null, channel: '', ages: [0,1,2], purposes: ['Articulación','Imitación'], moments: ['Despertar'], strat: 4,
    goal: 'Sílabas repetidas fáciles de imitar en las primeras etapas.', steps: ['Exagera la boca al decir «ki ki ki».', 'Espera a que te imite y repite su sonido.', 'Úsala para dar los buenos días.'], words: ['ki ki ki','gallo','sol'] },
  { id: 'rima-limon', src: C, title: 'Rima lima limón', yt: 'pdR2RiIbpps', channel: 'Pequeño Pez', ages: [3,4], purposes: ['Ritmo y rima','Vocabulario','Memoria y atención'], moments: ['Salidas','Juego'], strat: 3,
    goal: 'Conciencia fonológica: descubrir palabras que riman.', steps: ['Después de cada rima, busquen otra palabra que suene igual.', 'En el auto o el súper, jueguen a «¿qué rima con…?».', 'Acepta rimas inventadas: lo importante es escuchar el sonido final.'], words: ['limón','timón','botón','corazón'] },
  { id: 'selva', src: C, title: 'Camino por la selva', yt: 'Y_Qr50S0-B8', channel: 'Luli Pampín', ages: [2,3,4], purposes: ['Vocabulario','Imitación','Memoria y atención'], moments: ['Salidas','Juego'], strat: 2,
    goal: 'Animales y sus sonidos, con escucha atenta («oigo, oigo…»).', steps: ['Ponte la mano en la oreja y haz silencio antes de cada animal.', 'Imiten juntos cómo camina cada animal.', 'En el parque, jueguen a escuchar sonidos reales.'], words: ['elefante','serpiente','selva','oigo'] },
  { id: 'adentro-afuera', src: C, title: 'Adentro y afuera', yt: null, channel: '', ages: [1,2,3], purposes: ['Vocabulario','Instrucciones'], moments: ['Higiene','Juego'], strat: 1,
    goal: 'Conceptos adentro y afuera con objetos de la rutina.', steps: ['Al guardar juguetes, canten mientras los meten en la caja.', 'Al vestirse: el brazo adentro de la manga.', 'Pídele que ponga algo adentro o afuera.'], words: ['adentro','afuera','caja'] },

  { id: 'buenos-dias', src: Y, title: 'Buenos días', yt: '1fTk1viL7Sc', channel: 'Los Amiguitos', ages: [1,2,3], purposes: ['Vocabulario','Conexión','Turnos'], moments: ['Despertar'], strat: 1,
    goal: 'Saludos y rutina de la mañana: anticipa el día y usa palabras sociales.', steps: ['Cántala al abrir la cortina, mirándole a la cara.', 'Después de «buenos días» haz una pausa y espera su respuesta.', 'Hable del horario del día: qué haremos después.'], words: ['hola','sol','mamá','papá'] },
  { id: 'pollitos', src: Y, title: 'Los pollitos dicen', yt: 'x9jUoT8T7fE', channel: 'LooLoo Kids', ages: [0,1,2], purposes: ['Articulación','Imitación','Vocabulario'], moments: ['Comidas','Despertar'], strat: 4,
    goal: 'Onomatopeyas fáciles de imitar y palabras de necesidades: hambre, frío.', steps: ['Exagera el «pío pío» con los labios bien marcados.', 'Deja el último «pío» sin cantar para que lo complete.', 'En la comida, señala el plato cuando dicen «hambre».'], words: ['pío','hambre','frío','mamá'] },
  { id: 'vaca-lola', src: Y, title: 'La vaca Lola', yt: 'IsJPNUOZb7Q', channel: 'La Granja de Zenón', ages: [1,2], purposes: ['Imitación','Articulación','Ritmo y rima'], moments: ['Juego','Salidas'], strat: 2,
    goal: 'Repetición y un sonido muy claro («muu») de los primeros en aparecer.', steps: ['Usa un muñeco o un dibujo de vaca.', 'Pregunta «¿cómo hace la vaca?» y espera.', 'Celebra el intento y repítelo bien dicho, sin corregir.'], words: ['vaca','muu','cola','Lola'] },
  { id: 'pin-pon', src: Y, title: 'Pin Pon es un muñeco', yt: 'yu1dU3Rm2yU', channel: 'LooLoo Kids', ages: [2,3], purposes: ['Vocabulario','Cuerpo y movimiento','Instrucciones'], moments: ['Higiene','Dormir'], strat: 3,
    goal: 'Vocabulario de higiene ligado a acciones reales.', steps: ['Cántala en el baño haciendo cada acción.', 'Deja frases incompletas: «con agua y con…».', 'Pídele que lo haga él con un muñeco.'], words: ['carita','agua','jabón','pelo'] },
  { id: 'cabeza-hombros', src: Y, title: 'Cabeza, hombros, rodillas y pies', yt: 'XoAZOOTrAIA', channel: 'ChuChu TV', ages: [3,4], purposes: ['Cuerpo y movimiento','Instrucciones','Memoria y atención'], moments: ['Juego'], strat: 2,
    goal: 'Partes del cuerpo y comprensión de órdenes con movimiento.', steps: ['Toquen cada parte a la vez, despacio la primera vez.', 'Para y pregunta «¿dónde está tu rodilla?».', 'Cambien de rol: él dice la parte y tú la tocas.'], words: ['cabeza','hombros','rodillas','pies'] },
  { id: 'johny', src: Y, title: 'Johny, Johny, ¿sí papá?', yt: 'QS-I8smWeu4', channel: 'LooLoo Kids', ages: [2,3], purposes: ['Turnos','Conexión'], moments: ['Comidas'], strat: 2,
    goal: 'Pregunta y respuesta: practica esperar su turno para hablar.', steps: ['Tú preguntas, él responde «sí, papá» o «no, papá».', 'Exagera la entonación de la pregunta.', 'Inventen versiones con su comida.'], words: ['sí','no','papá'] },
  { id: 'numeros', src: Y, title: 'Canción de los números', yt: '1h51pQo-IsU', channel: 'LooLoo Kids', ages: [3,4], purposes: ['Vocabulario','Memoria y atención','Ritmo y rima'], moments: ['Juego','Salidas'], strat: 3,
    goal: 'Contar en voz alta con ritmo; asocia número y cantidad.', steps: ['Cuenten con los dedos mientras suena.', 'En el paseo, cuenten cosas reales.', 'Para antes de un número y deja que lo diga.'], words: ['uno','dos','tres','cuatro'] },
  { id: 'duermete', src: Y, title: 'Duérmete niño', yt: '56ec4bY9BX0', channel: 'Plim Plim', ages: [0,1], purposes: ['Conexión','Ritmo y rima'], moments: ['Dormir'], strat: 4,
    goal: 'Melodía lenta y repetitiva que ayuda a anticipar la hora de dormir.', steps: ['Prueba el modo solo audio y canta encima con voz suave.', 'Mécelo al ritmo de la canción.', 'Usa siempre la misma canción cada noche.'], words: ['niño','duerme','estrellas'] },
  { id: 'buen-dia-plim', src: Y, title: 'La canción de los buenos días', yt: '7SwE3N7e3M8', channel: 'Plim Plim', ages: [2,3], purposes: ['Turnos','Instrucciones'], moments: ['Salidas','Despertar'], strat: 1,
    goal: 'Saludos y preguntas («¿cómo estás?») mientras caminan.', steps: ['Caminen «paso a pasito» mientras suena.', 'Responde tú a «¿cómo estás?» y luego pregúntale.', 'Saluden a lo que encuentren en el paseo.'], words: ['camina','buen día','bien','hola'] },
];

const LS = { events: 'cantito.events', family: 'cantito.family', catalog: 'cantito.catalog' };
function readLS(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } }
function writeLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
// Catálogo con las decisiones del panel (video asignado / aprobado)
function catalog(o) {
  o = o || {};
  return SONGS.map(s => {
    const r = o[s.id] || {};
    const yt = r.yt !== undefined ? r.yt : s.yt;
    return { ...s, yt, status: r.status || (s.src === 'youtube' ? 'aprobado' : (yt ? 'por revisar' : 'sin video')) };
  });
}
function ytId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || String(url).match(/^([\w-]{11})$/);
  return m ? m[1] : null;
}

const SURVEY_BASE = [
  { id: 'palabras', short: 'Palabras que dice', q: '¿Cuántas palabras dice {nombre} aproximadamente?', type: 'choice', options: ['Aún ninguna', '1 a 10', '11 a 50', '51 a 200', 'Más de 200'] },
  { id: 'combina', short: 'Combina palabras', q: '¿Combina dos o más palabras en una frase?', type: 'choice', options: ['Todavía no', 'A veces', 'Con frecuencia'] },
  { id: 'frecuencia', short: 'Cantan juntos', q: '¿Con qué frecuencia cantan juntos?', type: 'choice', options: ['Casi nunca', '1 o 2 veces por semana', '3 a 5 veces por semana', 'Todos los días'] },
  { id: 'pantalla', short: 'Pantalla al día', q: '¿Cuánto tiempo de pantalla tiene {nombre} al día?', type: 'choice', options: ['Menos de 30 min', '30 a 60 min', '1 a 2 horas', 'Más de 2 horas'] },
  { id: 'confianza', short: 'Confianza para estimular', q: '¿Qué tan seguro o segura te sientes estimulando su lenguaje?', type: 'scale', hint: '1 = nada · 5 = mucho' },
];
const SURVEY = {
  inicial: SURVEY_BASE,
  final: [...SURVEY_BASE,
    { id: 'utilidad', short: 'Utilidad de Cantito', q: '¿Qué tan útil ha sido Cantito para tu familia?', type: 'scale', hint: '1 = nada · 5 = mucho' },
    { id: 'cambios', short: 'Cambios observados', q: '¿Notaste algún cambio en su comunicación? Cuéntanos.', type: 'text' }],
};
window.CantitoData = { AGES, PURPOSES, MOMENTS, STRATEGIES, SCREEN_TIP, SONGS, SURVEY, catalog, ytId };
})();
