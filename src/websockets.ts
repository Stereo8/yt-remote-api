import ws, { WebSocket } from 'ws'
import queryString from 'query-string'
import { Server } from 'http'

export default (express: Server) => {
  const websocketServer = new ws.Server({
    noServer: true,
    path: '/websockets',
  })

  const playerConnections: Map<string, WebSocket> = new Map<string, WebSocket>()

  express.on('upgrade', (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, (websocket) => {
      websocketServer.emit('connection', websocket, request)
    })
  })

  websocketServer.on('connection', (conn, req) => {
    const [_path, params] = req?.url?.split('?')
    const wsParams = queryString.parse(params)

    console.log(`new conn:\n  id: ${wsParams.id}\n  type: ${wsParams.type}`)

    if (wsParams?.type && wsParams?.id) {
      if (wsParams.type === 'player') {
        playerConnections.set(<string>wsParams.id, conn)

        conn.on('message', (data) => {
          // TODO: send messages to connected remotes
          console.log(`msg from ${wsParams.id} --- ${data}`)
        })

        conn.on('close', (code, reason) => {
          console.log(`ws closed - ${code} - ${reason}`)
          playerConnections.delete(<string>wsParams.id)
        })
      }
    }
  })

  return websocketServer
}
