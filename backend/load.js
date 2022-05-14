const os = require('os')
const http = require('http')

const numCpus = os.cpus().length

const getLoad = () => {
  const [load1] = os.loadavg()
  const normalizedLoad = os.loadavg()[0] / numCpus
  return {
    numCpus,
    load1,
    normalizedLoad
  }
}

const port = process.env.PORT || 8080

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Content-type': 'application/json',
}

const server = http.createServer(async (req, res) => {
  const ok = body => {
    res.writeHead(200, headers)
    res.end(JSON.stringify(body))
  }

  const nok = () => {
    res.writeHead(404, headers)
    res.end(JSON.stringify({
      error: 'Route not found, try /load'
    }))
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers)
    res.end()
  } else if (req.url === '/load' && req.method === 'GET') {
    console.log('--api call', req.method, req.url)
    ok(getLoad())
  } else {
    nok()
  }
})

server.listen(port, () => {
  console.log('Server started on ' + port)
})
