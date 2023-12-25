function getBackend() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch('https://eclipse.herobuxx.me/api/ticket', requestOptions)
        .then(response => {
            console.log('Raw Response:', response);
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                displayTickets(data.data);
            } else {
                console.error('API Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

// Display tickets in the table
function displayTickets(tickets) {
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <div class="card">
                <img class="w-full h-full object-cover" src="https://source.unsplash.com/360x200?concert" alt="">
                <div class="p-5 flex flex-col gap-3">
                    <div class="flex item-center gap-2">
                        <span class="badge">Stock Ready</span>
                        <span class="badge">Official Store</span>
                    </div>
                    <h2 class="product-title" title="${ticket}">
                        ${ticket.title}
                    </h2>
                    <div>
                        <span class="text-xl font-bold">
                            ${ticket.description}
                        </span>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-sm line-through opacity-50">
                                ${ticket.price}
                            </span>
                            <!-- Assuming you have a discount percentage in your API response -->
                            <span class="discount-percent">
                                save ${ticket.discount_percent}%
                            </span>
                        </div>
                        <div class="mt-5 flex gap-2">
                            <button class="button-primary">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        tableBody.appendChild(row);
    });
}

window.onload = getBackend;
