window.onload = () => {
    getrequest()
    document.getElementById("messageForm").onsubmit = (event) => {
        event.preventDefault()
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                let body = ''
                let message = JSON.parse(xhr.responseText)
                message.forEach((comment) => {
                    let text = comment
                    body += "<tr><td class=\"text-info\">" + new Date(text.date).toLocaleString() + "</td>" +
                        "<td class=\"text-info-user\">" + text.username + "</td>" +
                        "<td>" + text.message + "</td></tr>"
                })
                document.getElementById('showMessage').innerHTML = body
                document.getElementById('message').value = " "
            }
        }
        xhr.open('POST', '/messages', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({
            homeId: document.getElementById('homeId').value,
            message: document.getElementById('message').value,
            date: new Date(),
            username: document.getElementById('username').value
        }))
    }
    setInterval(getrequest(), 10000)

    function getrequest() {
        const xhr = new XMLHttpRequest()
        let homeId = document.getElementById('homeId').value
        xhr.open('GET', '/messages?id=' + homeId.toString(), true)
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                let body = ''
                let message = JSON.parse(xhr.responseText)
                message.forEach((comment) => {
                    let text = comment
                    body += "<tr><td class=\"text-info\">" + new Date(text.date).toLocaleString() + "</td>" +
                        "<td class=\"text-info-user\">" + text.username + "</td>" +
                        "<td>" + text.message + "</td></tr>"
                })
                document.getElementById('showMessage').innerHTML = body
            }
        }
        xhr.send()
    }

}
