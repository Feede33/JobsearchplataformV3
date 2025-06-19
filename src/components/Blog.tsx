import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Search } from "lucide-react";
import { blogPosts, BlogPost } from "./BlogData";

// Componente principal del Blog
const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtrar posts por búsqueda y categoría
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Obtener categorías únicas para el filtro
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Blog | JobSearch</title>
        <meta name="description" content="Artículos sobre búsqueda de empleo, desarrollo profesional y consejos para empresas." />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-2">Blog de JobSearch</h1>
        <p className="text-xl text-gray-600 text-center mb-12">
          Recursos y consejos para impulsar tu carrera profesional y mejorar tus procesos de selección
        </p>

        {/* Buscador y filtros */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Buscador */}
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar artículos..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro de categorías */}
            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de artículos */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(post.date)}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{post.readTime} min de lectura</span>
                    <Link 
                      to={`/blog/${post.id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Leer más →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron artículos</h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda o selecciona otra categoría.
            </p>
          </div>
        )}

        {/* Suscripción al newsletter */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Suscríbete a nuestro newsletter</h2>
            <p className="text-gray-600 mb-6">
              Recibe los mejores artículos y consejos directamente en tu bandeja de entrada.
              No enviamos spam, solo contenido relevante para tu desarrollo profesional.
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

export default Blog; 