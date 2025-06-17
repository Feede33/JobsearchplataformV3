-- Datos de prueba para la tabla jobs
INSERT INTO public.jobs (id, title, company, location, description, salary, requirements, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Desarrollador Frontend', 'TechCorp', 'Remoto', 'Empresa busca desarrollador frontend con experiencia en React y TypeScript', '$2000 - $3500', 'React, TypeScript, 2+ años de experiencia', now(), now()),
(gen_random_uuid(), 'Desarrollador Backend Node.js', 'InnovateSoft', 'Buenos Aires', 'Desarrollador backend con experiencia en Node.js y bases de datos', '$2500 - $4000', 'Node.js, Express, PostgreSQL, 3+ años de experiencia', now(), now()),
(gen_random_uuid(), 'Diseñador UX/UI', 'CreativeMinds', 'Córdoba', 'Diseñador UX/UI para aplicación móvil en crecimiento', '$1800 - $3000', 'Figma, Adobe XD, experiencia en diseño de aplicaciones móviles', now(), now()),
(gen_random_uuid(), 'DevOps Engineer', 'CloudTech', 'Remoto', 'Ingeniero DevOps para gestionar infraestructura en la nube', '$3000 - $4500', 'AWS, Docker, Kubernetes, CI/CD', now(), now()),
(gen_random_uuid(), 'Data Scientist', 'DataInnovate', 'Buenos Aires', 'Científico de datos para proyecto de machine learning', '$2800 - $4200', 'Python, TensorFlow, experiencia en ML', now(), now());

-- Insertar datos de ejemplo en la tabla jobs
INSERT INTO jobs (title, company, logo, location, salary, type, requirements, description, posted_date, category, is_featured, is_remote)
VALUES
  (
    'Frontend Developer',
    'TechCorp',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=TechCorp',
    'Montevideo',
    '$80,000 - $120,000',
    'Full-time',
    '["React", "TypeScript", "3+ years experience"]',
    'Estamos buscando un desarrollador frontend con experiencia en React y TypeScript para unirse a nuestro equipo. El candidato ideal tendrá al menos 3 años de experiencia en desarrollo web y estará familiarizado con las mejores prácticas de UI/UX.',
    '2 days ago',
    'Desarrollo de Software',
    true,
    false
  ),
  (
    'UX Designer',
    'DesignHub',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignHub',
    'Remote',
    '$70,000 - $90,000',
    'Contract',
    '["Figma", "User Research", "Prototyping"]',
    'Buscamos un diseñador UX para trabajar en proyectos innovadores. El candidato debe tener experiencia en investigación de usuarios, creación de prototipos y trabajo con Figma.',
    '1 week ago',
    'Diseño UX/UI',
    false,
    true
  ),
  (
    'Backend Engineer',
    'DataSystems',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=DataSystems',
    'Canelones',
    '$100,000 - $140,000',
    'Full-time',
    '["Node.js", "PostgreSQL", "AWS"]',
    'Estamos contratando un ingeniero backend con experiencia en Node.js, PostgreSQL y AWS. El candidato ideal tendrá experiencia en arquitectura de microservicios y optimización de bases de datos.',
    '3 days ago',
    'Desarrollo de Software',
    true,
    false
  ),
  (
    'Product Manager',
    'InnovateCo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=InnovateCo',
    'Maldonado',
    '$90,000 - $130,000',
    'Full-time',
    '["Agile", "Roadmapping", "5+ years experience"]',
    'Buscamos un Product Manager experimentado para liderar nuestros equipos de desarrollo. Debe tener experiencia en metodologías ágiles y planificación de productos.',
    'Just now',
    'Gestión de Productos',
    true,
    false
  ),
  (
    'DevOps Engineer',
    'CloudTech',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=CloudTech',
    'Colonia',
    '$110,000 - $150,000',
    'Full-time',
    '["Kubernetes", "Docker", "CI/CD"]',
    'Se busca ingeniero DevOps con experiencia en Kubernetes, Docker y CI/CD. El candidato ideal tendrá conocimientos de automatización y infraestructura como código.',
    '5 days ago',
    'Desarrollo de Software',
    false,
    false
  ),
  (
    'Data Scientist',
    'AnalyticsPro',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=AnalyticsPro',
    'Montevideo',
    '$95,000 - $135,000',
    'Part-time',
    '["Python", "Machine Learning", "SQL"]',
    'Buscamos un científico de datos con experiencia en Python, machine learning y SQL. El candidato trabajará en proyectos de análisis de datos y desarrollo de modelos predictivos.',
    '1 day ago',
    'Ciencia de Datos',
    false,
    false
  ),
  (
    'Marketing Specialist',
    'GrowthLabs',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=GrowthLabs',
    'Remote',
    '$60,000 - $85,000',
    'Full-time',
    '["SEO", "Content Marketing", "Analytics"]',
    'Buscamos un especialista en marketing digital con experiencia en SEO, marketing de contenidos y análisis de datos. El candidato trabajará en estrategias de crecimiento para nuestros clientes.',
    '3 days ago',
    'Marketing Digital',
    false,
    true
  ),
  (
    'Customer Support Representative',
    'ServiceFirst',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=ServiceFirst',
    'Montevideo',
    '$35,000 - $45,000',
    'Full-time',
    '["Communication", "Problem Solving", "CRM Software"]',
    'Estamos contratando representantes de atención al cliente con excelentes habilidades de comunicación y resolución de problemas. Se valorará experiencia con software CRM.',
    '1 week ago',
    'Atención al Cliente',
    false,
    false
  ),
  (
    'Sales Executive',
    'RevenuePro',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=RevenuePro',
    'Punta del Este',
    '$50,000 - $80,000 + commission',
    'Full-time',
    '["B2B Sales", "Negotiation", "CRM"]',
    'Buscamos un ejecutivo de ventas con experiencia en ventas B2B y habilidades de negociación. Ofrecemos un salario base competitivo más comisiones.',
    '2 days ago',
    'Ventas',
    false,
    false
  ),
  (
    'Mobile Developer',
    'AppWorks',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=AppWorks',
    'Remote',
    '$85,000 - $110,000',
    'Full-time',
    '["React Native", "iOS", "Android"]',
    'Estamos buscando un desarrollador móvil con experiencia en React Native y desarrollo nativo para iOS y Android. El candidato trabajará en aplicaciones móviles innovadoras.',
    '4 days ago',
    'Desarrollo de Software',
    false,
    true
  ),
  (
    'Java Developer',
    'SoftSolutions',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=SoftSolutions',
    'Salto',
    '$85,000 - $115,000',
    'Full-time',
    '["Java", "Spring", "Microservices"]',
    'Buscamos un desarrollador Java con experiencia en Spring y arquitectura de microservicios. El candidato ideal tendrá conocimientos de desarrollo backend y APIs RESTful.',
    '3 days ago',
    'Desarrollo de Software',
    false,
    false
  ),
  (
    'Financial Analyst',
    'CapitalGroup',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=CapitalGroup',
    'Montevideo',
    '$75,000 - $95,000',
    'Full-time',
    '["Financial Modeling", "Excel", "Data Analysis"]',
    'Estamos contratando un analista financiero con experiencia en modelado financiero y análisis de datos. Se requiere excelente manejo de Excel y conocimientos de finanzas corporativas.',
    '2 weeks ago',
    'Finanzas',
    false,
    false
  ),
  (
    'HR Manager',
    'TalentForce',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=TalentForce',
    'Punta del Este',
    '$90,000 - $110,000',
    'Full-time',
    '["Recruitment", "Employee Relations", "HR Policies"]',
    'Buscamos un gerente de recursos humanos con experiencia en reclutamiento, relaciones laborales y desarrollo de políticas de RRHH. El candidato liderará nuestro equipo de recursos humanos.',
    '1 week ago',
    'Recursos Humanos',
    false,
    false
  ),
  (
    'Content Writer',
    'MediaGroup',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=MediaGroup',
    'Remote',
    '$40,000 - $60,000',
    'Part-time',
    '["Copywriting", "SEO", "Social Media"]',
    'Estamos buscando un redactor de contenidos con experiencia en copywriting, SEO y redes sociales. El candidato creará contenido atractivo para nuestros clientes en diversos sectores.',
    '5 days ago',
    'Marketing Digital',
    false,
    true
  ),
  (
    'Project Manager',
    'BuildCorp',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=BuildCorp',
    'Montevideo',
    '$80,000 - $100,000',
    'Full-time',
    '["PMP", "Scrum", "Project Planning"]',
    'Buscamos un gerente de proyectos certificado PMP con experiencia en metodologías ágiles y planificación de proyectos. El candidato gestionará proyectos de construcción y desarrollo.',
    '1 day ago',
    'Gestión de Proyectos',
    true,
    false
  );

-- Función para crear perfiles de admin automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, updated_at, user_id, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NULL, NOW(), NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfiles automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();