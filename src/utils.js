export const fmt = d => new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
export const addDays = n => new Date(Date.now() + n * 864e5).toISOString()
export const uid = () => crypto.randomUUID()
