import type {
  Country,
  Employment,
  JobFunction,
  Level,
  Localized,
  WorkMode,
} from "./types";

/**
 * @placeholder: 29 fabricated job openings. No client has authorised any of
 * these roles and none of them exist. They render the board until the internal
 * ATS serves the real ones (SOP D-074, Q-24) — delete this file and point
 * `listOpenings()` at the ATS.
 *
 * Authored as `daysAgo` rather than dates so the board never looks abandoned
 * in a screenshot; the provider converts to the ISO `postedAt` the real
 * contract uses, and that conversion disappears with this file.
 *
 * The first five reproduce refs/dirA-job-board.png exactly. The rest exist so
 * the facets, the sort and the pagination have something real to act on — a
 * filter UI demonstrated against four rows proves nothing.
 */
export type PlaceholderOpening = {
  slug: string;
  daysAgo: number;
  title: Localized;
  company: Localized;
  location: Localized;
  country: Country;
  workMode: WorkMode;
  employment: Employment;
  level: Level;
  fn: JobFunction;
  summary: Localized;
  featured?: boolean;
};

const us = "us" as const;
const mx = "mx" as const;

export const PLACEHOLDER_OPENINGS: readonly PlaceholderOpening[] = [
  /* the three refs/dirA-for-candidates-landing.png features, in its order */
  {
    slug: "plant-manager-monterrey",
    daysAgo: 1,
    featured: true,
    title: { en: "Plant Manager", es: "Gerente de Planta" },
    company: {
      en: "World-Class Manufacturing Operation",
      es: "Operación de manufactura de clase mundial",
    },
    location: {
      en: "Monterrey, Nuevo León, Mexico",
      es: "Monterrey, Nuevo León",
    },
    country: mx,
    workMode: "onsite",
    employment: "full-time",
    level: "executive",
    fn: "operations",
    summary: {
      en: "Lead operations, drive performance, and build high-performing teams in a fast-paced, world-class manufacturing environment.",
      es: "Dirigir la operación, impulsar el desempeño y formar equipos de alto rendimiento en un entorno de manufactura de clase mundial y ritmo exigente.",
    },
  },
  {
    slug: "director-of-engineering-detroit",
    daysAgo: 2,
    featured: true,
    title: { en: "Director of Engineering", es: "Director de Ingeniería" },
    company: {
      en: "Global Mobility Platform",
      es: "Plataforma global de movilidad",
    },
    location: {
      en: "Detroit, Michigan, USA",
      es: "Detroit, Michigan, EE. UU.",
    },
    country: us,
    workMode: "hybrid",
    employment: "full-time",
    level: "executive",
    fn: "engineering",
    summary: {
      en: "Shape engineering strategy and lead new product development initiatives across a global platform.",
      es: "Definir la estrategia de ingeniería y dirigir las iniciativas de desarrollo de nuevos productos de una plataforma global.",
    },
  },
  {
    slug: "strategic-account-director-houston",
    daysAgo: 3,
    featured: true,
    title: {
      en: "Strategic Account Director",
      es: "Director de Cuentas Estratégicas",
    },
    company: {
      en: "Industrial Solutions Provider",
      es: "Proveedor de soluciones industriales",
    },
    location: { en: "Houston, Texas, USA", es: "Houston, Texas, EE. UU." },
    country: us,
    workMode: "hybrid",
    employment: "full-time",
    level: "executive",
    fn: "sales",
    summary: {
      en: "Own enterprise relationships, grow market share, and deliver value across complex manufacturing solutions.",
      es: "Responsabilizarse de las relaciones con clientes corporativos, hacer crecer la participación de mercado y entregar valor en soluciones de manufactura complejas.",
    },
  },
  {
    slug: "strategic-account-manager-electrical-products",
    daysAgo: 2,
    title: {
      en: "Strategic Account Manager - Electrical Products",
      es: "Gerente Estratégico de Cuentas - Productos Eléctricos",
    },
    company: {
      en: "Sigma Engineered Solutions",
      es: "Sigma Engineered Solutions",
    },
    location: { en: "Garner, NC", es: "Garner, Carolina del Norte" },
    country: us,
    workMode: "hybrid",
    employment: "full-time",
    level: "senior",
    fn: "sales",
    summary: {
      en: "Manage and grow key accounts in the electrical products segment, driving revenue, margin and long-term partnerships.",
      es: "Gestionar y hacer crecer cuentas clave en el segmento de productos eléctricos, impulsando ingresos, margen y relaciones de largo plazo.",
    },
  },
  {
    slug: "plant-manager-saltillo",
    daysAgo: 3,
    title: { en: "Plant Manager", es: "Gerente de Planta" },
    company: {
      en: "Global Manufacturing Company",
      es: "Empresa manufacturera global",
    },
    location: { en: "Saltillo, Coahuila, Mexico", es: "Saltillo, Coahuila" },
    country: mx,
    workMode: "onsite",
    employment: "full-time",
    level: "executive",
    fn: "operations",
    summary: {
      en: "Lead plant operations, drive continuous improvement and ensure safety, quality and delivery excellence.",
      es: "Dirigir la operación de la planta, impulsar la mejora continua y asegurar la excelencia en seguridad, calidad y entrega.",
    },
  },
  {
    slug: "director-of-supply-chain-monterrey",
    daysAgo: 5,
    title: {
      en: "Director of Supply Chain",
      es: "Director de Cadena de Suministro",
    },
    company: {
      en: "Industrial Equipment Manufacturer",
      es: "Fabricante de equipo industrial",
    },
    location: { en: "Monterrey, N.L., Mexico", es: "Monterrey, N.L." },
    country: mx,
    workMode: "onsite",
    employment: "full-time",
    level: "executive",
    fn: "supply-chain",
    summary: {
      en: "Oversee end-to-end supply chain strategy and execution to optimize performance and support business growth.",
      es: "Dirigir la estrategia y la ejecución de la cadena de suministro de extremo a extremo para optimizar el desempeño y sostener el crecimiento.",
    },
  },
  {
    slug: "engineering-manager-el-paso",
    daysAgo: 8,
    title: { en: "Engineering Manager", es: "Gerente de Ingeniería" },
    company: { en: "Precision Manufacturing", es: "Manufactura de precisión" },
    location: { en: "El Paso, TX", es: "El Paso, Texas" },
    country: us,
    workMode: "hybrid",
    employment: "full-time",
    level: "manager",
    fn: "engineering",
    summary: {
      en: "Lead engineering teams in product development and process improvement initiatives.",
      es: "Dirigir a los equipos de ingeniería en el desarrollo de producto y en iniciativas de mejora de procesos.",
    },
  },
  {
    slug: "hr-business-partner-guanajuato",
    daysAgo: 9,
    title: {
      en: "HR Business Partner",
      es: "Business Partner de Recursos Humanos",
    },
    company: { en: "Automotive Supplier", es: "Proveedor automotriz" },
    location: { en: "Guanajuato, Gto., Mexico", es: "Guanajuato, Gto." },
    country: mx,
    workMode: "onsite",
    employment: "full-time",
    level: "manager",
    fn: "human-resources",
    summary: {
      en: "Partner with leadership to drive people strategies, culture and organizational effectiveness.",
      es: "Acompañar a la dirección en la estrategia de personas, la cultura y la efectividad organizacional.",
    },
  },
  {
    slug: "vp-operations-midwest",
    daysAgo: 4,
    title: {
      en: "Vice President of Operations",
      es: "Vicepresidente de Operaciones",
    },
    company: {
      en: "Diversified Industrial Group",
      es: "Grupo industrial diversificado",
    },
    location: { en: "Milwaukee, WI", es: "Milwaukee, Wisconsin" },
    country: us,
    workMode: "onsite",
    employment: "full-time",
    level: "executive",
    fn: "operations",
    summary: {
      en: "Own multi-site manufacturing performance and build the operating rhythm for a growing industrial portfolio.",
      es: "Responsabilizarse del desempeño de manufactura multiplanta y construir la disciplina operativa de un portafolio industrial en crecimiento.",
    },
  },
  {
    slug: "quality-manager-queretaro",
    daysAgo: 6,
    title: { en: "Quality Manager", es: "Gerente de Calidad" },
    company: {
      en: "Tier 1 Automotive Manufacturer",
      es: "Fabricante automotriz Tier 1",
    },
    location: { en: "Querétaro, Qro., Mexico", es: "Querétaro, Qro." },
    country: mx,
    workMode: "onsite",
    employment: "full-time",
    level: "manager",
    fn: "quality",
    summary: {
      en: "Lead the quality system through IATF audits, customer escalations and a measurable reduction in PPM.",
      es: "Dirigir el sistema de calidad a través de auditorías IATF, escalaciones de cliente y una reducción medible de PPM.",
    },
  },
  {
    slug: "controller-manufacturing-ohio",
    daysAgo: 7,
    title: { en: "Plant Controller", es: "Contralor de Planta" },
    company: {
      en: "Precision Components Manufacturer",
      es: "Fabricante de componentes de precisión",
    },
    location: { en: "Cleveland, OH", es: "Cleveland, Ohio" },
    country: us,
    workMode: "onsite",
    employment: "full-time",
    level: "senior",
    fn: "finance",
    summary: {
      en: "Own plant financials, standard costing and the margin story behind every operational decision.",
      es: "Responsabilizarse de las finanzas de planta, el costeo estándar y la historia de margen detrás de cada decisión operativa.",
    },
  },
  {
    slug: "regional-sales-manager-southeast",
    daysAgo: 10,
    title: {
      en: "Regional Sales Manager - Southeast",
      es: "Gerente Regional de Ventas - Sureste",
    },
    company: {
      en: "Industrial Components Supplier",
      es: "Proveedor de componentes industriales",
    },
    location: { en: "Atlanta, GA", es: "Atlanta, Georgia" },
    country: us,
    workMode: "remote",
    employment: "full-time",
    level: "senior",
    fn: "sales",
    summary: {
      en: "Build and lead a distributor and direct-account territory across eight southeastern states.",
      es: "Construir y dirigir un territorio de distribuidores y cuentas directas en ocho estados del sureste.",
    },
  },
  {
    slug: "continuous-improvement-manager-juarez",
    daysAgo: 11,
    title: {
      en: "Continuous Improvement Manager",
      es: "Gerente de Mejora Continua",
    },
    company: {
      en: "Medical Device Manufacturer",
      es: "Fabricante de dispositivos médicos",
    },
    location: {
      en: "Ciudad Juárez, Chih., Mexico",
      es: "Ciudad Juárez, Chih.",
    },
    country: mx,
    workMode: "onsite",
    employment: "full-time",
    level: "manager",
    fn: "operations",
    summary: {
      en: "Run the lean roadmap across three value streams and develop the site's next generation of CI leaders.",
      es: "Ejecutar la hoja de ruta lean en tres flujos de valor y desarrollar a la siguiente generación de líderes de mejora continua.",
    },
  },
  {
    slug: "manufacturing-engineer-indiana",
    daysAgo: 12,
    title: { en: "Manufacturing Engineer", es: "Ingeniero de Manufactura" },
    company: {
      en: "Heavy Equipment Manufacturer",
      es: "Fabricante de equipo pesado",
    },
    location: { en: "Fort Wayne, IN", es: "Fort Wayne, Indiana" },
    country: us,
    workMode: "onsite",
    employment: "full-time",
    level: "mid",
    fn: "engineering",
    summary: {
      en: "Improve cycle time, tooling and line layout on a machining and assembly floor running three shifts.",
      es: "Mejorar tiempo de ciclo, herramentales y distribución de línea en un piso de maquinado y ensamble a tres turnos.",
    },
  },
  {
    slug: "supply-chain-manager-tijuana",
    daysAgo: 13,
    title: {
      en: "Supply Chain Manager",
      es: "Gerente de Cadena de Suministro",
    },
    company: {
      en: "Electronics Manufacturer",
      es: "Fabricante de electrónicos",
    },
    location: { en: "Tijuana, B.C., Mexico", es: "Tijuana, B.C." },
    country: mx,
    workMode: "onsite",
    employment: "full-time",
    level: "manager",
    fn: "supply-chain",
    summary: {
      en: "Own planning, procurement and cross-border logistics for a high-mix electronics operation.",
      es: "Responsabilizarse de planeación, compras y logística transfronteriza en una operación de electrónicos de alta mezcla.",
    },
  },
  {
    slug: "director-of-manufacturing-texas",
    daysAgo: 14,
    title: { en: "Director of Manufacturing", es: "Director de Manufactura" },
    company: {
      en: "Building Products Manufacturer",
      es: "Fabricante de productos para la construcción",
    },
    location: { en: "Dallas, TX", es: "Dallas, Texas" },
    country: us,
    workMode: "onsite",
    employment: "full-time",
    level: "executive",
    fn: "operations",
    summary: {
      en: "Lead two plants through a capacity expansion without losing service to the existing customer base.",
      es: "Conducir dos plantas a través de una expansión de capacidad sin perder servicio a la base actual de clientes.",
    },
  },
  {
    slug: "key-account-manager-bajio",
    daysAgo: 15,
    title: {
      en: "Key Account Manager - Bajío",
      es: "Gerente de Cuentas Clave - Bajío",
    },
    company: {
      en: "Industrial Automation Supplier",
      es: "Proveedor de automatización industrial",
    },
    location: { en: "León, Gto., Mexico", es: "León, Gto." },
    country: mx,
    workMode: "hybrid",
    employment: "full-time",
    level: "senior",
    fn: "sales",
    summary: {
      en: "Grow automation spend inside the region's largest automotive and appliance plants.",
      es: "Hacer crecer la inversión en automatización dentro de las mayores plantas automotrices y de línea blanca de la región.",
    },
  },
  {
    slug: "ehs-manager-alabama",
    daysAgo: 16,
    title: { en: "EHS Manager", es: "Gerente de Seguridad y Medio Ambiente" },
    company: {
      en: "Metal Fabrication Company",
      es: "Empresa de fabricación metálica",
    },
    location: { en: "Birmingham, AL", es: "Birmingham, Alabama" },
    country: us,
    workMode: "onsite",
    employment: "full-time",
    level: "manager",
    fn: "operations",
    summary: {
      en: "Build a safety culture that survives a shift change, not just an audit.",
      es: "Construir una cultura de seguridad que sobreviva a un cambio de turno, no solo a una auditoría.",
    },
  },
  {
    slug: "financial-planning-manager-monterrey",
    daysAgo: 17,
    title: { en: "FP&A Manager", es: "Gerente de Planeación Financiera" },
    company: {
      en: "Global HVAC Manufacturer",
      es: "Fabricante global de HVAC",
    },
    location: { en: "Monterrey, N.L., Mexico", es: "Monterrey, N.L." },
    country: mx,
    workMode: "hybrid",
    employment: "full-time",
    level: "manager",
    fn: "finance",
    summary: {
      en: "Own the forecast, the capital plan and the numbers the leadership team argues about.",
      es: "Responsabilizarse del pronóstico, el plan de inversión y las cifras que discute el equipo directivo.",
    },
  },
  {
    slug: "design-engineer-michigan",
    daysAgo: 18,
    title: { en: "Senior Design Engineer", es: "Ingeniero Senior de Diseño" },
    company: {
      en: "Automotive Systems Supplier",
      es: "Proveedor de sistemas automotrices",
    },
    location: { en: "Detroit, MI", es: "Detroit, Michigan" },
    country: us,
    workMode: "hybrid",
    employment: "full-time",
    level: "senior",
    fn: "engineering",
    summary: {
      en: "Take driveline components from concept to PPAP with the tier customer in the room.",
      es: "Llevar componentes de tren motriz del concepto al PPAP con el cliente tier en la sala.",
    },
  },
  {
    slug: "talent-acquisition-manager-mexico",
    daysAgo: 19,
    title: {
      en: "Talent Acquisition Manager",
      es: "Gerente de Atracción de Talento",
    },
    company: {
      en: "Consumer Products Manufacturer",
      es: "Fabricante de productos de consumo",
    },
    location: { en: "Guadalajara, Jal., Mexico", es: "Guadalajara, Jal." },
    country: mx,
    workMode: "hybrid",
    employment: "full-time",
    level: "manager",
    fn: "human-resources",
    summary: {
      en: "Stand up in-house hiring for a plant scaling from 400 to 900 people in eighteen months.",
      es: "Construir la contratación interna de una planta que pasa de 400 a 900 personas en dieciocho meses.",
    },
  },
  {
    slug: "quality-engineer-north-carolina",
    daysAgo: 20,
    title: { en: "Quality Engineer", es: "Ingeniero de Calidad" },
    company: {
      en: "Aerospace Components Manufacturer",
      es: "Fabricante de componentes aeroespaciales",
    },
    location: { en: "Charlotte, NC", es: "Charlotte, Carolina del Norte" },
    country: us,
    workMode: "onsite",
    employment: "full-time",
    level: "mid",
    fn: "quality",
    summary: {
      en: "Own AS9100 compliance, first-article inspection and root cause on a low-volume, high-consequence line.",
      es: "Responsabilizarse del cumplimiento AS9100, la inspección de primer artículo y el análisis de causa raíz en una línea de bajo volumen y alta consecuencia.",
    },
  },
  {
    slug: "operations-supervisor-tennessee",
    daysAgo: 21,
    title: { en: "Operations Supervisor", es: "Supervisor de Operaciones" },
    company: { en: "Packaging Manufacturer", es: "Fabricante de empaque" },
    location: { en: "Memphis, TN", es: "Memphis, Tennessee" },
    country: us,
    workMode: "onsite",
    employment: "full-time",
    level: "mid",
    fn: "operations",
    summary: {
      en: "Run a night shift of sixty people and own the handover the day shift inherits.",
      es: "Dirigir un turno nocturno de sesenta personas y responsabilizarse del relevo que hereda el turno de día.",
    },
  },
  {
    slug: "logistics-manager-laredo",
    daysAgo: 22,
    title: {
      en: "Cross-Border Logistics Manager",
      es: "Gerente de Logística Transfronteriza",
    },
    company: { en: "Contract Manufacturer", es: "Manufacturero por contrato" },
    location: { en: "Laredo, TX", es: "Laredo, Texas" },
    country: us,
    workMode: "onsite",
    employment: "full-time",
    level: "senior",
    fn: "supply-chain",
    summary: {
      en: "Own customs, carriers and the dwell time between two plants on either side of the river.",
      es: "Responsabilizarse de aduanas, transportistas y el tiempo muerto entre dos plantas a cada lado del río.",
    },
  },
  {
    slug: "cost-accountant-puebla",
    daysAgo: 23,
    title: { en: "Cost Accountant", es: "Contador de Costos" },
    company: { en: "Appliance Manufacturer", es: "Fabricante de línea blanca" },
    location: { en: "Puebla, Pue., Mexico", es: "Puebla, Pue." },
    country: mx,
    workMode: "onsite",
    employment: "full-time",
    level: "entry",
    fn: "finance",
    summary: {
      en: "Build the standard cost picture a new product line will be judged against.",
      es: "Construir la estructura de costo estándar contra la que se medirá una nueva línea de producto.",
    },
  },
  {
    slug: "maintenance-manager-arkansas",
    daysAgo: 24,
    title: { en: "Maintenance Manager", es: "Gerente de Mantenimiento" },
    company: {
      en: "Food Processing Manufacturer",
      es: "Procesador de alimentos",
    },
    location: { en: "Springdale, AR", es: "Springdale, Arkansas" },
    country: us,
    workMode: "onsite",
    employment: "full-time",
    level: "manager",
    fn: "operations",
    summary: {
      en: "Move a reactive maintenance organization onto a planned schedule without stopping the line.",
      es: "Llevar una organización de mantenimiento reactivo a un programa planeado sin detener la línea.",
    },
  },
  {
    slug: "inside-sales-representative-illinois",
    daysAgo: 26,
    title: {
      en: "Inside Sales Representative",
      es: "Representante de Ventas Internas",
    },
    company: { en: "Fastener Distributor", es: "Distribuidor de sujetadores" },
    location: { en: "Chicago, IL", es: "Chicago, Illinois" },
    country: us,
    workMode: "hybrid",
    employment: "full-time",
    level: "mid",
    fn: "sales",
    summary: {
      en: "Quote, close and keep a book of industrial accounts that buy every week.",
      es: "Cotizar, cerrar y sostener una cartera de cuentas industriales que compran cada semana.",
    },
  },
  {
    slug: "hr-manager-sonora",
    daysAgo: 27,
    title: { en: "Human Resources Manager", es: "Gerente de Recursos Humanos" },
    company: { en: "Wire Harness Manufacturer", es: "Fabricante de arneses" },
    location: { en: "Hermosillo, Son., Mexico", es: "Hermosillo, Son." },
    country: mx,
    workMode: "onsite",
    employment: "full-time",
    level: "manager",
    fn: "human-resources",
    summary: {
      en: "Own labour relations, staffing and retention for a plant of 1,200 in a tight local market.",
      es: "Responsabilizarse de relaciones laborales, dotación y retención en una planta de 1,200 personas en un mercado local apretado.",
    },
  },
  {
    slug: "interim-plant-manager-ohio",
    daysAgo: 25,
    title: { en: "Interim Plant Manager", es: "Gerente de Planta Interino" },
    company: { en: "Industrial Manufacturer", es: "Fabricante industrial" },
    location: { en: "Toledo, OH", es: "Toledo, Ohio" },
    country: us,
    workMode: "onsite",
    employment: "contract",
    level: "executive",
    fn: "operations",
    summary: {
      en: "Hold a site steady for nine months while a permanent search runs alongside.",
      es: "Sostener la operación de un sitio durante nueve meses mientras corre en paralelo una búsqueda definitiva.",
    },
  },
  {
    slug: "contract-quality-engineer-saltillo",
    daysAgo: 28,
    title: {
      en: "Quality Engineer (Contract)",
      es: "Ingeniero de Calidad (por contrato)",
    },
    company: { en: "Automotive Manufacturer", es: "Fabricante automotriz" },
    location: { en: "Ramos Arizpe, Coah., Mexico", es: "Ramos Arizpe, Coah." },
    country: mx,
    workMode: "onsite",
    employment: "contract",
    level: "mid",
    fn: "quality",
    summary: {
      en: "Twelve-month assignment closing out a customer containment and the corrective actions behind it.",
      es: "Asignación de doce meses para cerrar una contención de cliente y las acciones correctivas que la originaron.",
    },
  },
  {
    slug: "contract-supply-planner-el-paso",
    daysAgo: 29,
    title: {
      en: "Supply Planner (Contract)",
      es: "Planeador de Suministro (por contrato)",
    },
    company: {
      en: "Consumer Electronics Manufacturer",
      es: "Fabricante de electrónica de consumo",
    },
    location: { en: "El Paso, TX", es: "El Paso, Texas" },
    country: us,
    workMode: "remote",
    employment: "contract",
    level: "mid",
    fn: "supply-chain",
    summary: {
      en: "Cover a parental leave through a peak season and hand back a cleaner planning parameter set.",
      es: "Cubrir una licencia de maternidad o paternidad durante la temporada alta y devolver una parametrización de planeación más limpia.",
    },
  },
  {
    slug: "temporary-recruiter-monterrey",
    daysAgo: 30,
    title: { en: "Recruiter (Temporary)", es: "Reclutador (temporal)" },
    company: { en: "Industrial Manufacturer", es: "Fabricante industrial" },
    location: { en: "Apodaca, N.L., Mexico", es: "Apodaca, N.L." },
    country: mx,
    workMode: "hybrid",
    employment: "temporary",
    level: "mid",
    fn: "human-resources",
    summary: {
      en: "Six-month surge hire to staff a second shift before it opens.",
      es: "Contratación temporal de seis meses para dotar un segundo turno antes de que arranque.",
    },
  },
] as const;
