# PocketStore

Este es un catalogo de productos hecho con HTML, CSS y JavaScript puro. La aplicacion tambien funciona sin internet despues de cargarla una vez.

## Archivos principales

- `index.html`: estructura de la pagina.
- `styles.css`: estilos.
- `app.js`: carga y busca productos.
- `sw.js`: guarda archivos para usarlos sin internet.
- `manifest.json`: permite instalar la pagina como una app.
- `icons/`: iconos de la aplicacion.
- `docs/images/`: imagenes del proceso y de la arquitectura.

## Como ejecutar el proyecto

Es necesario usar un servidor local porque el Service Worker no funciona abriendo el HTML directamente.

```bash
python -m http.server 8000
```

Despues se abre esta direccion en el navegador:

`http://localhost:8000`

Para probar el modo offline, primero se carga la pagina con internet. Luego se puede desconectar internet y recargar.

## Productos

El catalogo usa publicaciones de la API publica [JSONPlaceholder](https://jsonplaceholder.typicode.com/). Se muestran como elementos del catalogo. Se pueden cambiar por usuarios u otros datos modificando la URL y los campos en `app.js`.

La aplicacion guarda los ultimos productos vistos en el navegador, por eso puede mostrar el catalogo aunque no haya conexion.

## Autor

Proyecto individual para practicar aplicaciones web offline y Progressive Web Apps.