let itemsContainer = document.getElementById("items");
let productDetails = document.getElementById("productDetails");
let search = document.getElementById("search");
let sortSelect = document.getElementById("sortPrice");
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

document.getElementById("wishlistCount").textContent = wishlist.length;

let products = [];
let filteredProducts = [];

let currentPage = 1;
const productsPerPage = 10;

// Fetch Products
fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(data => {

        products = data.products;
        filteredProducts = [...products];

        renderProducts(filteredProducts);

    });

// Render Products
function renderProducts(list) {

    itemsContainer.innerHTML = "";

    let start = (currentPage - 1) * productsPerPage;
    let end = start + productsPerPage;

    let paginatedProducts = list.slice(start, end);

    paginatedProducts.forEach(product => {

        itemsContainer.innerHTML += `
        
        <div
            onclick="showDetails(${products.indexOf(product)})"
            class="bg-white rounded-xl shadow-md p-3 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300"
        >

            <img
                src="${product.thumbnail}"
                class="w-full h-44 object-cover rounded-lg"
            >

           <h3 class="font-semibold mt-3 text-black">
    ${product.title}
</h3>

            <p class="text-green-600 font-bold mt-2">
                ₹ ${product.price}
            </p>

        </div>
        
        `;
    });

    renderPagination(list);
}

// Product Details
function showDetails(index) {

    let product = products[index];

    productDetails.innerHTML = `

    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6">

        <div class="flex justify-center">
            <img
                src="${product.thumbnail}"
                class="w-72 h-72 object-cover rounded-lg"
            >
        </div>

        <div class="flex-1">

            <h2 class="text-3xl font-bold mb-4">
                ${product.title}
            </h2>

            <p class="mb-2">
                <span class="font-bold">Price:</span>
                ₹ ${product.price}
            </p>

            <p class="mb-2">
                <span class="font-bold">Rating:</span>
                ⭐ ${product.rating}
            </p>

            <p class="mb-2">
                <span class="font-bold">Category:</span>
                ${product.category}
            </p>

            <p class="mt-4 text-gray-700">
                ${product.description}
            </p>
           <button
               onclick="addToCart(${index})"
               class="bg-green-600 text-white px-4 py-2 rounded-3g mt-4 hover:bg-green-700 transition"
            >
              <i class="fa-solid fa-cart-arrow-down"></i>
               Add to Cart
            </button>
            <button
               onclick="addToWishlist(${index})"
               class="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 ml-2"
              >
             <i class="fa-regular fa-heart"></i>
           </button>

        </div>

    </div>

    `;

    productDetails.scrollIntoView({
        behavior: "smooth"
    });
}

// Search
search.addEventListener("input", function () {

    let query = this.value.toLowerCase().trim();

    if(query === ""){

        filteredProducts = [...products];

    }else{

        filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(query)
        );
    }

    currentPage = 1;

    renderProducts(filteredProducts);
});

// Sort
sortSelect.addEventListener("change", function () {

    let value = this.value;

    if (value === "asc") {

        filteredProducts = [...filteredProducts]
            .sort((a, b) => a.price - b.price);

    }
    else if (value === "desc") {

        filteredProducts = [...filteredProducts]
            .sort((a, b) => b.price - a.price);

    }
    else {

        filteredProducts = [...products];
    }

    currentPage = 1;

    renderProducts(filteredProducts);
});

// Pagination
function renderPagination(list) {

    let totalPages = Math.ceil(
        list.length / productsPerPage
    );

    let pagination =
        document.getElementById("pagination");

    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `

        <button
            onclick="goToPage(${i})"
            class="
                w-10 h-10 rounded-full
                ${
                    currentPage === i
                    ? "bg-black text-white"
                    : "bg-gray-300"
                }
                hover:scale-110 transition
            "
        >
            ${i}
        </button>

        `;
    }
}

// Go To Page
function goToPage(page) {

    currentPage = page;

    renderProducts(filteredProducts);
}

// Add to Cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {

    document.getElementById("cartCount").textContent =
        cart.reduce((sum, item) => sum + (item.qty || 1), 0);
}

updateCartCount();

function addToCart(index){

    let product = products[index];

    let existing =
    cart.find(item => item.id === product.id);

    if(existing){
        existing.qty++;
    }else{

        cart.push({
            id: product.id,
            name: product.title,
            price: product.price,
            image: product.thumbnail,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("Added To Cart");
}

function addToWishlist(index){

    let product = products[index];

    let existing = wishlist.find(
        item => item.id === product.id
    );

    if(existing){
        alert("Already added to wishlist");
        return;
    }

    wishlist.push({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.thumbnail
    });

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    document.getElementById("wishlistCount").textContent =
        wishlist.length;

    alert("Added to wishlist");
}


function updateDateTime() {
    let now = new Date();

    let date = now.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    let time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    document.getElementById("dateTime").innerHTML =
        `📅 ${date} <br> ⏰ ${time}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);
