const distOrderNavBtn = document.getElementById("distOrdersNav");
const distOrderMainDiv = document.getElementById("distOrdersMainDiv"); 
const distHistoryNavBtn = document.getElementById("distHistoryNav");
const distHistoryMainDiv = document.getElementById("distHistoryMainDiv");
const distLogout = document.getElementById("dist-logout");

distOrderNavBtn.addEventListener("click", async () => { 
    distOrderMainDiv.style.display = "block";
    distHistoryMainDiv.style.display = "none";
    await distOrders(); 
});

distHistoryNavBtn.addEventListener("click", async () => {
    distHistoryMainDiv.style.display = "block";
    distOrderMainDiv.style.display = "none";
    await distHistory();
})

async function distOrders() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/distPanel/orders`, {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(response.status === 200) {
            const allProducts = await response.json();
            console.log("All Products from Dist", allProducts);
            displayOrders(allProducts);
        }
        else {
            console.error('Failed to fetch orders:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching orders:', error)
    }
}

function displayOrders(products) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = ''; 

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productName = document.createElement('span');
        productName.textContent = product.productName + ' - Quantity: ' + product.quantity;

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 0;
        quantityInput.value = 0;

        const placeOrderBtn = document.createElement('button');
        placeOrderBtn.textContent = 'Place Order';

        placeOrderBtn.addEventListener('click', function () {
            const requestedQuantity = parseInt(quantityInput.value);

            if (requestedQuantity <= 0) {
                alert('Please enter a valid quantity.');
                return;
            }

            if (requestedQuantity > product.quantity) {
                alert('Requested quantity exceeds available quantity.');
                return;
            }

            const orderData = {
                productId: product.id,
                requestedQuantity: requestedQuantity
            };

            placeOrder(orderData);
        });

        productDiv.appendChild(productName);
        productDiv.appendChild(quantityInput);
        productDiv.appendChild(placeOrderBtn);

        ordersContainer.appendChild(productDiv);
        distOrderMainDiv.appendChild(ordersContainer);
    });
}

async function placeOrder(orderData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/distPanel/placeOrder`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify ( orderData )
        });

        if (response.status === 201) {
            console.log('Order placed successfully.');
            distOrders();
        } else {
            console.error('Failed to place order:', response.statusText);
            console.log('Failed to place order. Please try again later.');
        }
    } catch (error) {
        console.log(error);
    }
}

async function distHistory() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`/distPanel/history`, {
            method:"GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if(response.status === 200) {
            const history = await response.json();
            console.log(history);
            displayHistory(history);
        }
    } catch (error) {
        console.log(error);
    }
}

function displayHistory(history) {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = ''; 
    history.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        const orderDetails = document.createElement('p');
        orderDetails.textContent = `Product: ${order.productName}, Requested Quantity: ${order.requestedQuantity}, Status: ${order.status}`;

        orderDiv.appendChild(orderDetails);
        historyContainer.appendChild(orderDiv);
    });
}

distLogout.addEventListener("click", ()=> {
    localStorage.clear();
    window.location.href="http://localhost:3000";
})