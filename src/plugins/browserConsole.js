// Plugin personalizado para redirigir los logs del navegador a la terminal
export default function browserConsole() {
  return {
    name: 'browser-console',
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `<script>
          const originalConsole = window.console;
          window.console = {
            log: (...args) => {
              originalConsole.log(...args);
              fetch('/browser-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'log', args })
              }).catch(() => {});
            },
            error: (...args) => {
              originalConsole.error(...args);
              fetch('/browser-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'error', args })
              }).catch(() => {});
            },
            warn: (...args) => {
              originalConsole.warn(...args);
              fetch('/browser-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'warn', args })
              }).catch(() => {});
            },
            info: (...args) => {
              originalConsole.info(...args);
              fetch('/browser-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'info', args })
              }).catch(() => {});
            }
          };

          // Capturar errores no manejados
          window.addEventListener('error', (event) => {
            fetch('/browser-log', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                type: 'uncaught-error', 
                args: [
                  \`ERROR en \${event.filename}:\${event.lineno}:\${event.colno} - \${event.message}\`, 
                  event.error
                ] 
              })
            }).catch(() => {});
          });

          // Capturar promesas rechazadas no manejadas
          window.addEventListener('unhandledrejection', (event) => {
            fetch('/browser-log', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                type: 'unhandled-rejection', 
                args: ['Promesa rechazada no manejada:', event.reason] 
              })
            }).catch(() => {});
          });
        </script></head>`
      );
    },
    configureServer(server) {
      // Crear un endpoint para recibir los logs
      server.middlewares.use((req, res, next) => {
        if (req.url === '/browser-log' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const { type, args } = JSON.parse(body);
              
              // Formatear la salida con colores
              switch (type) {
                case 'log':
                  console.log('\x1b[37m[Browser]\x1b[0m', ...args);
                  break;
                case 'error':
                case 'uncaught-error':
                  console.error('\x1b[31m[Browser Error]\x1b[0m', ...args);
                  break;
                case 'warn':
                  console.warn('\x1b[33m[Browser Warning]\x1b[0m', ...args);
                  break;
                case 'info':
                  console.info('\x1b[36m[Browser Info]\x1b[0m', ...args);
                  break;
                case 'unhandled-rejection':
                  console.error('\x1b[35m[Browser Unhandled Rejection]\x1b[0m', ...args);
                  break;
              }
            } catch (e) {
              console.error('Error procesando log del navegador:', e);
            }
            res.statusCode = 200;
            res.end();
          });
        } else {
          next();
        }
      });
    }
  };
} 