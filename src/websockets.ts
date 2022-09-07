import ws from 'ws'
import { Server } from 'http'

export default (express: Server) => {
  const websocketServer = new ws.Server({
    noServer: true,
    path: '/websockets',
  })

  express.on('upgrade', (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit('connection', websocket, request)
    })
  })

  websocketServer.on('connection', (conn, req) => {
    // @ts-ignore
    console.log(req.headers)

    conn.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message.toString())
        console.log(parsedMessage)
      } catch (error) {
        console.error('ws json parse fail')
      }
    })
  })

  return websocketServer
}
