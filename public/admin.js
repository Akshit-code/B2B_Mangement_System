const adminProductNavBtn = document.getElementById("adminProductsNav");
const adminInvNavBtn = document.getElementById("adminInventoryNav");
const adminOrderNavBtn = document.getElementById("adminOrdersNav");
const adminDistNavBtn = document.getElementById("adminDistNav");

const addProductFormDiv = document.getElementById("admin-add-product-form-div");
const addProductBtn = document.getElementById("addProductsBtn");

const productContainer = document.getElementById("product-container");
const closeModalSpan = document.querySelector(".modal-content .close");
const adminLogoutBn = document.getElementById("adminLogout");

const  productMainDiv = document.getElementById("product-main-div");
const inventoryMainDiv = document.getElementById("inventory-main-div");
const adminOrderMainDiv = document.getElementById("adminOrders-main-div");
const adminDistMainDIv = document.getElementById("adminDis-main-div");

adminProductNavBtn.addEventListener("click", async ()=> {
    await getAllProducts();
    productMainDiv.style.display = "block";
    inventoryMainDiv.style.display = "none";
    adminOrderMainDiv.style.display = "none";
    adminDistMainDIv.style.display = "none";
});

adminInvNavBtn.addEventListener("click", async ()=> {
    await adminInventory();
    productMainDiv.style.display = "none";
    inventoryMainDiv.style.display = "block";
    adminOrderMainDiv.style.display = "none";
    adminDistMainDIv.style.display = "none";
});

adminOrderNavBtn.addEventListener("click", async ()=> {
    await getAllOrders();
    productMainDiv.style.display = "none";
    inventoryMainDiv.style.display = "none";
    adminOrderMainDiv.style.display = "block";
    adminDistMainDIv.style.display = "none";
});

adminDistNavBtn.addEventListener("click", async ()=> {
    await getDistributors();
    productMainDiv.style.display = "none";
    inventoryMainDiv.style.display = "none";
    adminOrderMainDiv.style.display = "none";
    adminDistMainDIv.style.display = "block";
});


addProductBtn.addEventListener("click", ()=> {
    addProductFormDiv.style.display = "block";
});

closeModalSpan.addEventListener("click", () => {
    addProductFormDiv.style.display = "none";
});

addProductFormDiv.addEventListener("submit", (e) => {
    e.preventDefault();

    const productName = document.getElementById("product-name").value;
    const productImgLink = document.getElementById("product-img-link").value;
    const productDesc = document.getElementById("product-desc").value;

    if (!isValidUrl(productImgLink)) {
        console.error("Invalid image URL:", productImgLink);
        return;
    }
    addProduct(productName, productImgLink, productDesc);

    addProductFormDiv.style.display = "none"; 
});

function displayProductCard(productName, productImgLink, productDesc, productId) {

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
        <img src="${productImgLink}" alt="${productName}">
        <h3>${productName}</h3>
        <p>${productDesc}</p>
    `;

    productContainer.appendChild(productCard);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

async function addProduct(productName, productImgLink, productDesc) {
    try {
        const response = await fetch(`/adminPanel/addProduct`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
                productName,
                productImgLink,
                productDesc
            } ),
        });

        if(response.status === 201) {
            console.log("New Product Added");
            getAllProducts();
        } else {
            console.log("Product Either already exists or some other errors");
        }
    } catch (error) {
        console.log(error);
    }
}

let allProducts = [];
async function getAllProducts() {
    try {
        const response = await fetch(`/adminPanel/getAllProducts`, {
            method:"GET",
            headers: {
                'Content-Type':'application/json'
            },
        });

        if(response.status == 200) {
            allProducts = await response.json();
            allProducts.forEach(element => {
                displayProductCard(element.productName, element.productImgLink, element.description, element.id);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

// window.addEventListener("load", ()=> {
//     getAllProducts();
// })

// Inventory Section 

async function adminInventory() {
    try {
        const response = await fetch( `/adminPanel/adminInventory`, {
            method:"GET",
            headers: {
                'Content-Type': 'application/json'
            }
        } );

        if(response.status === 200) {
            const inventory = await response.json();
            console.log(inventory);
            displayInventory(inventory);
        }
    } catch (error) {
        console.log(error);
    }
}
function displayInventory(inventory) {
    // Clear existing inventory if any
    inventoryMainDiv.innerHTML = "";

    // Loop through inventory items and display them
    inventory.forEach(item => {
        const inventoryItem = document.createElement("div");
        inventoryItem.classList.add("inventory-item");

        const increaseStockButton = document.createElement("button");
        increaseStockButton.textContent = "Increase Stock";
        increaseStockButton.addEventListener("click", () => handleStockUpdate(item.id, 'increase'));

        const decreaseStockButton = document.createElement("button");
        decreaseStockButton.textContent = "Decrease Stock";
        decreaseStockButton.addEventListener("click", () => handleStockUpdate(item.id, 'decrease'));

        inventoryItem.innerHTML = `
            <h3>${item.productName}</h3>
            <p>Quantity: ${item.quantity}</p>
            <input type="number" id="quantity-update-${item.id}" placeholder="Enter Quantity">
        `;
        
        inventoryItem.appendChild(increaseStockButton);
        inventoryItem.appendChild(decreaseStockButton);

        inventoryMainDiv.appendChild(inventoryItem);
    });
}

async function handleStockUpdate(productId, action) {
    const quantityInput = document.getElementById(`quantity-update-${productId}`);
    const quantityToUpdate = parseInt(quantityInput.value);
    
    if (isNaN(quantityToUpdate) || quantityToUpdate <= 0) {
        console.log("Please enter a valid quantity to update.");
        return;
    }

    try {
        const response = await fetch(`/adminPanel/updateStock/${productId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                action: action, // 'increase' or 'decrease'
                quantity: quantityToUpdate, // Total quantity to increase or decrease
            })
        });

        if (response.status === 200) {
            // Optional: You may update the UI or perform additional actions upon successful stock update
            console.log("Stock updated successfully");
            // You may refresh the inventory display or handle any UI updates as necessary
        } else {
            console.log("Error updating stock");
        }
    } catch (error) {
        console.log(error);
    }
}

// Distributor Section

async function getDistributors() {
    try {
        const response = await fetch(`/adminPanel/getDistributors`, {
            method:"GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.status === 200) {
            const distList = await response.json();
            console.log(distList);
            displayDistributors(distList);
        }
    } catch (error) {
        console.log(error);
    }
}

function displayDistributors(distributors) {
    // Clear existing distributors if any
    adminDistMainDIv.innerHTML = "";

    // Loop through distributors and display them
    distributors.forEach(distributor => {
        const distributorCard = document.createElement("div");
        distributorCard.classList.add("distributor-card");

        const acceptButton = document.createElement("button");
        acceptButton.textContent = "Accept";
        acceptButton.addEventListener("click", () => handleDistributorAction(distributor.id, 'accept'));

        const rejectButton = document.createElement("button");
        rejectButton.textContent = "Reject";
        rejectButton.addEventListener("click", () => handleDistributorAction(distributor.id, 'reject'));

        distributorCard.innerHTML = `
            <h3>${distributor.firstName} ${distributor.lastName}</h3>
            <p>Email: ${distributor.email}</p>
            <p>Location: ${distributor.location}</p>
        `;
        
        distributorCard.appendChild(acceptButton);
        distributorCard.appendChild(rejectButton);

        adminDistMainDIv.appendChild(distributorCard);
    });
}

async function handleDistributorAction(distributorId, action) {
    try {
        const response = await fetch(`/adminPanel/updateDistributorStatus/${distributorId}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                action: action // 'accept' or 'reject'
            })
        });

        if (response.status === 200) {
            // Optional: You may update the UI or perform additional actions upon successful status update
            console.log("Distributor status updated successfully");
            // You may refresh the list of pending distributors or handle any UI updates as necessary
            getDistributors();
        } else {
            console.log("Error updating distributor status");
        }
    } catch (error) {
        console.log(error);
    }
}

async function getAllOrders() {
    try {
        const response = await fetch(`/adminPanel/getAllOrders`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.status === 200 ) {
            const allOrders = await response.json();
            console.log("All Orders", allOrders);
            displayAllOrders(allOrders);
        }
    } catch (error) {
        console.log(error);
    }
}

function displayAllOrders(allOrders) {
    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = ''; // Clear previous content

    allOrders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('order');

        const orderDetails = document.createElement('p');
        orderDetails.textContent = `Distributor: ${order.distributorFirstName} ${order.distributorLastName}, Location: ${order.distributorLocation}, Product: ${order.productName}, Requested Quantity: ${order.requestedQuantity}, Current Quantity: ${order.currentQuantity}`;

        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.addEventListener('click', function() {
            updateOrders(order.id, 'accept');
        });

        const rejectButton = document.createElement('button');
        rejectButton.textContent = 'Reject';
        rejectButton.addEventListener('click', function() {
            updateOrders(order.id, 'reject');
        });

        orderDiv.appendChild(orderDetails);
        orderDiv.appendChild(acceptButton);
        orderDiv.appendChild(rejectButton);

        ordersContainer.appendChild(orderDiv);
    });
}

async function updateOrders(orderId, status) {
    try {
        const orderData = {
            id: orderId,
            status: status
        };

        const response = await fetch(`/adminPanel/updateOrders`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(orderData)
        });

        if(response.status === 200) {
            console.log(`${status}ed order successfully.`);
            // Fetch orders again to refresh the list
            getAllOrders();
        } else {
            console.error('Failed to update order:', response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
}

adminLogoutBn.addEventListener("click", ()=> {
    localStorage.clear();
    window.location.href = "http://localhost:3000"
})