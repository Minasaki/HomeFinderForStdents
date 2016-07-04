window.onload = () => {
    document.getElementById('upload').onclick = (event) => {
        event.preventDefault()
        const xhr = new XMLHttpRequest()
        console.log("hello");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                document.getElementById('photoName').value = xhr.responseText
                console.log(xhr.responseText);
            }
        }
        xhr.open('POST', '/upload', true)
        xhr.send(document.getElementById('myfile').files[0])
    }
    document.getElementById('avertiseForm').onsubmit = (event) => {
        event.preventDefault()
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log(xhr.responseText);
                window.location.href = '/?session_id=' + document.getElementById('sessionId').value
            }
        }
        xhr.open('POST', '/boarding_house/advertised', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({
            user: document.getElementById('sessionId').value,
            name: document.getElementById('name').value,
            location: document.getElementById('location').value,
            numberOfRooms: document.getElementById('numberOfRoom').value,
            numberOfAvailableRoom: document.getElementById('availableRoom').value,
            description: document.getElementById('description').value,
            samplePhoto: document.getElementById('photoName').value,
        }))
    }
}
