var listCoffeeBlock = document.querySelector('#list-coffee');
var coffeeApi = "http://localhost:3000/coffee";

function start() {
    getCoffee(renderCoffee);
    handleAddForm();
}

start();

//Functions
function getCoffee(callback) {
    fetch(coffeeApi)
    .then(function(response) {
        return response.json();
    })
    .then(callback);
}

function renderCoffee(coffee) {
    var htmls = coffee.map(function(coffee) {
        return `
            <li class="coffee-item-${coffee.id}">
                <h4 class="cf-name-${coffee.id}">${coffee.name}</h4>
                <p class="cf-price-${coffee.id}">${coffee.price}</p>
                <button onclick="handleDeleteCoffee(${coffee.id})">Delete</button>
                <button id="edit" onclick="handleEditBtn(${coffee.id})">Edit</button>
            </li>
        `;
    });
    listCoffeeBlock.innerHTML = htmls.join('');
}

function addCoffee(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    };

    fetch(coffeeApi, options)
        .then(function(response) {
            response.json();
        })
        .then(callback);
}

function handleAddForm() {
    var addBtn = document.querySelector('#add');

    addBtn.onclick = function() {
        var name = document.querySelector('input[name="name"]').value;
        var price = document.querySelector('input[name="price"]').value;

        var formData = {
            name: name,
            price: price
        };
        addCoffee(formData, function() {
            getCoffee(renderCoffee);
        });
    }
}

function handleDeleteCoffee(id) {
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
    };

    fetch(coffeeApi + '/' + id, options)
        .then(function(response) {
            response.json();
        })
        .then(function() {
            var coffeeItem = document.querySelector('.coffee-item-' + id);
            if (coffeeItem) {
                coffeeItem.remove();
            }
        });
}

function editCoffee(id, data, callback) {
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(data)
    };

    fetch(coffeeApi + '/' + id, options)
        .then(function(response) {
            response.json();
        })
        .then(callback);
}

function clear() {
    document.querySelector('input[name="name"]').value = '';
    document.querySelector('input[name="price"]').value = '';
}

function handleEditBtn(id) {
    document.querySelector('#add').style.display ='none';
    document.querySelector('#save').style.display ='block';
    
    document.querySelector('input[name="name"]').value = document.querySelector('.cf-name-' + id).innerHTML;
    document.querySelector('input[name="price"]').value = document.querySelector('.cf-price-' + id).innerHTML;
    
    var saveBtn = document.querySelector('#save');

    saveBtn.onclick = function() {
        var name = document.querySelector('input[name="name"]').value;
        var price = document.querySelector('input[name="price"]').value;

        var formData = {
            name: name,
            price: price
        };
        editCoffee(id, formData, function() {
            getCoffee(renderCoffee);
        });

        clear();
    }
}