window.onload = () => {
    document.getElementById('registrationButton').onclick = (event) => {
        event.preventDefault()
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log(xhr.responseText);
                window.location.href = '/'
            }
        }
        xhr.open('POST', '/submit_data', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value,
            mobileNumber: document.getElementById('mobileNumber').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        }))
    }
}
