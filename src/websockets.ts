import ws, { WebSocket } from 'ws'
import queryString from 'query-string'
import { Server } from 'http'

export default (express: Server) => {
  const websocketServer = new ws.Server({
    noServer: true,
    path: '/websockets',
  })

  let playerConnections: Array<{ id: string; conn: WebSocket }> = []

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
        conn.on('message', (data) => {
          // TODO: send messages to connected remotes
          console.log(`msg from ${wsParams.id} --- ${data}`)
        })

        conn.on('close', (code, reason) => {
          console.log(`ws closed - ${code} - ${reason}`)
          playerConnections = playerConnections.filter((pc) => {
            return pc.id !== wsParams.id
          })
          console.log(playerConnections)
        })

        // @ts-ignore
        playerConnections.push({ id: wsParams.id, conn })
        console.log(playerConnections)
      }
    }
  })

  return websocketServer
}
