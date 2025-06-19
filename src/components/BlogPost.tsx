import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Facebook, Twitter, Linkedin } from "lucide-react";

// Importar los datos de ejemplo del blog
// En una aplicación real, estos datos vendrían de una API
import { blogPosts } from "./BlogData";

type BlogPostParams = {
  postId: string;
};

const BlogPost = () => {
  const { postId } = useParams<BlogPostParams>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    
    // Buscar el post por ID
    const foundPost = blogPosts.find(p => p.id === postId);
    
    if (foundPost) {
      setPost({
        ...foundPost,
        // Contenido completo del artículo (simulado)
        content: `
          <p class="mb-4">
            ${foundPost.excerpt}
          </p>
          <h2 class="text-2xl font-bold mt-8 mb-4">Introducción</h2>
          <p class="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, 
            nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia,
            nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          </p>
          <p class="mb-4">
            Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia,
            nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          </p>
          <h2 class="text-2xl font-bold mt-8 mb-4">Desarrollo</h2>
          <p class="mb-4">
            Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia,
            nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          </p>
          <ul class="list-disc pl-6 mb-4">
            <li class="mb-2">Punto importante relacionado con ${foundPost.title}</li>
            <li class="mb-2">Segundo punto relevante para considerar</li>
            <li class="mb-2">Tercer aspecto fundamental a tener en cuenta</li>
            <li class="mb-2">Recomendación final basada en experiencia</li>
          </ul>
          <p class="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia,
            nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia,
            nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
          </p>
          <blockquote class="border-l-4 border-blue-500 pl-4 italic my-6">
            "Una cita relevante relacionada con ${foundPost.title} que aporta valor al contenido del artículo y
            refuerza los puntos principales discutidos."
          </blockquote>
          <h2 class="text-2xl font-bold mt-8 mb-4">Conclusión</h2>
          <p class="mb-4">
            Para finalizar, es importante recordar que ${foundPost.title.toLowerCase()} es un aspecto fundamental
            en el desarrollo profesional actual. Implementar estas estrategias te ayudará a destacar y conseguir
            mejores resultados en tu carrera.
          </p>
          <p class="mb-4">
            Recuerda que la práctica constante y la actualización de conocimientos son claves para el éxito
            profesional en cualquier campo.
          </p>
        `
      });
      
      // Encontrar posts relacionados (misma categoría, excluyendo el actual)
      const related = blogPosts
        .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 3);
      
      setRelatedPosts(related);
    } else {
      // Post no encontrado
      navigate("/blog", { replace: true });
    }
    
    setLoading(false);
    
    // Scroll al inicio de la página
    window.scrollTo(0, 0);
  }, [postId, navigate]);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return null; // Redirigido por useEffect
  }

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{post.title} | Blog JobSearch</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        {/* Navegación de regreso */}
        <div className="mb-8">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al blog
          </Link>
        </div>

        {/* Cabecera del artículo */}
        <div className="mb-8 text-center">
          <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime} min de lectura</span>
            </div>
          </div>
        </div>

        {/* Imagen destacada */}
        <div className="mb-8">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Contenido del artículo */}
        <div className="max-w-3xl mx-auto">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Etiquetas */}
          <div className="mt-8 flex flex-wrap gap-2">
            <Tag className="h-5 w-5 text-gray-500" />
            {post.tags.map((tag: string) => (
              <span 
                key={tag}
                className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Compartir */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center">
              <Share2 className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700 mr-4">Compartir:</span>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-blue-400 hover:text-blue-600">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-blue-700 hover:text-blue-900">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Artículos relacionados */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Artículos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={relatedPost.image} 
                    alt={relatedPost.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                    <Link 
                      to={`/blog/${relatedPost.id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Leer más →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Newsletter */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">¿Te ha gustado este artículo?</h2>
            <p className="text-gray-600 mb-6">
              Suscríbete a nuestro newsletter para recibir más contenido como este directamente en tu correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost; 