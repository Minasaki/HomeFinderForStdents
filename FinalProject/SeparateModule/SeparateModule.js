const http = require('http')
const url = require('url')
const fs = require('fs')

module.exports = () => {
    const v = {}
    v.getHandlers = {}
    v.postHandlers = {}

    v.get = (path, handler) => {
        v.getHandlers[path] = handler
    }
    v.post = (path, handler) => {
        v.postHandlers[path] = handler
    }

    v.listen = (port) => {
        server = http.createServer((request, response) => {
            response.send = (text) => {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                response.end(text)
            }
            let pathParser = url.parse(request.url)

            console.log(pathParser.pathname)

            let handler = v.getHandlers[pathParser.pathname]

            // if (request.url.includes('/?code=')) {
            //     handler = v.getHandlers['/post']
            // }
            // if (request.url.includes('/show_details')) {
            //   hadler = v.getHandlers['/show_details']
            // }
            // if (request.url.includes('oauth_token=')) {
            //   handler = v.getHandlers['/callback']
            // }

            if (request.method === 'POST') {
                handler = v.postHandlers[request.url]
            }
            if (handler) {
                handler(request, response)
            } else {
              console.log(request.url);
                if (request.url.includes('.jpg')) {
                  response.writeHead(200, {
                    'Content-Type': 'image/jpg'
                  })
                  fs.readFile('../' + request.url, (err, data) => {
                    response.end(data)
                  })
                } else {
                  response.send("ERROR 404: PAGE NOT FOUND")
                }
            }
        }).listen(port)
        console.log("Server Running");
    }
    return (v)
}
