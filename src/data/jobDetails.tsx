// Datos detallados de empleos para la vista detallada
const jobDetails = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Montevideo",
    salary: "$80,000 - $120,000",
    employmentType: "Full-time",
    description: "Estamos buscando un Frontend Developer con experiencia en React y TypeScript para unirse a nuestro equipo de desarrollo. Serás responsable del diseño e implementación de interfaces de usuario para nuestras aplicaciones web, asegurando una experiencia de usuario óptima y un rendimiento excepcional.",
    responsibilities: [
      "Desarrollar interfaces de usuario con React y TypeScript",
      "Implementar diseños responsivos y accesibles",
      "Optimizar el rendimiento de las aplicaciones frontend",
      "Colaborar con diseñadores UX/UI y desarrolladores backend",
      "Mantener y mejorar el código existente"
    ],
    requirements: [
      "Al menos 3 años de experiencia con React",
      "Conocimientos sólidos de TypeScript",
      "Experiencia con gestión de estado (Redux, Context API)",
      "Conocimientos de HTML5, CSS3 y JavaScript moderno",
      "Capacidad para escribir código limpio y mantenible"
    ],
    benefits: [
      "Horario flexible",
      "Trabajo remoto parcial",
      "Seguro médico completo",
      "Oportunidades de desarrollo profesional",
      "Ambiente de trabajo colaborativo"
    ],
    postedDate: "2023-09-15",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp"
  },
  {
    id: "2",
    title: "UX Designer",
    company: "DesignHub",
    location: "Remote",
    salary: "$70,000 - $90,000",
    employmentType: "Contract",
    description: "DesignHub está en búsqueda de un UX Designer creativo y orientado a datos para unirse a nuestro equipo de diseño. El candidato ideal tendrá una sólida comprensión de la experiencia de usuario, investigación de usuarios y prototipado, con capacidad para transformar ideas complejas en interfaces intuitivas y atractivas.",
    responsibilities: [
      "Realizar investigación de usuarios y análisis de competencia",
      "Crear wireframes, prototipos y flujos de usuario",
      "Colaborar con equipos de producto y desarrollo",
      "Realizar pruebas de usabilidad e implementar mejoras",
      "Mantener y evolucionar nuestras guías de estilo"
    ],
    requirements: [
      "Experiencia comprobada en diseño UX/UI",
      "Dominio de herramientas como Figma y Adobe Creative Suite",
      "Conocimientos de principios de diseño e interacción",
      "Capacidad para recibir y aplicar feedback constructivo",
      "Portafolio de proyectos relevantes"
    ],
    benefits: [
      "Trabajo 100% remoto",
      "Horario flexible",
      "Contrato renovable",
      "Oportunidades de participar en proyectos variados",
      "Ambiente de trabajo internacional"
    ],
    postedDate: "2023-09-10",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DesignHub"
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "DataSystems",
    location: "Canelones",
    salary: "$100,000 - $140,000",
    employmentType: "Full-time",
    description: "Buscamos un Backend Engineer experimentado para desarrollar y mantener servicios escalables y robustos. El candidato ideal tiene experiencia con Node.js, bases de datos SQL/NoSQL y arquitecturas en la nube, con capacidad para diseñar APIs eficientes y mantener sistemas de alto rendimiento.",
    responsibilities: [
      "Diseñar y desarrollar APIs RESTful y GraphQL",
      "Implementar y optimizar bases de datos PostgreSQL",
      "Gestionar infraestructura en AWS",
      "Colaborar en la arquitectura de microservicios",
      "Implementar pruebas automatizadas y CI/CD"
    ],
    requirements: [
      "Experiencia con Node.js y frameworks como Express o NestJS",
      "Conocimientos avanzados de PostgreSQL",
      "Experiencia con servicios de AWS (Lambda, S3, EC2)",
      "Comprensión de principios de seguridad y autenticación",
      "Capacidad para resolver problemas complejos"
    ],
    benefits: [
      "Salario competitivo según experiencia",
      "Seguro médico premium",
      "Bonificaciones por rendimiento",
      "Plan de desarrollo profesional",
      "Horario flexible y trabajo remoto parcial"
    ],
    postedDate: "2023-09-17",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=DataSystems"
  },
  {
    id: "4",
    title: "Product Manager",
    company: "InnovateCo",
    location: "Maldonado",
    salary: "$90,000 - $130,000",
    employmentType: "Full-time",
    description: "InnovateCo busca un Product Manager con experiencia para liderar el desarrollo de nuestros productos digitales. El candidato ideal combinará visión estratégica con excelentes habilidades de ejecución, para definir roadmaps de producto, coordinar equipos multidisciplinarios y entregar soluciones que superen las expectativas de los usuarios.",
    responsibilities: [
      "Definir la estrategia y visión de los productos",
      "Gestionar roadmaps y priorizar funcionalidades",
      "Coordinar equipos de diseño y desarrollo",
      "Analizar métricas y feedback de usuarios",
      "Representar las necesidades del cliente en decisiones técnicas"
    ],
    requirements: [
      "Al menos 5 años de experiencia en gestión de productos",
      "Conocimiento de metodologías ágiles (Scrum, Kanban)",
      "Capacidad para comunicar ideas complejas de forma clara",
      "Experiencia en análisis de datos y toma de decisiones",
      "Conocimientos técnicos suficientes para comunicarse con equipos de desarrollo"
    ],
    benefits: [
      "Salario competitivo con bonos anuales",
      "Horario flexible y posibilidad de trabajo remoto",
      "Seguro médico completo para ti y tu familia",
      "Oportunidades de capacitación constante",
      "Ambiente colaborativo e innovador"
    ],
    postedDate: "2023-09-25",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=InnovateCo"
  },
  {
    id: "5",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Colonia",
    salary: "$110,000 - $150,000",
    employmentType: "Full-time",
    description: "CloudTech busca un ingeniero DevOps para optimizar nuestras operaciones de infraestructura y mejorar los procesos de entrega de software. El candidato ideal combinará conocimientos de desarrollo y operaciones, con experiencia en automatización, contenedores y orquestación para construir sistemas confiables y escalables.",
    responsibilities: [
      "Implementar y mantener pipelines de CI/CD",
      "Gestionar infraestructura en Kubernetes",
      "Diseñar arquitecturas resilientes en entornos cloud",
      "Optimizar rendimiento y costos de infraestructura",
      "Implementar y mejorar prácticas de monitoreo y alertas"
    ],
    requirements: [
      "Experiencia con Kubernetes y Docker",
      "Conocimientos de herramientas de CI/CD (Jenkins, GitHub Actions)",
      "Familiaridad con servicios de nube pública (AWS, GCP, Azure)",
      "Habilidades en scripting (Bash, Python)",
      "Conocimiento de prácticas de seguridad en la nube"
    ],
    benefits: [
      "Salario competitivo según nivel de experiencia",
      "Bonificaciones por rendimiento y logro de objetivos",
      "Seguro médico y dental para ti y familiares directos",
      "Horario flexible y opciones de trabajo remoto",
      "Presupuesto anual para capacitación y certificaciones"
    ],
    postedDate: "2023-09-12",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CloudTech"
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Montevideo",
    salary: "$95,000 - $135,000",
    employmentType: "Part-time",
    description: "AnalyticsPro está en búsqueda de un Data Scientist para ayudarnos a extraer conocimiento valioso de grandes volúmenes de datos. El candidato ideal tendrá sólidos conocimientos en estadística, machine learning y programación, con capacidad para aplicar métodos avanzados de análisis para resolver problemas de negocio complejos.",
    responsibilities: [
      "Desarrollar modelos de machine learning y algoritmos predictivos",
      "Analizar grandes conjuntos de datos para identificar patrones",
      "Colaborar con equipos de producto y negocio",
      "Presentar resultados y recomendaciones a stakeholders",
      "Implementar soluciones escalables de ciencia de datos"
    ],
    requirements: [
      "Experiencia en Python y bibliotecas de ciencia de datos",
      "Conocimientos de SQL y bases de datos",
      "Experiencia con frameworks de machine learning",
      "Comprensión de estadística y métodos de modelado",
      "Capacidad para comunicar conceptos técnicos a audiencias no técnicas"
    ],
    benefits: [
      "Horario flexible de medio tiempo",
      "Oportunidades de crecimiento a tiempo completo",
      "Acceso a recursos de computación avanzados",
      "Participación en proyectos de investigación innovadores",
      "Ambiente colaborativo con profesionales del sector"
    ],
    postedDate: "2023-09-24",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnalyticsPro"
  },
  {
    id: "7",
    title: "Java Developer",
    company: "SoftSolutions",
    location: "Salto",
    salary: "$85,000 - $115,000",
    employmentType: "Full-time",
    description: "SoftSolutions busca incorporar un Java Developer con experiencia en desarrollo de aplicaciones empresariales. El candidato ideal tendrá un sólido conocimiento de Java, Spring Framework y arquitecturas de microservicios, con capacidad para diseñar e implementar soluciones escalables y mantenibles.",
    responsibilities: [
      "Desarrollar aplicaciones basadas en Java y Spring Boot",
      "Diseñar y mantener microservicios",
      "Implementar APIs RESTful y servicios web",
      "Participar en revisiones de código y pruebas",
      "Colaborar en la mejora continua de la arquitectura"
    ],
    requirements: [
      "Al menos 3 años de experiencia con Java",
      "Conocimientos de Spring Framework y Spring Boot",
      "Experiencia con bases de datos relacionales (MySQL, PostgreSQL)",
      "Comprensión de patrones de diseño y buenas prácticas",
      "Capacidad para trabajar en equipo y mentorar a desarrolladores junior"
    ],
    benefits: [
      "Desarrollo profesional continuo",
      "Seguro médico y dental",
      "Horario flexible",
      "Bono por rendimiento anual",
      "Ambiente de trabajo colaborativo y de aprendizaje"
    ],
    postedDate: "2023-09-17",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SoftSolutions"
  },
  {
    id: "8",
    title: "Mobile Developer",
    company: "AppFactory",
    location: "Paysandú",
    salary: "$75,000 - $100,000",
    employmentType: "Contract",
    description: "AppFactory está buscando un Mobile Developer con experiencia en desarrollo multiplataforma para trabajar en proyectos innovadores. El candidato ideal tendrá experiencia en React Native o tecnologías similares, con capacidad para crear aplicaciones móviles de alto rendimiento y excelente experiencia de usuario.",
    responsibilities: [
      "Desarrollar aplicaciones móviles multiplataforma",
      "Implementar interfaces de usuario responsivas",
      "Integrar APIs y servicios externos",
      "Optimizar el rendimiento y consumo de recursos",
      "Participar en el ciclo completo de desarrollo de producto"
    ],
    requirements: [
      "Experiencia en desarrollo con React Native",
      "Conocimientos de JavaScript/TypeScript",
      "Experiencia en integración con APIs RESTful",
      "Comprensión de los principios de UI/UX para móviles",
      "Capacidad para resolver problemas técnicos complejos"
    ],
    benefits: [
      "Contrato renovable con posibilidad de permanencia",
      "Horario flexible",
      "Trabajo remoto parcial",
      "Participación en proyectos variados e innovadores",
      "Ambiente de trabajo dinámico y colaborativo"
    ],
    postedDate: "2023-09-10",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=AppFactory"
  },
  {
    id: "9",
    title: "Marketing Specialist",
    company: "BrandGenius",
    location: "Montevideo",
    salary: "$65,000 - $85,000",
    employmentType: "Full-time",
    description: "BrandGenius busca un Marketing Specialist para desarrollar e implementar estrategias de marketing digital efectivas. El candidato ideal tendrá experiencia en campañas de redes sociales, SEO/SEM y análisis de datos, con capacidad para crear contenido atractivo e impulsar el crecimiento de la marca.",
    responsibilities: [
      "Gestionar campañas de marketing digital en múltiples canales",
      "Crear y optimizar contenido para redes sociales y sitio web",
      "Implementar estrategias de SEO/SEM",
      "Analizar métricas y KPIs para optimizar campañas",
      "Colaborar con equipos de diseño y ventas"
    ],
    requirements: [
      "Experiencia en marketing digital y redes sociales",
      "Conocimientos de SEO/SEM y herramientas analíticas",
      "Capacidad para crear contenido atractivo",
      "Habilidades analíticas y orientación a resultados",
      "Excelente comunicación escrita y verbal"
    ],
    benefits: [
      "Seguro médico y dental",
      "Horario flexible",
      "Plan de desarrollo profesional",
      "Ambiente de trabajo dinámico",
      "Oportunidades de crecimiento dentro de la empresa"
    ],
    postedDate: "2023-09-16",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=BrandGenius"
  },
  {
    id: "10",
    title: "Financial Analyst",
    company: "CapitalGroup",
    location: "Montevideo",
    salary: "$75,000 - $95,000",
    employmentType: "Full-time",
    description: "CapitalGroup busca un Financial Analyst con experiencia en modelado financiero y análisis de datos para apoyar la toma de decisiones estratégicas. El candidato ideal combinará habilidades analíticas con conocimientos financieros sólidos para proporcionar insights valiosos que impulsen el crecimiento y la rentabilidad.",
    responsibilities: [
      "Desarrollar modelos financieros y análisis de escenarios",
      "Preparar reportes financieros y presentaciones para la gerencia",
      "Analizar tendencias de mercado y competidores",
      "Evaluar oportunidades de inversión y riesgos",
      "Colaborar con equipos de finanzas y operaciones"
    ],
    requirements: [
      "Licenciatura en Finanzas, Economía o campo relacionado",
      "Experiencia en modelado financiero y análisis de datos",
      "Dominio avanzado de Excel y herramientas de visualización",
      "Conocimientos de principios contables y financieros",
      "Capacidad para comunicar conceptos financieros a audiencias no técnicas"
    ],
    benefits: [
      "Salario competitivo con bonos anuales",
      "Seguro médico completo",
      "Plan de pensiones",
      "Oportunidades de desarrollo profesional",
      "Ambiente de trabajo profesional y colaborativo"
    ],
    postedDate: "2023-09-06",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=CapitalGroup"
  },
  {
    id: "11",
    title: "HR Manager",
    company: "TalentForce",
    location: "Punta del Este",
    salary: "$90,000 - $110,000",
    employmentType: "Full-time",
    description: "TalentForce busca un HR Manager experimentado para liderar todas las iniciativas de recursos humanos, incluyendo reclutamiento, relaciones con empleados, desarrollo organizacional y políticas de RRHH. El candidato ideal combinará visión estratégica con excelentes habilidades interpersonales para crear un ambiente laboral positivo y productivo.",
    responsibilities: [
      "Desarrollar e implementar estrategias de recursos humanos",
      "Supervisar procesos de reclutamiento y selección",
      "Gestionar políticas de compensación y beneficios",
      "Implementar programas de desarrollo profesional",
      "Resolver conflictos y promover una cultura organizacional positiva"
    ],
    requirements: [
      "Al menos 5 años de experiencia en posiciones de RRHH",
      "Conocimientos de legislación laboral uruguaya",
      "Experiencia en gestión de talento y desarrollo organizacional",
      "Excelentes habilidades de comunicación y liderazgo",
      "Capacidad para influir positivamente en todos los niveles de la organización"
    ],
    benefits: [
      "Salario competitivo según experiencia",
      "Seguro médico premium para ti y familiares",
      "Horario flexible y trabajo remoto parcial",
      "Oportunidades de desarrollo profesional continuo",
      "Bonos por desempeño"
    ],
    postedDate: "2023-09-10",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TalentForce"
  },
  {
    id: "12",
    title: "Content Writer",
    company: "WordCraft",
    location: "Remote",
    salary: "$50,000 - $70,000",
    employmentType: "Part-time",
    description: "WordCraft busca un Content Writer creativo para producir contenido atractivo y optimizado para SEO en diversos formatos. El candidato ideal tendrá excelentes habilidades de redacción, conocimientos de SEO y capacidad para adaptar su estilo a diferentes audiencias y marcas.",
    responsibilities: [
      "Crear contenido para blogs, redes sociales y sitios web",
      "Redactar contenido optimizado para SEO",
      "Editar y revisar textos para asegurar su calidad",
      "Investigar temas relevantes para diferentes industrias",
      "Colaborar con equipos de marketing y diseño"
    ],
    requirements: [
      "Experiencia probada en redacción de contenido digital",
      "Conocimientos de principios SEO y mejores prácticas",
      "Excelentes habilidades de investigación y síntesis",
      "Capacidad para cumplir plazos ajustados",
      "Portfolio de trabajos previos"
    ],
    benefits: [
      "Trabajo 100% remoto con horario flexible",
      "Pago por proyecto o por horas según preferencia",
      "Oportunidades para clientes internacionales",
      "Posibilidad de crecimiento a tiempo completo",
      "Ambiente creativo y colaborativo"
    ],
    postedDate: "2023-09-17",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=WordCraft"
  },
  {
    id: "13",
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    location: "Montevideo",
    salary: "$100,000 - $130,000",
    employmentType: "Full-time",
    description: "SecureNet busca un Cybersecurity Analyst experimentado para proteger nuestros sistemas e infraestructura contra amenazas cibernéticas. El candidato ideal tendrá conocimientos sólidos en seguridad de redes, análisis de vulnerabilidades y respuesta a incidentes, con capacidad para implementar medidas de seguridad proactivas.",
    responsibilities: [
      "Monitorear sistemas para detectar posibles vulnerabilidades",
      "Realizar pruebas de penetración y evaluaciones de seguridad",
      "Implementar y mantener soluciones de seguridad",
      "Responder a incidentes de seguridad",
      "Desarrollar políticas y procedimientos de seguridad"
    ],
    requirements: [
      "Experiencia en seguridad de redes y sistemas",
      "Conocimientos de herramientas de monitoreo y análisis de seguridad",
      "Certificaciones relevantes (CISSP, CEH, Security+)",
      "Familiaridad con frameworks de cumplimiento (ISO 27001, NIST)",
      "Capacidad para trabajar bajo presión en situaciones críticas"
    ],
    benefits: [
      "Salario altamente competitivo",
      "Seguro médico premium",
      "Horario flexible y trabajo remoto parcial",
      "Presupuesto para certificaciones y educación continua",
      "Bono anual por desempeño"
    ],
    postedDate: "2023-09-25",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SecureNet"
  },
  {
    id: "14",
    title: "Sales Representative",
    company: "RevenuePro",
    location: "Colonia",
    salary: "$60,000 - $90,000 + commission",
    employmentType: "Full-time",
    description: "RevenuePro está en busca de un Sales Representative motivado y orientado a resultados para expandir nuestra cartera de clientes y gestionar relaciones comerciales. El candidato ideal tendrá experiencia en ventas B2B, excelentes habilidades de comunicación y negociación, y un enfoque proactivo para alcanzar y superar metas de ventas.",
    responsibilities: [
      "Identificar y contactar potenciales clientes",
      "Realizar presentaciones de ventas efectivas",
      "Negociar contratos y cerrar acuerdos",
      "Mantener relaciones con clientes existentes",
      "Alcanzar y superar metas de ventas mensuales"
    ],
    requirements: [
      "Experiencia comprobada en ventas B2B",
      "Excelentes habilidades de comunicación y persuasión",
      "Conocimiento de CRM y herramientas de ventas",
      "Capacidad para trabajar con objetivos y métricas",
      "Actitud positiva y resiliente"
    ],
    benefits: [
      "Estructura de comisiones competitiva",
      "Seguro médico y dental",
      "Vehículo de la empresa o compensación por transporte",
      "Programa de incentivos y bonos",
      "Oportunidades de crecimiento profesional"
    ],
    postedDate: "2023-09-15",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=RevenuePro"
  },
  {
    id: "15",
    title: "Project Coordinator",
    company: "OrganizeWell",
    location: "Montevideo",
    salary: "$70,000 - $85,000",
    employmentType: "Contract",
    description: "OrganizeWell busca un Project Coordinator meticuloso y eficiente para gestionar la planificación, ejecución y seguimiento de proyectos. El candidato ideal tendrá excelentes habilidades organizativas, experiencia en gestión de proyectos y capacidad para coordinar equipos multidisciplinarios para alcanzar los objetivos en tiempo y forma.",
    responsibilities: [
      "Coordinar actividades y recursos de los proyectos",
      "Desarrollar y mantener cronogramas detallados",
      "Gestionar la comunicación entre stakeholders",
      "Monitorear el progreso y gestionar riesgos",
      "Preparar reportes e informes de estado"
    ],
    requirements: [
      "Experiencia en coordinación o gestión de proyectos",
      "Conocimiento de metodologías de gestión de proyectos",
      "Dominio de herramientas como MS Project, Asana o similares",
      "Excelentes habilidades de comunicación y organización",
      "Capacidad para trabajar con múltiples prioridades"
    ],
    benefits: [
      "Contrato renovable con posibilidad de permanencia",
      "Ambiente de trabajo colaborativo",
      "Horario flexible",
      "Proyectos desafiantes e interesantes",
      "Desarrollo profesional continuo"
    ],
    postedDate: "2023-09-10",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=OrganizeWell"
  },
  {
    id: "16",
    title: "QA Engineer",
    company: "QualityAssure",
    location: "Tacuarembó",
    salary: "$75,000 - $100,000",
    employmentType: "Full-time",
    description: "QualityAssure busca un QA Engineer experimentado para garantizar la calidad de nuestros productos de software. El candidato ideal tendrá experiencia en pruebas automatizadas y manuales, con capacidad para diseñar y ejecutar planes de prueba exhaustivos que aseguren que nuestras aplicaciones cumplan con los más altos estándares de calidad.",
    responsibilities: [
      "Diseñar y ejecutar casos de prueba manuales y automatizados",
      "Identificar, documentar y seguir defectos",
      "Desarrollar y mantener frameworks de automatización",
      "Colaborar con equipos de desarrollo para resolver problemas",
      "Participar en la mejora continua de procesos de QA"
    ],
    requirements: [
      "Experiencia en testing de software",
      "Conocimientos de herramientas de automatización",
      "Familiaridad con metodologías ágiles",
      "Habilidades de comunicación y documentación",
      "Atención al detalle y pensamiento crítico"
    ],
    benefits: [
      "Salario competitivo según experiencia",
      "Seguro médico completo",
      "Horario flexible y trabajo remoto parcial",
      "Oportunidades de capacitación continua",
      "Ambiente de trabajo colaborativo"
    ],
    postedDate: "2023-09-16",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=QualityAssure"
  },
  {
    id: "17",
    title: "Graphic Designer",
    company: "VisualArts",
    location: "Remote",
    salary: "$60,000 - $80,000",
    employmentType: "Contract",
    description: "VisualArts busca un Graphic Designer creativo para desarrollar materiales visuales atractivos para diversas plataformas y medios. El candidato ideal combinará creatividad artística con sólidos conocimientos técnicos, y tendrá la capacidad de transformar conceptos abstractos en diseños impactantes que comuniquen efectivamente el mensaje de la marca.",
    responsibilities: [
      "Crear diseños para web, redes sociales y materiales impresos",
      "Desarrollar elementos de identidad visual de marca",
      "Colaborar con equipos de marketing y contenido",
      "Mantener coherencia visual en todos los materiales",
      "Mantenerse actualizado sobre tendencias de diseño"
    ],
    requirements: [
      "Experiencia en diseño gráfico y visual",
      "Dominio de Adobe Creative Suite",
      "Conocimientos de diseño web y móvil",
      "Excelente sentido estético y atención al detalle",
      "Portfolio que demuestre habilidades creativas"
    ],
    benefits: [
      "Trabajo 100% remoto",
      "Horario flexible",
      "Contrato renovable con posibilidad de permanencia",
      "Proyectos creativos variados",
      "Ambiente profesional que valora la innovación"
    ],
    postedDate: "2023-09-18",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=VisualArts"
  },
  {
    id: "18",
    title: "Customer Support Specialist",
    company: "HelpDesk",
    location: "Maldonado",
    salary: "$45,000 - $55,000",
    employmentType: "Full-time",
    description: "HelpDesk busca un Customer Support Specialist orientado al servicio para brindar soporte excepcional a nuestros clientes. El candidato ideal tendrá excelentes habilidades de comunicación, capacidad para resolver problemas eficientemente y una genuina pasión por ayudar a los clientes a tener la mejor experiencia posible con nuestros productos.",
    responsibilities: [
      "Responder consultas de clientes por teléfono, email y chat",
      "Resolver problemas técnicos y no técnicos",
      "Documentar interacciones con clientes en sistema CRM",
      "Escalar problemas complejos cuando sea necesario",
      "Proporcionar feedback para mejorar productos y servicios"
    ],
    requirements: [
      "Experiencia en servicio al cliente o soporte técnico",
      "Excelentes habilidades de comunicación verbal y escrita",
      "Capacidad para manejar situaciones difíciles con empatía",
      "Conocimiento de sistemas de ticketing y CRM",
      "Orientación a la resolución de problemas"
    ],
    benefits: [
      "Horario flexible",
      "Seguro médico básico",
      "Programa de reconocimiento de empleados",
      "Ambiente de trabajo amigable",
      "Oportunidades de crecimiento dentro de la empresa"
    ],
    postedDate: "2023-09-14",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=HelpDesk"
  },
  {
    id: "19",
    title: "Business Analyst",
    company: "InsightSolutions",
    location: "Montevideo",
    salary: "$80,000 - $110,000",
    employmentType: "Full-time",
    description: "InsightSolutions está en búsqueda de un Business Analyst experimentado para actuar como puente entre nuestros clientes y equipos técnicos. El candidato ideal combinará habilidades analíticas con excelente comunicación, y tendrá la capacidad de traducir necesidades de negocio en requisitos técnicos claros para impulsar soluciones efectivas.",
    responsibilities: [
      "Recopilar y documentar requisitos de negocio",
      "Crear modelos de procesos y diagramas de flujo",
      "Realizar análisis de datos y generar insights",
      "Colaborar con stakeholders técnicos y no técnicos",
      "Evaluar soluciones y recomendar mejoras"
    ],
    requirements: [
      "Experiencia en análisis de negocio y requisitos",
      "Conocimiento de metodologías de modelado de procesos",
      "Habilidades avanzadas en Excel y herramientas de análisis",
      "Excelente comunicación y habilidades de presentación",
      "Capacidad para gestionar múltiples proyectos simultáneamente"
    ],
    benefits: [
      "Salario competitivo según experiencia",
      "Seguro médico completo",
      "Horario flexible y trabajo remoto parcial",
      "Plan de desarrollo profesional",
      "Ambiente dinámico con proyectos desafiantes"
    ],
    postedDate: "2023-09-17",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=InsightSolutions"
  },
  {
    id: "20",
    title: "Full Stack Engineer",
    company: "OmniTech",
    location: "Canelones",
    salary: "$90,000 - $135,000",
    employmentType: "Full-time",
    description: "OmniTech busca un Full Stack Engineer versátil y experimentado para desarrollar aplicaciones web de extremo a extremo. El candidato ideal tendrá sólidos conocimientos en tecnologías frontend y backend, con capacidad para diseñar, implementar y mantener soluciones completas que ofrezcan experiencias de usuario excepcionales.",
    responsibilities: [
      "Desarrollar aplicaciones web con React en el frontend y Node.js en el backend",
      "Diseñar e implementar APIs RESTful",
      "Gestionar bases de datos MongoDB y su integración",
      "Colaborar en la implementación de CI/CD y DevOps",
      "Participar en todo el ciclo de desarrollo del producto"
    ],
    requirements: [
      "Experiencia en React, Node.js y MongoDB",
      "Conocimientos de arquitectura de software y patrones de diseño",
      "Familiaridad con herramientas de control de versiones (Git)",
      "Experiencia en implementación de pruebas unitarias y de integración",
      "Capacidad para trabajar de forma autónoma y en equipo"
    ],
    benefits: [
      "Salario competitivo basado en experiencia",
      "Seguro médico premium",
      "Horario flexible con opción de trabajo remoto",
      "Presupuesto para desarrollo profesional",
      "Ambiente innovador con tecnologías de punta"
    ],
    postedDate: "2023-09-25",
    companyLogo: "https://api.dicebear.com/7.x/avataaars/svg?seed=OmniTech"
  }
];

export default jobDetails; 