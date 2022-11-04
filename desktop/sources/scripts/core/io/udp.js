/*
 UDP not supported in browser
 */

export class Udp {
  constructor(client) {
    this.client = client;
  this.dgram = require('dgram')

  this.stack = []
  this.port = null
  this.socket = this.dgram ? this.dgram.createSocket('udp4') : null
  this.listener = this.dgram ? this.dgram.createSocket('udp4') : null
  }
  start() {
    if (!this.dgram || !this.socket || !this.listener) { console.warn('UDP', 'Could not start.'); return }
    console.info('UDP', 'Starting..')

    this.selectInput()
    this.selectOutput()
  }

  clear() {
    this.stack = []
  }

  run() {
    for (const item of this.stack) {
      this.play(item)
    }
  }

  push(msg) {
    this.stack.push(msg)
  }

  play(data) {
    if (!this.socket) { return }
    //@ts-ignore
    this.socket.send(Buffer.from(`${data}`), this.port, this.client.io.ip, (err) => {
      if (err) { console.warn(err) }
    })
  }

  selectOutput(port = 49161) {
    if (!this.dgram) { console.warn('UDP', 'Unavailable.'); return }
    if (Math.floor(port) === this.port) { console.warn('UDP', 'Already selected'); return }
    if (isNaN(port) || port < 1000) { console.warn('UDP', 'Unavailable port'); return }

    console.log('UDP', `Output: ${port}`)
    this.port = Math.floor(port)
  }

  selectInput(port = 49160) {
    if (!this.dgram) { console.warn('UDP', 'Unavailable.'); return }
    if (this.listener) { this.listener.close() }

    console.log('UDP', `Input: ${port}`)
    this.listener = this.dgram.createSocket('udp4')

    this.listener.on('message', (msg, rinfo) => {
      this.client.commander.trigger(`${msg}`)
    })

    this.listener.on('listening', () => {
      const address = this.listener?.address()
      console.info('UDP', `Started socket at ${address?.address}:${address?.port}`)
    })

    this.listener.on('error', (err) => {
      console.warn('UDP', `Server error:\n ${err.stack}`)
      this.listener?.close()
    })

    this.listener.bind(port)
  }
}
