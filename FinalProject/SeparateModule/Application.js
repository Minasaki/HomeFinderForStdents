const separateModule = require('./SeparateModule.js')
const myModule = separateModule()

const urlFunctions = {}

urlFunctions['/'] = (request, response) => {
    let text = ""
    text += "<p>Hello! Welcome to Emerge Training</p><br>"
    text += "<a href=\"/x\"><center><b>Have a Tour</b></center></a>"
    response.send(text)
}

urlFunctions['/x'] = (request, response) => {
    let text = ""
    text += "<h2>Thank You!!!</h2>"
    text += "<a href=\"/\">Return</a>"
    response.send(text)
}

myModule.get('/', urlFunctions['/'])
myModule.get('/x', urlFunctions['/x'])
myModule.listen(8000)
