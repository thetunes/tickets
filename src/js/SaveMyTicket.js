// Get the current URL from the browser's address bar
var currentURL = window.location.href;

// Function to extract the value of a parameter from a URL
function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Extract the 'id' parameter value from the current URL
var idValue = getParameterByName('id', currentURL);

function getDetail() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch('https://eclipse.herobuxx.me/api/order/get?id=' + idValue, requestOptions)
        .then(response => {
            console.log('Raw Response:', response);
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                displayDetail(data.data);  // Use data directly instead of data.data
            } else {
                console.error('API Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function confirmOrder(orderId) {
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    fetch(`https://eclipse.herobuxx.me/api/order/done?id=${orderId}`, requestOptions)
        .then(response => {
            console.log('Confirmation Response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Confirmation Data:', data);
            if (data.status === "success") {
                // Assuming you want to update the UI after confirmation, you can reload the orders.
                getOrders();
            } else {
                console.error('Confirmation Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Confirmation Fetch Error:', error);
        });
    location.reload();
}

function cancelOrder(orderId) {
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    fetch(`https://eclipse.herobuxx.me/api/order/cancel?id=${orderId}`, requestOptions)
        .then(response => {
            console.log('Cancelation Response:', response);
            return response.json();
        })
        .then(data => {
            console.log('Cancelation Data:', data);
            if (data.status === "success") {
                // Assuming you want to update the UI after confirmation, you can reload the orders.
                getOrders();
            } else {
                console.error('Cancelation Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Cancelation Fetch Error:', error);
        });
    location.reload();
}

// Display orders in the table
function displayDetail(order) {
    const tableBody = document.getElementById('ordersDetail');
    tableBody.innerHTML = '';

    const data = document.createElement('div');

    if (order.status === "true") {
        data.innerHTML = `
        <div>
            <div class="text-sm">The Tunes</div>
        </div>
        <div>
            <div class="text-sm">Ticket Order Number: ${idValue}</div>
        </div>
        <div>
            <div class="text-4xl mt-24 mb-4 font-bold">Ticket Detail</div>
        </div>

        <div class="grid grid-cols-2 gap-4 my-4">
            <div>
                <span class="font-bold">Ticket Number</span>
                <br>
                <span class="">${order.ticketid}</span>
            </div>
            <div>
                <span class="font-bold">Customer ID</span>
                <br>
                <span class="">${order.userid}</span>
            </div>
            <div>
                <span class="font-bold">Ordered At</span>
                <br>
                <span class="">${order.CreatedAt}</span>
            </div>
        </div>
        `;
    } else if (order.status === "false") {
        data.innerHTML = `
        <div>
        <h1>Order hasd been cancelled!</h1>
        </div>
        `;
    } else {
        data.innerHTML = `
        <div>
        <h1>You haven't paid the ticket yet, didn't you?!</h1>
        </div>
        `;
    }

    tableBody.appendChild(data);
}

function loadData() {
    getDetail();
}

window.onload = loadData;