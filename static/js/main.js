// CARGAMOS LA INFORMACIÓN A MOSTRAR EN CUANDO LA PAGINA CARGUE 
function load_info(callback) {
    fetch('/getinfo').then(function (response) {
        return response.json();
    }).then(function (text) {
        if(text) {

            let list_diary = document.getElementById('list_diary'); 
            list_diary.innerHTML = "";

            text.forEach(function (item, index) {

                // CREATE ELEMENTS
                let li = document.createElement('li'),
                a = document.createElement('a'),
                div = document.createElement('div'),
                span1 = document.createElement('span'),
                span2 = document.createElement('span'),
                p = document.createElement('p'), 
                small = document.createElement('small'),
                // CREATE ELEMENTS
                // CREATE TEXT NODE
                feel = document.createTextNode(item.feel),
                description = document.createTextNode(item.description),
                date = document.createTextNode(item.date);
                // CREATE TEXT NODE

                // ADD CLASSES
                div.classList.add('list_diary_title');
                span2.classList.add('option_delete');
                // ADD CLASSES

                // ADD DATA ATTRIBUTE IN ELEMENT
                span2.dataset.element_id = item.id
                // ADD DATA ATTRIBUTE IN ELEMENT

                // CREATE IMG NODE IF EXISTS
                let img;
                if(item.image != null) {
                    img = document.createElement('img');
                    img.src = item.image;
                    img.style.width = '25em';
                }
                // CREATE IMG NODE IF EXISTS

                // APPEND ALL ELEMENTS
                p.appendChild(description);
                span1.appendChild(feel);
                span2.textContent = 'x';
                small.appendChild(date);

                div.appendChild(span1);
                div.appendChild(span2);

                a.appendChild(div);
                a.appendChild(p);
                if(img != null) {
                    a.appendChild(img);
                }

                a.appendChild(small);

                li.appendChild(a);
                list_diary.appendChild(li);
                // APPEND ALL ELEMENTS

            });
        }

        callback();
    });
}

// CREATE EVENT ON CLICK TO DELETE ELEMENT
function createEventDelete () {
    var option_delete = document.getElementsByClassName('option_delete');
    for (var i = 0; i < option_delete.length; i++) {
        option_delete[i].addEventListener('click', deleteNote, false);
    }
}

var deleteNote = function () {
    var element_id = this.getAttribute('data-element_id');

    console.log(element_id);
}
// CREATE EVENT ON CLICK TO DELETE ELEMENT

window.addEventListener('load', function () { 
    load_info(createEventDelete); 

    // CREATE EVENT ON CHANGE IMG
    var create_img = document.getElementById('create_img');
    create_img.addEventListener('change', function (event) {
        loadFile(event);
    })
    // CREATE EVENT ON CHANGE IMG
})

var loadFile = function(event) {
    var output = document.getElementById('create_img_preview');
    if(event.target.files[0]) {
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
        URL.revokeObjectURL(output.src) // free memory
        output.style.width = '100%';
        output.style.marginTop = '5px';
        }
    }
    else {
        output.src = "";
    }
};