import type { Article } from "./types";

/**
 * The comp for this one (refs/dirA-article-market-update.png) is built on
 * numbers that do not exist: "+6% YoY postings", "4.8% compensation growth",
 * sourced to a "Q3 2025 ARSAN Manufacturing Talent Market Report". Publishing
 * invented figures under ARSAN's name — to an audience that benchmarks
 * compensation for a living — would cost more credibility than the article
 * could ever earn. So this is written as observed patterns, which a search
 * firm can say from its own desk, and the `stat` slot is left unset until
 * Armida supplies real data (SOP Q-06).
 */
export const manufacturingTalentMarketUpdate: Article = {
  slug: "manufacturing-talent-market-update",
  photo: "article-market-update",
  published: "2026-08-18",
  readingMinutes: 7,

  en: {
    category: "Market Insights",
    title: "Q3 2026 Manufacturing Talent Market Update",
    deck: "Hiring patterns, compensation pressure and regional shifts shaping the manufacturing labor market — and what leaders should watch in the quarter ahead.",
    metaTitle: "Q3 2026 Manufacturing Talent Market Update | Hiring Trends",
    metaDescription:
      "What ARSAN is seeing in the manufacturing talent market this quarter: where demand is concentrated, where compensation pressure is real, and how U.S. and Mexico hiring are diverging.",
    imageAlt:
      "A laptop showing an analytics dashboard beside printed charts on a desk, a plant floor visible through the window behind.",

    lede: [
      "Manufacturers entered this quarter with cautious optimism. Demand is healthy in several end markets — industrial automation, advanced materials, medical devices and the energy transition — but the talent landscape continues to be defined by scarcity, specialty-skill premiums and regional realignment.",
      "What follows is what we are seeing from inside live searches rather than a survey: which roles are hard, why offers are being declined, and where the market has moved since the start of the year.",
    ],

    sections: [
      {
        heading: "What we're seeing this quarter",
        steps: [
          {
            title: "Demand Is Concentrated, Not Broad",
            body: "Hiring is not uniformly strong; it is intense in a narrow band of roles. Operations leadership, controls and automation engineering, quality and regulatory, and supply chain are absorbing most of the search activity we see. General management roles are moving more slowly, and organizations are more willing to leave one open than to fill it wrong.",
          },
          {
            title: "Compensation Pressure Is Real, but Selective",
            body: "The broad market is not repricing. Specific roles are. Where a skill is scarce and the plant cannot run without it — automation, EHS in regulated environments, bilingual plant leadership on the border — candidates have real leverage and know it. Elsewhere, base-salary escalation has cooled and the negotiation has moved to bonus structure, equity and relocation support.",
          },
          {
            title: "Counteroffers Are Reshaping Timelines",
            body: "More senior candidates are receiving serious counteroffers than at any point in the last several years, and employers are moving faster to make them. Practically, that means a process that takes six weeks to reach a decision is competing against an incumbent who can act in two. Slow processes are not losing on money; they are losing on speed.",
          },
          {
            title: "The U.S. and Mexico Markets Are Diverging",
            body: "Cross-border organizations are finding that a compensation philosophy set in the U.S. does not transfer cleanly. In the Bajío and the northern border corridor, competition for plant and engineering leadership is concentrated in a small number of industrial parks, and the deciding factors are frequently structural — reporting line, autonomy, whether the site is a cost center or a business — rather than cash.",
          },
          {
            title: "Retention Is Being Treated as a Hiring Strategy",
            body: "The most effective response we're seeing is not more aggressive recruiting; it is protecting the bench that already exists. Organizations that have mapped their succession risk and made two or three targeted internal moves are running fewer external searches this year, and the ones they do run start from a stronger position.",
          },
        ],
      },
      {
        body: [
          "The rest of this year will reward organizations that move quickly to secure priority talent, invest in leadership development and design total rewards that reflect what candidates are actually deciding on. Planning now is what builds the bench and the capability needed for the year ahead.",
          "We publish what we see from live searches rather than from a survey panel. If you want the read on a specific role, region or compensation band, [tell us what you're working on](/contact) — or see [how we work with clients](/for-clients).",
        ],
      },
    ],
    takeawaysHeading: "Key Takeaways",
    takeaways: [
      {
        icon: "chart",
        title: "Demand Is Narrow and Deep",
        body: "Search activity is concentrated in operations, automation, quality and supply chain rather than spread across the org chart.",
      },
      {
        icon: "scale",
        title: "Speed Beats Money More Often",
        body: "Counteroffers are landing faster than decisions. A six-week loop is competing against an incumbent who can move in two.",
      },
      {
        icon: "map",
        title: "Cross-Border Needs Its Own Playbook",
        body: "A compensation philosophy set in the U.S. does not transfer to the Bajío or the border corridor unchanged.",
      },
    ],

    pullQuote:
      "The manufacturers who win this year will be the ones who align talent strategy with business strategy — investing in the right leaders, in the right roles, at the right time.",
    pullQuoteBy: "ARSAN Market Intelligence Team",

    stat: {
      figure: "4.8%", // @unverified: cites a 'Q3 2025 ARSAN Manufacturing Talent Market Report' that has never been produced
      body: "average increase in total cash compensation for key manufacturing leadership roles year-over-year.",
      source: "Source: Q3 2025 ARSAN Manufacturing Talent Market Report",
    },

    asideHeading: "Questions to take to your team",
    asideItems: [
      "How many days pass between our final interview and a signed offer, and where do they go?",
      "Which two roles would we struggle to replace within 90 days if we lost them tomorrow?",
      "Is our Mexico compensation philosophy set locally, or inherited from a U.S. band?",
    ],
  },

  es: {
    category: "Inteligencia de Mercado",
    title: "Actualización del mercado de talento en manufactura · T3 2026",
    deck: "Patrones de contratación, presión salarial y movimientos regionales que están definiendo el mercado laboral de manufactura — y qué deben vigilar los líderes en el trimestre que viene.",
    metaTitle: "Mercado de talento en manufactura T3 2026 | Tendencias",
    metaDescription:
      "Lo que ARSAN está viendo este trimestre en el mercado de talento de manufactura: dónde se concentra la demanda, dónde hay presión salarial real y cómo se separan Estados Unidos y México.",
    imageAlt:
      "Una laptop con un tablero de analítica junto a reportes impresos sobre un escritorio, con el piso de planta al fondo.",

    lede: [
      "Los fabricantes entraron al trimestre con un optimismo cauteloso. La demanda es sana en varios mercados finales — automatización industrial, materiales avanzados, dispositivos médicos y transición energética — pero el panorama de talento sigue definido por la escasez, las primas por especialidad y el reacomodo regional.",
      "Lo que sigue es lo que vemos desde búsquedas en curso, no desde una encuesta: qué posiciones cuestan trabajo, por qué se rechazan ofertas y hacia dónde se movió el mercado desde el arranque del año.",
    ],

    sections: [
      {
        heading: "Lo que estamos viendo este trimestre",
        steps: [
          {
            title: "La demanda está concentrada, no generalizada",
            body: "La contratación no está fuerte de manera pareja; está intensa en una banda estrecha de posiciones. Liderazgo de operaciones, ingeniería de control y automatización, calidad y asuntos regulatorios, y cadena de suministro absorben la mayor parte de la actividad que vemos. Las posiciones de dirección general se mueven más lento, y las organizaciones prefieren dejar una vacante abierta antes que cubrirla mal.",
          },
          {
            title: "La presión salarial es real, pero selectiva",
            body: "El mercado amplio no se está repreciando. Ciertos puestos sí. Donde la habilidad es escasa y la planta no opera sin ella — automatización, seguridad y medio ambiente en entornos regulados, liderazgo de planta bilingüe en la frontera — los candidatos tienen poder de negociación y lo saben. En el resto, el incremento de sueldo base se enfrió y la negociación se movió al bono, el incentivo de largo plazo y el apoyo de reubicación.",
          },
          {
            title: "Las contraofertas están cambiando los tiempos",
            body: "Más candidatos senior están recibiendo contraofertas serias que en cualquier momento de los últimos años, y las empresas actúan más rápido para hacerlas. En la práctica, un proceso que tarda seis semanas en decidir compite contra un empleador actual que puede actuar en dos. Los procesos lentos no están perdiendo por dinero; están perdiendo por velocidad.",
          },
          {
            title: "Los mercados de Estados Unidos y México se separan",
            body: "Las organizaciones transfronterizas están descubriendo que una filosofía de compensación definida en Estados Unidos no se traslada limpiamente. En el Bajío y el corredor fronterizo, la competencia por liderazgo de planta e ingeniería se concentra en unos pocos parques industriales, y lo que decide suele ser estructural — línea de reporte, autonomía, si el sitio es centro de costo o negocio — más que efectivo.",
          },
          {
            title:
              "La retención se está usando como estrategia de contratación",
            body: "La respuesta más efectiva que vemos no es reclutar con más agresividad; es proteger el banco que ya existe. Las organizaciones que mapearon su riesgo de sucesión e hicieron dos o tres movimientos internos dirigidos están corriendo menos búsquedas externas este año, y las que corren arrancan desde una mejor posición.",
          },
        ],
      },
      {
        body: [
          "Lo que resta del año favorecerá a las organizaciones que se muevan rápido para asegurar talento prioritario, inviertan en desarrollo de liderazgo y diseñen una compensación total alineada con lo que los candidatos realmente están decidiendo. Planear ahora es lo que construye el banco y la capacidad del año siguiente.",
          "Publicamos lo que vemos en búsquedas en curso, no lo que arroja un panel de encuestas. Si quiere la lectura de un puesto, una región o una banda salarial en particular, [cuéntenos en qué está trabajando](/contact) — o vea [cómo trabajamos con clientes](/for-clients).",
        ],
      },
    ],
    takeawaysHeading: "Puntos clave",
    takeaways: [
      {
        icon: "chart",
        title: "Demanda estrecha y profunda",
        body: "La actividad se concentra en operaciones, automatización, calidad y cadena de suministro, no repartida por todo el organigrama.",
      },
      {
        icon: "scale",
        title: "La velocidad gana más que el dinero",
        body: "Las contraofertas llegan antes que las decisiones. Un proceso de seis semanas compite contra quien puede moverse en dos.",
      },
      {
        icon: "map",
        title: "Lo transfronterizo pide su propio manual",
        body: "Una filosofía de compensación definida en Estados Unidos no se traslada sin cambios al Bajío ni al corredor fronterizo.",
      },
    ],

    pullQuote:
      "Los fabricantes que ganen este año serán los que alineen la estrategia de talento con la del negocio — invirtiendo en los líderes correctos, en los puestos correctos, en el momento correcto.",
    pullQuoteBy: "Equipo de Inteligencia de Mercado ARSAN",

    stat: {
      figure: "4.8%", // @unverified: cites a 'Q3 2025 ARSAN Manufacturing Talent Market Report' that has never been produced
      body: "de aumento promedio en la compensación total en efectivo de los puestos clave de liderazgo en manufactura, año contra año.",
      source:
        "Fuente: Reporte ARSAN del Mercado de Talento en Manufactura, T3 2025",
    },

    asideHeading: "Preguntas para llevar a su equipo",
    asideItems: [
      "¿Cuántos días pasan entre nuestra entrevista final y una oferta firmada, y en qué se van?",
      "¿Qué dos puestos nos costaría reemplazar en 90 días si los perdiéramos mañana?",
      "¿Nuestra compensación en México se define localmente o se hereda de una banda de Estados Unidos?",
    ],
  },
};
