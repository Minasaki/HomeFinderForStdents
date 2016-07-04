window.onload = () => {
    document.getElementById('loginButton').onclick = (event) => {
        event.preventDefault()
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              let user = JSON.parse(xhr.responseText)
                if (user.isExist) {
                  window.location.href =  '/?id=' + user.id + '&session_id=' + user.sessionId
                }
                else {
                  document.getElementById('warning').innerHTML = "Invalid User <br> Please enter your valid username and password"
                }
            }
        }
        xhr.open('POST', '/verification', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        }))
    }
}
