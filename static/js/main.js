// CARGAMOS LA INFORMACIÓN A MOSTRAR EN CUANDO LA PAGINA CARGUE 
function load_info() {
    fetch('/getinfo').then(function (response) {
        return response.json();
    }).then(function (text) {
        if(text) {

            // let list_diary = document.getElementById('list_diary'); 
            // list_diary.innerHTML = "";

            // text.forEach(function (item, index) {

            //     let li = document.createElement('li'),
            //     a = document.createElement('a'),
            //     h2 = document.createElement('h2'),
            //     p = document.createElement('p'),
            //     small = document.createElement('small'),
            //     feel = document.createTextNode(item.feel), 
            //     description = document.createTextNode(item.description),
            //     fecha = document.createTextNode(item.date);

            //     let img;
            //     if (item.image != null){
            //         img = document.createElement('img');
            //         img.src = item.image;
            //         img.style.width = '25em';
            //     }

            //     p.appendChild(description);
            //     h2.appendChild(feel); 
            //     small.appendChild(fecha);

            //     a.appendChild(h2);
            //     a.appendChild(p);
                
            //     if (img != null){
            //         a.appendChild(img);
            //     }
            //     a.appendChild(small);

            //     li.appendChild(a);

            //     list_diary.appendChild(li);

            // });
        }
    });
}

window.addEventListener('load', function () { 
    load_info(); 
})