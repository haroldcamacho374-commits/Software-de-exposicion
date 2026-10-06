import { defineStore } from 'pinia'
import { load, save } from '../db'
import { addDays, uid } from '../utils'

const MAX_LOANS = 3
let timer

const seed = () => {
  const books = [
    ['Cien años de soledad', 'Gabriel García Márquez', 'Novela'],
    ['El amor en los tiempos del cólera', 'Gabriel García Márquez', 'Novela'],
    ['Pedro Páramo', 'Juan Rulfo', 'Novela'],
    ['Breve historia del tiempo', 'Stephen Hawking', 'Ciencia']
  ].map(([title, author, category]) => ({ id: uid(), title, author, isbn: '', category }))
  const users = [['Laura Gómez', '1098001'], ['Andrés Rojas', '1098002']]
    .map(([name, document]) => ({ id: uid(), name, document, email: '', phone: '' }))
  return { books, users, loans: [] }
}

export const useLibrary = defineStore('library', {
  state: () => ({ books: [], users: [], loans: [] }),
  getters: {
    book: s => id => s.books.find(b => b.id === id),
    user: s => id => s.users.find(u => u.id === id),
    openLoans: s => s.loans.filter(l => !l.returnedAt),
    openByBook() { return new Map(this.openLoans.map(l => [l.bookId, l])) },
    isOverdue: () => l => !l.returnedAt && new Date(l.dueAt) < new Date(),
    overdue() { return this.openLoans.filter(l => this.isOverdue(l)) },
    // Estado derivado: nunca se guarda, siempre sale de los préstamos abiertos.
    status() {
      return id => {
        const l = this.openByBook.get(id)
        return !l ? 'available' : this.isOverdue(l) ? 'overdue' : 'loaned'
      }
    },
    historyOf: s => (key, id) => s.loans.filter(l => l[key] === id).sort((a, b) => b.loanedAt.localeCompare(a.loanedAt))
  },
  actions: {
    async init() {
      const data = await load('data').catch(() => null)
      this.$subscribe((_, state) => {
        clearTimeout(timer)
        timer = setTimeout(() => save('data', state).catch(console.error), 200)
      }, { detached: true })
      this.$patch(data || seed())
    },
    addBook(b) { this.books.unshift({ id: uid(), ...b }) },
    updateBook(id, b) { Object.assign(this.book(id), b) },
    removeBook(id) {
      if (this.historyOf('bookId', id).length) throw new Error('Este libro tiene historial de préstamos y no se puede eliminar.')
      this.books = this.books.filter(b => b.id !== id)
    },
    addUser(u) { this.users.unshift({ id: uid(), ...u }) },
    updateUser(id, u) { Object.assign(this.user(id), u) },
    removeUser(id) {
      if (this.historyOf('userId', id).length) throw new Error('Este usuario tiene historial de préstamos y no se puede eliminar.')
      this.users = this.users.filter(u => u.id !== id)
    },
    lend(bookId, userId, days = 7) {
      if (this.status(bookId) !== 'available') throw new Error('El libro no está disponible.')
      if (this.openLoans.filter(l => l.userId === userId).length >= MAX_LOANS)
        throw new Error(`El usuario ya tiene ${MAX_LOANS} préstamos activos.`)
      this.loans.push({ id: uid(), bookId, userId, loanedAt: new Date().toISOString(), dueAt: addDays(days), returnedAt: null })
    },
    returnLoan(id) {
      const l = this.loans.find(l => l.id === id)
      if (l && !l.returnedAt) l.returnedAt = new Date().toISOString()
    }
  }
})
