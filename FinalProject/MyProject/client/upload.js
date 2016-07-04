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
}
