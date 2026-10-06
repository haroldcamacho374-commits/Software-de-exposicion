# Biblioteca: préstamos
Vue 3 + Quasar + Vue Router + Pinia, solo frontend.

    npm install
    npm run dev

**Cómo sabe el sistema si un libro está disponible:** no existe un campo "disponible". Un libro está prestado si tiene un préstamo sin `returnedAt`; el estado (disponible / prestado / vencido) se deriva en el store de Pinia (`status(bookId)`). Cada préstamo y devolución queda como un registro, así el historial de un libro o usuario es un filtro sobre `loans`.

**Persistencia:** sin `localStorage` ni `useLocalStorage`. Pinia es la fuente de verdad y `src/db.js` guarda una copia en IndexedDB (suscripción al store).
