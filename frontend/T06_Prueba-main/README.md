# AulaLab — Sistema de Inscripción a Talleres

Aplicación de frontend desarrollada únicamente con Angular y Template Driven Forms para cumplir el reto práctico de inscripción a talleres.

## Requisitos implementados
- Nombre completo obligatorio, mínimo 3 caracteres.
- Correo institucional obligatorio y validado.
- Especialidad: Desarrollo, Redes e Inteligencia Artificial.
- Turno mediante botones de opción: Mañana o Noche.
- Modalidad: Presencial o Virtual.
- Experiencia: Principiante, Intermedio o Avanzado.
- Registro con número de inscripción y fecha.
- Tabla con todos los campos, eliminación y estado vacío.
- Limpieza del formulario tras registrar correctamente.
- Resumen dinámico: total, mañana y noche.
- Etiquetas de colores para especialidades y turnos.
- Búsqueda y filtros en la sección Participantes.
- Vistas de Inicio, Nueva inscripción, Participantes, Resumen e informes y Guía de uso.
- Persistencia de registros en localStorage del navegador (sin servidor ni base de datos).
- Datos de demostración para preparar la evidencia de tres participantes.

## Estructura
La aplicación se encuentra en `frontend/T06_Prueba-main`. El proyecto usa Angular standalone y no requiere backend.

## Ejecutar
Abre una terminal en esta carpeta y ejecuta:

```bash
npm install
npm start
```

Visita `http://localhost:4200`.

## Compilar para verificar
```bash
npm run build
```

## Evidencias recomendadas
Consulta `../../documentacion/evidencias-y-entrega.md` para el guion del video y las capturas sugeridas.
