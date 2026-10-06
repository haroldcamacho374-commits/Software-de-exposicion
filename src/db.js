// Persistencia en IndexedDB (sin localStorage).
const open = () => new Promise((res, rej) => {
  const r = indexedDB.open('biblioteca', 1)
  r.onupgradeneeded = () => r.result.createObjectStore('kv')
  r.onsuccess = () => res(r.result)
  r.onerror = () => rej(r.error)
})
const run = async (mode, fn) => {
  const db = await open()
  return new Promise((res, rej) => {
    const req = fn(db.transaction('kv', mode).objectStore('kv'))
    req.onsuccess = () => res(req.result)
    req.onerror = () => rej(req.error)
  })
}
export const load = key => run('readonly', s => s.get(key))
export const save = (key, val) => run('readwrite', s => s.put(JSON.parse(JSON.stringify(val)), key))
