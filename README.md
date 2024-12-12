# Resumen de Cambios en el Proyecto

Este documento detalla los cambios realizados en el proyecto, enfocándose en funcionalidades, mejoras de accesibilidad (A11y) y pruebas.

## Cambios Generales

### Mejoras Generales

1. Eliminación de nombres redundantes en componentes y métodos para mejorar la claridad del código.
2. Refactorización de estilos para garantizar la consistencia y eliminar duplicidades.
3. Implementación de mejores prácticas de accesibilidad (A11y), incluyendo atributos ARIA y mejoras en la navegación por teclado.

---

## Componente `Login`

### Cambios Principales

1. **Validación de Campos**:
   - Se modificó una función utilitaria `validateFields` para garantizar que los campos `username` y `password` no estén vacíos antes de proceder con la autenticación.

2. **Gestión del Token**:
   - Se implementó la función `setToken` para almacenar el token en `localStorage`.
   - La lógica de almacenamiento del token fue actualizada para usar esta nueva función.

3. **Mejoras de Accesibilidad**:
   - Se añadieron atributos ARIA (`aria-live`, `role`, `aria-labelledby`) en inputs y mensajes de error.
   - Los botones deshabilitados ahora incluyen el atributo `aria-disabled`.

4. **Testing**:
   - Validación del comportamiento del formulario con pruebas unitarias para campos vacíos, manejo de errores y flujos exitosos.
   - Se añadieron pruebas para actualizaciones de inputs, estados de los botones y el indicador de carga.

---

## Vista `ProductsList`

1. **Autenticación**:
   - Se agregó una verificación para comprobar si el usuario está autenticado antes de cargar los productos. Si no está autenticado, se redirige a la página de inicio de sesión.

2. **Carga de Productos**:
   - Se refactorizó el método `fetchProducts` para manejar errores de manera adecuada y eliminar duplicidad en el código.
   - Se muestra un mensaje cuando no hay productos disponibles.

3. **Favoritos**:
   - Se reemplazó la lógica inline con la nueva función utilitaria `toggleFavorite`.
   - Se optimizó el mapeo y manejo del estado de favoritos.

4. **Integración del Componente `Navbar`**:
   - Se integró un nuevo componente `Navbar` con botón de cierre de sesión, personalizable mediante `props` y `slots`.
   - Soporte añadido para tooltips utilizando Bootstrap.

5. **Mejoras de Accesibilidad**:
   - Se añadieron etiquetas ARIA para secciones clave y descripciones de productos.
   - Soporte mejorado para la navegación por teclado en los elementos interactivos.

6. **Testing**:
   - Pruebas de carga de productos, manejo de errores y estados sin productos.
   - Verificación de la lógica para alternar favoritos y funcionalidad de cierre de sesión.
   - Pruebas de accesibilidad enfocadas en atributos ARIA y navegación por teclado.

---

## Componente `ProductCard`

1. **Propiedades y Eventos**:
   - Se estandarizó el evento de alternar favoritos como `product-favorite-clicked`.
   - Se añadieron clases condicionales para resaltar visualmente los productos favoritos.

2. **Mejoras de Accesibilidad**:
   - Los íconos decorativos ahora están marcados con `aria-hidden`.
   - Descripciones mejoradas para los lectores de pantalla en los detalles de los productos.

3. **Testing**:
   - Pruebas para los estados de favoritos, interacciones y características de accesibilidad.

---

## Funciones Utilitarias

1. **`validateFields`**:
   - Valida que los campos requeridos no estén vacíos antes de enviar datos al servidor.

2. **`toggleFavorite`**:
   - Alterna el estado de favorito de un producto en una lista de productos.

3. **Gestión de Tokens**:
   - `setToken`: Guarda un token en `localStorage`.
   - `getToken`: Recupera un token de `localStorage`.
   - `clearToken`: Elimina un token de `localStorage`.

4. **Testing**:
   - Validación del comportamiento de las funciones utilitarias con pruebas unitarias, incluyendo operaciones con tokens y validación de campos.

---

## Mejoras de Accesibilidad

1. **Mejoras Generales**:
   - Implementación de atributos ARIA (`role`, `aria-live`, `aria-labelledby`, `aria-hidden`) en los componentes para garantizar compatibilidad con lectores de pantalla.
   - Todos los elementos interactivos son completamente navegables mediante teclado.

2. **Mejoras en Formularios**:
   - Se asociaron inputs con sus etiquetas para mejorar la usabilidad con tecnologías asistivas.
   - Se añadieron notificaciones dinámicas para errores de validación.

3. **Accesibilidad Visual**:
   - Las relaciones de contraste cumplen con los estándares WCAG 2.1 AA.
   - Se añadieron estados de enfoque para todos los elementos navegables con teclado.

4. **Interacción con Productos**:
   - Se añadieron etiquetas y descripciones accesibles para los elementos de productos y sus precios.

5. **Testing**:
   - Pruebas de actualizaciones dinámicas de atributos ARIA y anuncios en tiempo real.
   - Validación de navegación por teclado y compatibilidad visual con lectores de pantalla.

---

## Testing General

### Componentes Probados

1. **`Navbar`**:
   - Verificación de inicialización de tooltips y manejo de eventos de cierre de sesión.
   - Pruebas de renderizado de slots personalizados y validación de props.

2. **`Login`**:
   - Validación de formularios, manejo de errores y flujos de inicio de sesión exitosos.
   - Pruebas de actualización de inputs y estados de carga.

3. **`ProductsList`**:
   - Cobertura de carga de productos, manejo de errores y alternancia de favoritos.
   - Validación de la lógica de autenticación y cierre de sesión.

4. **Utilidades**:
   - Pruebas para las funciones `validateFields`, `toggleFavorite` y gestión de tokens.

### Testing de Accesibilidad

1. **Actualizaciones Dinámicas**:
   - Verificación de la correcta actualización de atributos ARIA durante interacciones de usuario.
   - Validación de anuncios en regiones en vivo para errores y estados de carga.

2. **Navegación por Teclado**:
   - Confirmación de la navegabilidad mediante teclado para todos los elementos interactivos.

3. **Compatibilidad Visual y de Lectores de Pantalla**:
   - Verificación del uso correcto de `aria-hidden` y estados de enfoque para usuarios de lectores de pantalla.

---

## Actualizaciones de Estilos

1. **Consolidación**:
   - Unificación de estilos duplicados para garantizar consistencia en botones, favoritos y productos.

2. **Accesibilidad**:
   - Mejora de las relaciones de contraste para una mayor legibilidad y usabilidad.

