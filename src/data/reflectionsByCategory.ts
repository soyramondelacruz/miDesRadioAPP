export type VerseCategory =
  | "jesus"
  | "espiritu"
  | "fe"
  | "gracia"
  | "esperanza"
  | "amor"
  | "fortaleza"
  | "salvacion";

export const REFLECTIONS_BY_CATEGORY: Record<VerseCategory, string[]> = {
  jesus: [
    "Jesús es el centro de la historia y el Salvador presente hoy.",
    "Cristo transforma lo que parecía perdido.",
    "En Jesús hay propósito eterno.",
    "Su sacrificio revela amor perfecto.",
    "Caminar con Cristo es vivir en verdad.",
    "Jesús es luz en la oscuridad.",
    "Él nunca abandona lo que comienza.",
    "Cristo redefine tu identidad.",
    "En Él hay descanso verdadero.",
    "Jesús es esperanza viva.",
    "Su palabra sigue obrando hoy.",
    "Cristo sostiene en la prueba.",
    "Seguirle es confiar plenamente.",
    "Su gracia es suficiente.",
    "Jesús es fiel eternamente."
  ],

  espiritu: [
    "El Espíritu Santo guía cada paso.",
    "No estás solo: Dios habita en ti.",
    "El Consolador fortalece tu interior.",
    "Dios habla al corazón dispuesto.",
    "El Espíritu trae paz profunda.",
    "Él transforma desde dentro.",
    "Su dirección supera tu lógica.",
    "Dios capacita al llamado.",
    "El Espíritu revela verdad.",
    "Intercede cuando faltan palabras.",
    "Produce fruto visible.",
    "Da discernimiento en decisiones.",
    "Su presencia trae seguridad.",
    "Dios obra en silencio.",
    "El Espíritu confirma promesas."
  ],

  fe: [
    "La fe confía aun sin ver.",
    "Creer es avanzar con esperanza.",
    "La fe activa promesas divinas.",
    "Dios honra la confianza.",
    "La fe vence el temor.",
    "Confiar es descansar en Dios.",
    "La fe persevera.",
    "Creer cambia perspectivas.",
    "La fe sostiene en crisis.",
    "Sin fe no hay avance espiritual.",
    "La fe produce obediencia.",
    "Dios responde a quien cree.",
    "La fe renueva fuerzas.",
    "Confía más allá de lo visible.",
    "La fe es certeza interior."
  ],

  gracia: [
    "La gracia es favor inmerecido.",
    "Dios no te trata según tus fallas.",
    "La gracia restaura.",
    "Su misericordia es nueva cada mañana.",
    "La gracia rompe culpa.",
    "Dios perdona completamente.",
    "La cruz es máxima gracia.",
    "La gracia libera.",
    "Dios siempre da oportunidad.",
    "Donde abundó el pecado, sobreabundó la gracia.",
    "La gracia produce humildad.",
    "El perdón sana.",
    "La gracia acerca al Padre.",
    "Dios levanta al caído.",
    "La gracia transforma vidas."
  ],

  esperanza: [
    "Dios tiene planes de bien.",
    "La esperanza no defrauda.",
    "Después de la noche llega luz.",
    "Dios obra aunque no veas.",
    "La esperanza sostiene el alma.",
    "El futuro está en manos de Dios.",
    "La espera no es en vano.",
    "Dios cumple promesas.",
    "Hay propósito en el proceso.",
    "La esperanza renueva fuerzas.",
    "En Dios siempre hay futuro.",
    "Confía en su tiempo.",
    "La esperanza vence temor.",
    "Aún en el valle hay propósito.",
    "Dios escribe mejor historia."
  ],

  amor: [
    "Dios es amor.",
    "El amor vence el temor.",
    "Amar es reflejar a Dios.",
    "El amor edifica.",
    "El amor verdadero perdona.",
    "Dios te ama personalmente.",
    "El amor permanece.",
    "Amar es servir.",
    "El amor transforma relaciones.",
    "El amor cubre faltas.",
    "En el amor hay plenitud.",
    "El amor es decisión diaria.",
    "Amar honra a Dios.",
    "El amor restaura vínculos.",
    "El amor es eterno."
  ],

  fortaleza: [
    "Dios es tu fuerza.",
    "No enfrentas solo la batalla.",
    "El Señor renueva fuerzas.",
    "En debilidad hay poder.",
    "Dios es refugio seguro.",
    "La prueba fortalece.",
    "Con Dios eres más que vencedor.",
    "Él sostiene al cansado.",
    "La adversidad forma carácter.",
    "Dios pelea por ti.",
    "Su poder es suficiente.",
    "La perseverancia produce fruto.",
    "El Señor es tu escudo.",
    "Dios sostiene cada paso.",
    "La fuerza viene del Señor."
  ],

  salvacion: [
    "La salvación es regalo divino.",
    "Cristo vino a rescatar.",
    "En Jesús hay vida eterna.",
    "La cruz abrió camino.",
    "La salvación transforma corazón.",
    "No es religión, es relación.",
    "Cristo pagó el precio.",
    "Dios ofrece reconciliación.",
    "En Cristo hay nueva vida.",
    "La salvación trae libertad.",
    "Jesús salva por gracia.",
    "Dios adopta como hijo.",
    "La salvación es inicio.",
    "Hay esperanza eterna.",
    "Cristo es el único camino."
  ]
};