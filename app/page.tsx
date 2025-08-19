"use client"

import React, { useState, useEffect } from 'react';
import { Github, Mail, ExternalLink, Code2, Terminal, User, Folder, Activity } from 'lucide-react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const navigation = [
    { id: 'home', label: '~/home', icon: User },
    { id: 'projects', label: '~/projects', icon: Folder },
    { id: 'github', label: '~/github', icon: Github },
    { id: 'contact', label: '~/contact', icon: Mail }
  ];

  const HomeSection = () => (
    <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="mb-8">
        <div className="text-green-400 text-sm mb-2 font-mono">$ whoami</div>
        <h1 className="text-4xl md:text-6xl font-mono font-bold text-white mb-4 leading-tight">
          Full Stack<br />
          <span className="text-green-400">Developer</span>
        </h1>
        <div className="text-gray-400 font-mono text-lg max-w-2xl leading-relaxed">
          <span className="text-green-400">&gt;</span> Construyendo experiencias web modernas<br />
          <span className="text-green-400">&gt;</span> Next.js, React, Node.js<br />
          <span className="text-green-400">&gt;</span> Apasionado por el código limpio
        </div>
      </div>
      
      <div className="flex gap-4 mb-12">
        <button className="bg-green-400 text-black px-6 py-3 font-mono font-semibold hover:bg-green-300 transition-colors">
          Ver Proyectos
        </button>
        <button className="border border-gray-600 text-white px-6 py-3 font-mono hover:border-green-400 transition-colors">
          Descargar CV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div className="border border-gray-800 p-6 bg-gray-900/50">
          <Code2 className="text-green-400 mb-4" size={24} />
          <h3 className="text-white font-mono text-lg mb-2">Frontend</h3>
          <p className="text-gray-400 font-mono text-sm">React, Next.js, TypeScript, Tailwind CSS</p>
        </div>
        <div className="border border-gray-800 p-6 bg-gray-900/50">
          <Terminal className="text-green-400 mb-4" size={24} />
          <h3 className="text-white font-mono text-lg mb-2">Backend</h3>
          <p className="text-gray-400 font-mono text-sm">Node.js, PostgreSQL, MongoDB, API REST</p>
        </div>
        <div className="border border-gray-800 p-6 bg-gray-900/50">
          <Activity className="text-green-400 mb-4" size={24} />
          <h3 className="text-white font-mono text-lg mb-2">Herramientas</h3>
          <p className="text-gray-400 font-mono text-sm">Git, Docker, Vercel, AWS</p>
        </div>
      </div>
    </div>
  );

  const ProjectsSection = () => (
    <div className="space-y-8">
      <div className="text-green-400 text-sm mb-6 font-mono">$ ls ~/projects</div>
      
      {[1, 2, 3].map((project) => (
        <div key={project} className="border border-gray-800 bg-gray-900/30 p-6 hover:border-green-400 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-white font-mono text-xl group-hover:text-green-400 transition-colors">
              proyecto-{project}.js
            </h3>
            <div className="flex gap-2">
              <ExternalLink className="text-gray-400 hover:text-green-400 cursor-pointer" size={20} />
              <Github className="text-gray-400 hover:text-green-400 cursor-pointer" size={20} />
            </div>
          </div>
          <p className="text-gray-400 font-mono text-sm mb-4 leading-relaxed">
            Descripción del proyecto aquí. Una aplicación web moderna construida con Next.js y tecnologías actuales.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['Next.js', 'TypeScript', 'Tailwind'].map((tech) => (
              <span key={tech} className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 border border-gray-700">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const GitHubSection = () => (
    <div className="space-y-8">
      <div className="text-green-400 text-sm mb-6 font-mono">$ git status</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border border-gray-800 bg-gray-900/30 p-6">
          <h3 className="text-white font-mono text-lg mb-4">Estadísticas</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Repositorios públicos:</span>
              <span className="text-green-400">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total de commits:</span>
              <span className="text-green-400">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Lenguaje principal:</span>
              <span className="text-green-400">JavaScript</span>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-800 bg-gray-900/30 p-6">
          <h3 className="text-white font-mono text-lg mb-4">Actividad Reciente</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="text-gray-400">
              <span className="text-green-400">+</span> Pushed to main branch
            </div>
            <div className="text-gray-400">
              <span className="text-blue-400">*</span> Created new repository
            </div>
            <div className="text-gray-400">
              <span className="text-yellow-400">!</span> Updated README.md
            </div>
          </div>
        </div>
      </div>

      <div className="border border-gray-800 bg-gray-900/30 p-6">
        <h3 className="text-white font-mono text-lg mb-4">Gráfico de Contribuciones</h3>
        <div className="grid grid-cols-53 gap-1 w-full overflow-x-auto">
          {Array.from({length: 371}).map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 ${Math.random() > 0.7 ? 'bg-green-400' : Math.random() > 0.4 ? 'bg-green-600' : 'bg-gray-800'}`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs font-mono text-gray-400 mt-2">
          <span>Menos</span>
          <span>Más</span>
        </div>
      </div>
    </div>
  );

  const ContactSection = () => (
    <div className="max-w-2xl">
      <div className="text-green-400 text-sm mb-6 font-mono">$ cat contact.txt</div>
      
      <div className="space-y-6 font-mono">
        <p className="text-gray-300 text-lg leading-relaxed">
          ¿Tienes un proyecto en mente? Me encantaría colaborar contigo y hacer realidad tus ideas.
        </p>
        
        <div className="space-y-4">
          <a href="mailto:tu@email.com" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors">
            <Mail size={20} />
            <span>tu@email.com</span>
          </a>
          <a href="https://github.com/tu-usuario" className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors">
            <Github size={20} />
            <span>github.com/tu-usuario</span>
          </a>
        </div>

        <div className="mt-8 border border-gray-800 bg-gray-900/30 p-6">
          <h3 className="text-white text-lg mb-4">Enviar mensaje</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Nombre"
              className="w-full bg-gray-800 border border-gray-700 p-3 text-white font-mono focus:border-green-400 focus:outline-none"
            />
            <input 
              type="email" 
              placeholder="Email"
              className="w-full bg-gray-800 border border-gray-700 p-3 text-white font-mono focus:border-green-400 focus:outline-none"
            />
            <textarea 
              placeholder="Mensaje"
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 p-3 text-white font-mono focus:border-green-400 focus:outline-none resize-none"
            />
            <button className="bg-green-400 text-black px-6 py-3 font-mono font-semibold hover:bg-green-300 transition-colors">
              Enviar mensaje
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch(activeSection) {
      case 'home': return <HomeSection />;
      case 'projects': return <ProjectsSection />;
      case 'github': return <GitHubSection />;
      case 'contact': return <ContactSection />;
      default: return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-green-400 font-bold text-lg">
            dev@portfolio:~$
          </div>
          <nav className="flex gap-6">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                  activeSection === id 
                    ? 'text-green-400 border-b border-green-400' 
                    : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8 py-16">
        {renderSection()}
      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-gray-500 font-mono text-sm">
            <span className="text-green-400">➜</span> {activeSection} 
            <span className="animate-pulse ml-1">▊</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;