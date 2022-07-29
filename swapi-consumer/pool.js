class Pool {
    constructor (size = 4) { Object.assign(this, { pool: new Set, stack: [], size }) }
    open () { return this.pool.size < this.size ? this.deferNow() : this.deferStacked() }
    deferNow () { const [t, close] = thread(); const p = t.then(_ => this.pool.delete(p)).then(_ => this.stack.length && this.stack.pop().close()); this.pool.add(p); return close }
    deferStacked () { const [t, close] = thread(); this.stack.push({ close }); return t.then(_ => this.deferNow()) }
}

const effect = f => x => (f(x), x)
const thread = close => [new Promise(r => { close = effect(r) }), close]
const sleep = ms => new Promise(r => setTimeout(r, ms))
const throttle = (p, ms) => Promise.all([ p, sleep(ms) ]).then(([ value, _ ]) => value)

export { Pool, effect, thread, sleep, throttle }