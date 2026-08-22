import type { Article } from "./types";

/**
 * refs/dirA-casestudy-vacant-to-victorious.png. This one is a case study that
 * the comp lays out as an article — split navy hero, prose column, rail, Key
 * Takeaways — and breadcrumbs as Home > Insights > Case Study. It lives here
 * rather than in `content/case-studies/` because the template it uses is the
 * one this directory owns, and a case study under /results that renders the
 * insights layout would be a route lying about which page type it is.
 */
export const fromVacantToVictorious: Article = {
  slug: "from-vacant-to-victorious",
  categoryKey: "caseStudy",
  photo: "story-critical-search",
  published: "2025-06-30",
  readingMinutes: 6,

  en: {
    title:
      "From Vacant to Victorious: How We Helped a Manufacturer Build a World-Class Team",
    deck: "See how we solved a critical talent gap for a precision components manufacturer—filling hard-to-find roles, strengthening leadership, and driving measurable results.",
    metaTitle: "Case Study: Building a World-Class Manufacturing Team",
    metaDescription:
      "Critical roles open for months, productivity suffering, leadership stretched thin. How ARSAN reset the talent strategy for a precision components manufacturer.",
    imageAlt:
      "Two engineers in hard hats and safety glasses reviewing data on a tablet on a plant floor.",

    lede: [
      "A rapidly growing manufacturer of precision engineered components faced a challenge many companies know all too well: critical roles were open for months, productivity was suffering, and leadership bandwidth was stretched thin. They needed more than resumes—they needed the right talent strategy and a partner who could deliver.",
      "ARSAN partnered with the executive team to identify the root causes, build a targeted approach, and deliver a world-class team that unlocked growth and operational excellence.",
    ],

    sections: [
      {
        heading: "The Challenge",
        body: [
          "The company was experiencing rapid growth, but their team structure hadn't kept pace. Key leadership and technical roles—many requiring niche manufacturing expertise—were hard to fill. Turnover was rising, and internal teams lacked the capacity to execute a comprehensive search strategy while keeping operations on track.",
        ],
      },
      {
        heading: "Our Approach",
        body: [
          "We built a tailored talent strategy focused on speed, precision, and long-term impact.",
        ],
        checks: [
          {
            lead: "Market Intelligence:",
            body: "Mapped the talent landscape and identified passive candidates with specialized skills.",
          },
          {
            lead: "Targeted Search:",
            body: "Leveraged our manufacturing network to engage high-quality candidates who weren't actively looking.",
          },
          {
            lead: "Rigorous Evaluation:",
            body: "Assessed for technical expertise, cultural fit, and leadership potential.",
          },
          {
            lead: "Consultative Partnership:",
            body: "Worked closely with leadership to refine roles, compensation strategies, and the candidate experience.",
          },
        ],
      },
      {
        heading: "The Results",
        body: [
          "Within six months, we placed key leaders and technical experts across the organization—stabilizing operations, strengthening the leadership bench, and positioning the company for its next stage of growth.",
        ],
      },
    ],

    takeawaysHeading: "Key Takeaways",
    takeaways: [
      {
        icon: "users",
        title: "Define Roles with Precision",
        body: "A clear understanding of needs attracts the right talent faster.",
      },
      {
        icon: "target",
        title: "Access Hidden Talent Markets",
        body: "The best candidates often aren't active—reach where others don't.",
      },
      {
        icon: "factory",
        title: "Build for Long-Term Impact",
        body: "Great hires drive performance today and growth tomorrow.",
      },
    ],

    pullQuote:
      "ARSAN didn't just fill roles—they transformed our team. Their insight, speed, and commitment to our success made all the difference.",
    pullQuoteBy: "Chief Executive Officer", // @unverified: client testimonial reproduced from the Direction A comp — no client has approved these words
    pullQuoteOrg: "Precision Components Manufacturer",

    stat: {
      figure: "32%", // @unverified: outcome figure invented by the comp — needs the client's own performance data or removal
      body: "increase in on-time delivery performance within 6 months of key leadership placements.",
      source: "Source: Company performance data",
    },

    asideHeading: "Before you reopen a stalled search",
    asideItems: [
      "Which of these roles has been open long enough to be costing more than the hire?",
      "Is the specification describing the work, or describing the last person who did it?",
      "Who would you want in the seat who would never answer a job posting?",
    ],
  },

  es: {
    title:
      "De la vacante al triunfo: cómo ayudamos a un fabricante a formar un equipo de clase mundial",
    deck: "Vea cómo resolvimos una brecha crítica de talento para un fabricante de componentes de precisión: cubriendo puestos difíciles, fortaleciendo el liderazgo y generando resultados medibles.",
    metaTitle:
      "Caso de éxito: formar un equipo de manufactura de clase mundial",
    metaDescription:
      "Puestos críticos abiertos durante meses, productividad afectada y un equipo directivo al límite. Cómo ARSAN replanteó la estrategia de talento de un fabricante de componentes de precisión.",
    imageAlt:
      "Dos ingenieros con casco y lentes de seguridad revisando datos en una tableta en el piso de planta.",

    lede: [
      "Un fabricante de componentes de precisión en rápido crecimiento enfrentaba un reto que muchas empresas conocen bien: puestos críticos llevaban meses abiertos, la productividad se resentía y la capacidad del equipo directivo estaba al límite. Necesitaban más que currículums: necesitaban la estrategia de talento correcta y un socio capaz de ejecutarla.",
      "ARSAN trabajó con el equipo directivo para identificar las causas de fondo, construir un enfoque dirigido y entregar un equipo de clase mundial que destrabó el crecimiento y la excelencia operativa.",
    ],

    sections: [
      {
        heading: "El reto",
        body: [
          "La empresa crecía con rapidez, pero su estructura de equipo no había seguido el paso. Puestos clave de liderazgo y técnicos —muchos con experiencia de nicho en manufactura— eran difíciles de cubrir. La rotación iba en aumento y los equipos internos no tenían capacidad para ejecutar una búsqueda integral sin descuidar la operación.",
        ],
      },
      {
        heading: "Nuestro enfoque",
        body: [
          "Construimos una estrategia de talento a la medida, enfocada en velocidad, precisión e impacto de largo plazo.",
        ],
        checks: [
          {
            lead: "Inteligencia de mercado:",
            body: "Mapeamos el panorama de talento e identificamos candidatos pasivos con habilidades especializadas.",
          },
          {
            lead: "Búsqueda dirigida:",
            body: "Usamos nuestra red en manufactura para acercarnos a candidatos de alto nivel que no estaban buscando activamente.",
          },
          {
            lead: "Evaluación rigurosa:",
            body: "Evaluamos capacidad técnica, afinidad cultural y potencial de liderazgo.",
          },
          {
            lead: "Acompañamiento consultivo:",
            body: "Trabajamos de cerca con la dirección para afinar los puestos, las estrategias de compensación y la experiencia del candidato.",
          },
        ],
      },
      {
        heading: "Los resultados",
        body: [
          "En seis meses colocamos líderes y especialistas técnicos clave en toda la organización: estabilizando la operación, fortaleciendo la banca de liderazgo y preparando a la empresa para su siguiente etapa de crecimiento.",
        ],
      },
    ],

    takeawaysHeading: "Puntos clave",
    takeaways: [
      {
        icon: "users",
        title: "Defina los puestos con precisión",
        body: "Entender bien la necesidad atrae al talento correcto más rápido.",
      },
      {
        icon: "target",
        title: "Llegue al talento que no busca",
        body: "Los mejores candidatos rara vez están activos: busque donde otros no.",
      },
      {
        icon: "factory",
        title: "Contrate pensando en el largo plazo",
        body: "Una gran contratación rinde hoy y sostiene el crecimiento mañana.",
      },
    ],

    pullQuote:
      "ARSAN no solo cubrió puestos: transformó nuestro equipo. Su criterio, su velocidad y su compromiso con nuestro éxito hicieron toda la diferencia.",
    pullQuoteBy: "Director General", // @unverified: client testimonial reproduced from the Direction A comp — no client has approved these words
    pullQuoteOrg: "Fabricante de componentes de precisión",

    stat: {
      figure: "32%", // @unverified: outcome figure invented by the comp — needs the client's own performance data or removal
      body: "de aumento en el cumplimiento de entregas a tiempo dentro de los seis meses posteriores a las colocaciones clave.",
      source: "Fuente: datos de desempeño de la empresa",
    },

    asideHeading: "Antes de reabrir una búsqueda detenida",
    asideItems: [
      "¿Cuál de estos puestos lleva abierto lo suficiente para costar más que la contratación?",
      "¿El perfil describe el trabajo, o describe a la última persona que lo hizo?",
      "¿A quién querría en ese puesto que nunca respondería a una vacante publicada?",
    ],
  },
};
