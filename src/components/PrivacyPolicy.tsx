import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
          <p className="text-gray-600">Última actualización: 1 de mayo de 2023</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introducción</h2>
            <p>
              En JobSearch, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta Política de Privacidad describe cómo recopilamos, usamos y compartimos su información cuando utiliza nuestra plataforma web y servicios relacionados (en adelante, "la Plataforma").
            </p>
            <p>
              Al utilizar nuestra Plataforma, usted acepta las prácticas descritas en esta Política de Privacidad. Si no está de acuerdo con esta política, por favor, no utilice nuestra Plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Información que Recopilamos</h2>
            <p>Podemos recopilar los siguientes tipos de información:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">2.1. Información Personal</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Información de registro</strong>: nombre, dirección de correo electrónico, contraseña.</li>
              <li><strong>Información de perfil</strong>: foto, educación, experiencia laboral, habilidades, ubicación.</li>
              <li><strong>Documentos</strong>: currículum vitae, cartas de presentación, portafolios.</li>
              <li><strong>Información de contacto</strong>: número de teléfono, dirección postal.</li>
              <li><strong>Para empresas</strong>: nombre de la empresa, sector, tamaño, información de contacto del representante.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">2.2. Información Automática</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Datos de uso</strong>: cómo interactúa con nuestra Plataforma, qué páginas visita, cuánto tiempo permanece en ellas.</li>
              <li><strong>Información del dispositivo</strong>: tipo de dispositivo, sistema operativo, tipo de navegador, configuración de idioma.</li>
              <li><strong>Datos de ubicación</strong>: información de ubicación general basada en su dirección IP.</li>
              <li><strong>Cookies y tecnologías similares</strong>: utilizamos cookies y tecnologías similares para recopilar información sobre su actividad, navegador y dispositivo.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Cómo Utilizamos su Información</h2>
            <p>Utilizamos la información recopilada para los siguientes propósitos:</p>
            
            <ul className="list-disc pl-6 mb-4">
              <li>Proporcionar, mantener y mejorar nuestra Plataforma y servicios.</li>
              <li>Procesar y gestionar su cuenta, incluido el envío de notificaciones relacionadas con su cuenta.</li>
              <li>Para candidatos: facilitar la búsqueda de empleo y la aplicación a ofertas de trabajo.</li>
              <li>Para empresas: facilitar la publicación de ofertas de trabajo y la búsqueda de candidatos.</li>
              <li>Personalizar su experiencia y proporcionarle contenido y ofertas relevantes.</li>
              <li>Comunicarnos con usted, responder a sus consultas y proporcionar soporte al cliente.</li>
              <li>Enviarle información sobre actualizaciones, características nuevas, promociones y otros eventos.</li>
              <li>Detectar, investigar y prevenir actividades fraudulentas y no autorizadas.</li>
              <li>Cumplir con obligaciones legales y resolver disputas.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Cómo Compartimos su Información</h2>
            <p>Podemos compartir su información en las siguientes circunstancias:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">4.1. Con otros usuarios</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Para candidatos</strong>: su perfil, currículum y otra información profesional puede ser visible para las empresas que utilizan nuestra Plataforma.</li>
              <li><strong>Para empresas</strong>: la información de su empresa y las ofertas de trabajo publicadas serán visibles para los candidatos.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">4.2. Con proveedores de servicios</h3>
            <p>
              Compartimos información con proveedores de servicios que nos ayudan a operar, mantener y mejorar nuestra Plataforma, como proveedores de alojamiento, análisis, procesamiento de pagos y comunicación por correo electrónico.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">4.3. Por razones legales</h3>
            <p>
              Podemos divulgar su información si creemos de buena fe que dicha divulgación es necesaria para:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Cumplir con una obligación legal, proceso judicial o solicitud gubernamental.</li>
              <li>Proteger los derechos, la propiedad o la seguridad de JobSearch, nuestros usuarios o el público.</li>
              <li>Detectar, prevenir o abordar fraudes, abusos o problemas técnicos o de seguridad.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para recopilar información sobre su actividad, navegador y dispositivo. Las cookies son pequeños archivos de texto que los sitios web colocan en su dispositivo para recordar sus preferencias o mejorar su experiencia.
            </p>
            <p>
              Puede configurar su navegador para rechazar todas o algunas cookies, o para alertarle cuando los sitios web establezcan o accedan a cookies. Sin embargo, si desactiva o rechaza las cookies, algunas partes de nuestra Plataforma pueden volverse inaccesibles o no funcionar correctamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas diseñadas para proteger la seguridad de cualquier información personal que procesamos. Sin embargo, ningún sistema de seguridad es impenetrable y no podemos garantizar la seguridad absoluta de su información.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Retención de Datos</h2>
            <p>
              Conservaremos su información personal solo durante el tiempo necesario para cumplir con los propósitos para los que la recopilamos, incluido el cumplimiento de requisitos legales, contables o de informes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Sus Derechos de Privacidad</h2>
            <p>
              Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, como:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Acceder y recibir una copia de su información personal.</li>
              <li>Rectificar información inexacta o incompleta.</li>
              <li>Solicitar la eliminación de su información personal.</li>
              <li>Oponerse al procesamiento de su información personal.</li>
              <li>Solicitar la restricción del procesamiento de su información personal.</li>
              <li>Solicitar la portabilidad de su información personal.</li>
              <li>Retirar su consentimiento en cualquier momento.</li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctenos a través de los medios proporcionados en la sección "Contacto" a continuación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Transferencias Internacionales de Datos</h2>
            <p>
              Su información puede transferirse y mantenerse en computadoras ubicadas fuera de su estado, provincia, país u otra jurisdicción gubernamental donde las leyes de protección de datos pueden diferir de las de su jurisdicción.
            </p>
            <p>
              Si se encuentra fuera de España y elige proporcionarnos información, tenga en cuenta que transferimos los datos, incluida la información personal, a España y los procesamos allí.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Cambios a esta Política de Privacidad</h2>
            <p>
              Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "última actualización" en la parte superior.
            </p>
            <p>
              Se le aconseja revisar esta Política de Privacidad periódicamente para cualquier cambio. Los cambios a esta Política de Privacidad son efectivos cuando se publican en esta página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contacto</h2>
            <p>
              Si tiene preguntas o inquietudes sobre esta Política de Privacidad, contáctenos en:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Email: <a href="mailto:privacy@jobsearch.com" className="text-primary hover:underline">privacy@jobsearch.com</a></li>
              <li>Dirección: Calle Gran Vía 28, 28013 Madrid, España</li>
              <li><a href="/contact" className="text-primary hover:underline">Formulario de contacto</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
  };
  
export default PrivacyPolicy; 