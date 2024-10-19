## Requerimientos para descargar el proyecto:
1. Node o Nvm/Nvs (Node Manager Package) 

## Pasos para levantar el proyecto
1. Clonar repositorio: git clone <url>
2. Correr el comando ‘npm install’ en el proyecto para instalar dependencias
3. Correr ‘npm run dev’ para levantarlo.

## Si hay errores
1. Eliminar el node_modules y package-lock.json. Se puede hacer con el comando ‘rm -rf <nombre_archivo>’
2. Volver a correr el comando ‘npm install’
3. Correr ‘npm install react-intersection-observer@latest’ para resolver falla de version de dependencia al levantar proyecto.
4. Correr ‘npm run dev’ nuevamente.

# React + Vite
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
