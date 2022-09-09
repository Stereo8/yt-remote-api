import ws, { WebSocket } from 'ws'
import { parse } from 'query-string'
import { Server } from 'http'

const playerConnections: Map<string, WebSocket> = new Map<string, WebSocket>()
const remoteConnections: Map<string, Array<WebSocket>> = new Map<
  string,
  Array<WebSocket>
>()

debugger

function handlePlayerConnection(conn: WebSocket, id: String) {
  playerConnections.set(<string>id, conn)

  if (!remoteConnections.get(<string>id)) {
    remoteConnections.set(<string>id, new Array<WebSocket>())
  }

  conn.on('message', (data) => {
    const connectedRemotes = remoteConnections.get(<string>id)
    connectedRemotes.forEach((remote) => {
      remote.send(data.toString())
    })

    console.log(`msg from player ${id} --- ${data.toString()}`)
  })

  conn.on('close', (code, reason) => {
    console.log(`ws closed - ${code} - ${reason}`)
    remoteConnections.get(<string>id).forEach((remote) => {
      remote.terminate()
    })
    playerConnections.delete(<string>id)
    remoteConnections.delete(<string>id)
  })
}

function handleRemoteConnection(conn: WebSocket, id: String) {
  const existingRemotes = remoteConnections.get(<string>id)

  if (!existingRemotes) {
    conn.close(1001, 'player not found')
    return
  }

  existingRemotes.push(conn)

  conn.on('message', (data) => {
    console.log(`msg to player ${id} --- ${data.toString()}`)
    const playerConn = playerConnections.get(<string>id)
    playerConn.send(data.toString())
  })

  conn.on('close', (code, reason) => {
    const index = existingRemotes.indexOf(conn)
    if (index !== -1) {
      existingRemotes.splice(index, 1)
    }
  })
}

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
    const [_path, params] = req?.url?.split('?')
    const wsParams = parse(params)

    const { id, type } = wsParams

    console.log(`new conn:\n  id: ${id}\n  type: ${type}`)

    if (wsParams.type === 'player') {
      handlePlayerConnection(conn, <string>id)
    } else if (wsParams.type === 'remote') {
      handleRemoteConnection(conn, <string>id)
    }
  })

  return websocketServer
}
