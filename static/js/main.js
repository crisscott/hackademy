window.addEventListener('load', function () { 

    document.getElementById('create_date').value = getDate();

    // LOAD INFORMATION OF INDEX PAGE
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

    load_info(createEventDelete); 
    // LOAD INFORMATION OF INDEX PAGE

    // CREATE EVENT ON CHANGE IMG
    var create_img = document.getElementById('create_img');
    create_img.addEventListener('change', function (event) {
        loadFile(event);
    })
    // CREATE EVENT ON CHANGE IMG

    // CREATE IMAGE PREVIEW
    var loadFile = function(event) {
        var output = document.getElementById('create_img_preview');
        if(event.target.files[0]) {
            output.src = URL.createObjectURL(event.target.files[0]);
            output.onload = function() {
                URL.revokeObjectURL(output.src) // free memory
                output.style.width = '300px';
                output.style.marginTop = '5px';
            }
        }
        else {
            output.src = "";
        }
    };
    // CREATE IMAGE PREVIEW

    // CREATE MASK FOR DATE
    let create_date = document.getElementById('create_date');
    create_date.addEventListener('keypress', function (e) {
        if(e.keyCode < 47 || e.keyCode > 57) {
            e.preventDefault();
        }
          
        var len = this.value.length;

        if(len !== 1 || len !== 3) {
            if(e.keyCode == 47) {
                e.preventDefault();
            }
        }

        if(len === 2) {
            this.value += '/';
        }

        if(len === 5) {
            this.value += '/';
        }
    });
    // CREATE MASK FOR DATE


    // VALIDATE FORM BEFORE SEND
    const form = document.getElementById('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let validate = true;

        let elements = document.getElementsByClassName('form-option');
        for (var i = 0; i < elements.length; i++) {
            let data = elements[i].dataset.required;
            if(elements[i].parentNode.getElementsByClassName('form-error')[0]) {
                elements[i].parentNode.getElementsByClassName('form-error')[0].style.display = 'none';
            }

            if(data === 'true') {
                let valor = elements[i].value;
                if(!valor) {
                    validate = false; 

                    elements[i].parentNode.getElementsByClassName('form-error')[0].style.display = 'block';
                    elements[i].parentNode.getElementsByClassName('form-error')[0].textContent = 'Dato Requerido';
                }
            }
        }

        if(!validate) {
            return false; 
        }

        let create_date = document.getElementById('create_date');
        var date = create_date.value;
        var newdate = date.split("/").reverse().join("-");

        if(!isValidDate(newdate)) {
            create_date.parentNode.getElementsByClassName('form-error')[0].style.display = 'block';
            create_date.parentNode.getElementsByClassName('form-error')[0].textContent = 'Verifique el formato de la fecha';

            return false; 
        }
        
        // CREATE FORMDATA
        const file = document.getElementById('create_img').files[0];
        const formdata = new FormData();

        formdata.append('file', file);
        formdata.append('date', document.getElementById('create_date').value);
        formdata.append('feel', document.getElementById('create_feel').value);
        formdata.append('description', document.getElementById('create_description').value);

        fetch('/upload', {
            method: 'POST', 
            body: formdata
        }).then((response) => {
            const alert = document.getElementsByClassName('alert')[0];
            alert.style.display = "block";
            if(response.status == '200') {
                alert.classList.add('success');
                alert.classList.remove('danger');
                alert.getElementsByClassName('text')[0].textContent = 'Nota Guardada Correctamente';
            }
            else {
                alert.classList.remove('success');
                alert.classList.add('danger');
                alert.getElementsByClassName('text')[0].textContent = 'Ocurrió un error al almacenar la nota';
            }

            setTimeout(function(){ alert.style.display = "none"; }, 3600);

            document.getElementById("form").reset();
            document.getElementById('create_img_preview').src = "";
            document.getElementById('create_date').value = getDate();
            load_info(createEventDelete); 
        });
    })
    // VALIDATE FORM BEFORE SEND

    // CREATE EVENT ON CLICK TO DELETE ELEMENT
    function createEventDelete () {
        var option_delete = document.getElementsByClassName('option_delete');
        for (var i = 0; i < option_delete.length; i++) {
            option_delete[i].addEventListener('click', deleteNote, false);
        }
    }

    var deleteNote = function () {
        var element_id = this.getAttribute('data-element_id');

        var action = confirm("La nota será eliminada ¿Está Seguro?");
        if (action == true) {
            fetch(`/delete?element=${element_id}`)
            .then(function (response) {
                return response.json();
            }).then(function (response) {
                const alert = document.getElementsByClassName('alert')[0];
                alert.style.display = "block";
                if(response.status == '200') {
                    alert.classList.add('success');
                    alert.classList.remove('danger');
                    alert.getElementsByClassName('text')[0].textContent = 'Nota Eliminada Correctamente';
                }
                else {
                    alert.classList.remove('success');
                    alert.classList.add('danger');
                    alert.getElementsByClassName('text')[0].textContent = 'Ocurrió un error al eliminar la nota';
                }

                setTimeout(function(){ alert.style.display = "none"; }, 3600);
                
                load_info(createEventDelete); 
            });
        }
    }
    // CREATE EVENT ON CLICK TO DELETE ELEMENT

    var close = document.getElementsByClassName("closebtn")[0];
    close.addEventListener('click', function () {
        var div = this.parentElement;
        div.style.opacity = "0";
        setTimeout(function(){ div.style.display = "none"; }, 600);
    });
})

function isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
}

function getDate() {
    let date = new Date()

    let day = String(date.getDate());
    if(day.length == 1) {
        day = '0' + day;
    }

    let month = String(date.getMonth() + 1);
    if(month.length == 1) {
        month = '0' + month;
    }
    
    let year = date.getFullYear()

    return `${day}/${month}/${year}`;
}