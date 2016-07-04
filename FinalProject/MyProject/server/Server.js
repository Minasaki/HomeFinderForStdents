const cons = require('consolidate')
const url = require('url')
const fs = require('fs')
const sha1 = require('sha1')
const ObjectId = require('mongodb').ObjectId
const mongoJs = require('mongojs')
const dbName = 'HomeFinder'
const db = mongoJs(dbName)
const SeparateModule = require('../../SeparateModule/SeparateModule')
const secretCharacter = 'TheBiGBr0wf 0xjuMps0^3 _)(*&^%$rtheL@z%Dog#(1430&02)'
const state = SeparateModule()

let session = {}

state.get('/', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })
    let urlData = url.parse(request.url, true, true)
    let token = urlData.query.session_id
    let user = session[token]
    db.homes.find((err, docs) => {
        cons.swig('../views/Home.html', {
            homes: docs,
            token: token,
            user: user
        }, (err, html) => {
            response.end(html)
        })
    })
})

state.get('/login', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })
    cons.swig('../views/LogIn.html', {}, (err, html) => {
        response.end(html)
    })
})

state.post('/verification', (request, response) => {
    let userData = ''
    request.on('data', (doc) => {
        userData += doc

    })
    request.on('end', () => {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        let data = JSON.parse(userData)
        data.password = sha1(secretCharacter + data.password + secretCharacter)
        db.users.findOne({
            $and: [{
                username: data.username
            }, {
                password: data.password
            }]
        }, (err, docs) => {
            console.log(docs);
            if (docs) {
                accessToken = sha1(new Date() + docs.name + docs.username + docs.password + secretCharacter + docs._id)
                session[accessToken] = docs
                let data = {
                    isExist: true,
                    sessionId: accessToken,
                    id: docs._id
                }
                response.end(JSON.stringify(data))
            } else {
                let data = {
                    isExist: false
                }
                response.end(JSON.stringify(data))
            }
        })

    })
})

state.get('/registration', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })
    cons.swig('../views/Registration.html', {}, (err, html) => {
        response.end(html)
    })
})

state.post('/submit_data', (request, response) => {
    let userData = ''
    request.on('data', (docs) => {
        userData += docs
    })
    request.on('end', () => {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        let data = JSON.parse(userData)
        data.password = sha1(secretCharacter + data.password + secretCharacter)
        db.users.insert(data)
        response.end(JSON.stringify(data))
    })
})

state.get('/boarding_house', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })

    let urlData = url.parse(request.url, true, true)
    let token = urlData.query.session_id

    cons.swig('../views/AdvertiseBoardingHouse.html', {
        token: token
    }, (err, html) => {
        response.end(html)
    })
})

state.get('/boarding_house/own', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })
    let urlData = url.parse(request.url, true, true)
    let id = urlData.query.id
    let token = urlData.query.session_id
    let user = session[token]
    db.homes.find({ 'user._id': ObjectId(user._id) }, (err, docs) => {
        cons.swig('../views/MyOwn.html', {
            homes: docs,
            token: token,
            user: user
        }, (err, html) => {
            response.end(html)
        })
    })
})

state.post('/boarding_house/advertised', (request, response) => {
    let houseData = ''
    request.on('data', (docs) => {
        houseData += docs
    })
    request.on('end', () => {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        let data = JSON.parse(houseData)
        data.user = session[data.user]
        delete data.user.password
        data.numberOfRooms = parseInt(data.numberOfRooms)
        data.numberOfAvailableRoom = parseInt(data.numberOfAvailableRoom)
        db.homes.insert(data)
        response.end(JSON.stringify(data))
    })
})

state.post('/upload', (request, response) => {
    let body = new Buffer('')
    request.on('data', (docs) => {
        // let data =  JSON.parse(docs)
        body = Buffer.concat([body, docs])
    })
    request.on('end', () => {
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        const name = sha1(Math.random() + new Date())
        fs.writeFile('../public/images/' + name + '.jpg', body, (err, data) => {
            response.end(name + '.jpg')
        })
    })
})

state.get('/home/more_details', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })
    let urlData = url.parse(request.url, true, true)
    let id = urlData.query.id
    let token = urlData.query.session_id

    db.homes.findOne({
        _id: ObjectId(id)
    }, (err, data) => {
        cons.swig('../views/Details.html', {
            data: data,
            token: token
        }, (err, html) => {
            response.end(html)
        })
    })
})

state.post('/messages', (request, response) => {
    let message = ''
    request.on('data', (docs) => {
        message += docs
        console.log(message);
    })
    request.on('end', () => {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        let myMessage = JSON.parse(message)
        myMessage.message = myMessage.message.split('<').join('&lt;')
        myMessage.message = myMessage.message.split('>').join('&gt;')
        db.reviews.insert(myMessage)
        db.reviews.find({
            homeId: myMessage.homeId
        }, (err, data) => {
            response.end(JSON.stringify(data))
        })
    })
})

state.get('/messages', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'application/json'
    })
    let urlData = url.parse(request.url, true, true)
    let id = urlData.query.id
    db.reviews.find({
        homeId: id
    }, (err, data) => {
        response.end(JSON.stringify(data))
    })
})

state.get('/logged_out', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    })
    let urlData = url.parse(request.url, true, true)
    let token = urlData.query.session_id
    let user = session[token]
    delete user
    db.homes.find((err, docs) => {
        cons.swig('../views/Home.html', {
            homes: docs,
            token: token,
            user: user
        }, (err, html) => {
            response.end(html)
        })
    })
})

state.get('/delete', (request, response) => {
  response.writeHead(200, {
      'Content-Type': 'text/html'
  })
  let urlData = url.parse(request.url, true, true)
  let token = urlData.query.session_id
  let id = urlData.query.id
  let user = session[token]
  db.homes.remove({ _id: ObjectId(id)}, (err, data) => {
    response.writeHead(302, {
        'Location': '/boarding_house/own?session_id=' + token
    })
    response.end()
  })
})

state.get('/style.css', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/css',
    })
    fs.readFile('../stylesheet/Style.css', (err, data) => {
        response.end(data)
    })
})

state.get('/login_ajax.js', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/javascript'
    })
    fs.readFile('../client/LoginAjax.js', (err, data) => {
        response.end(data)
    })
})

state.get('/post_ajax.js', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/javascript'
    })
    fs.readFile('../client/PostAjax.js', (err, data) => {
        response.end(data)
    })
})

state.get('/registration_ajax.js', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/javascript'
    })
    fs.readFile('../client/RegistrationAjax.js', (err, data) => {
        response.end(data)
    })
})

state.get('/advertise_ajax.js', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/javascript'
    })
    fs.readFile('../client/AdvertiseAjax.js', (err, data) => {
        response.end(data)
    })
})

state.get('/upload.js', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/javascript'
    })
    fs.readFile('../client/upload.js', (err, data) => {
        response.end(data)
    })
})

state.get('/background.jpg', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'image/jpg'
    })
    fs.readFile('../public/images/background.jpg', (err, data) => {
        response.end(data)
    })
})

state.get('/logo.jpg', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'image/png'
    })
    fs.readFile('../public/images/logo.png', (err, data) => {
        response.end(data)
    })
})

state.get('/favicon.ico', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'image/ico'
    })
    response.end()
})


state.listen(8000)
