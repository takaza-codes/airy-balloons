document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchBlock = document.querySelector(".search");
    const searchIcon = document.getElementById("searchIcon");
    const resultsDiv = document.getElementById("results");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearch = document.getElementById("closeSearch");

    function toggleSearch(event) {
        event.stopPropagation(); // Prevent the click from bubbling up to document
    
        // Show search input if hidden, otherwise do nothing
        if (searchInput.style.display === "none" || searchInput.style.display === "" || searchBlock.style.display === "none") {
            searchBlock.style.display = "flex";
            searchBlock.innerHTML = `<input id="searchInput" class="input_search" type="search" placeholder="Поиск" />`
            searchInput.style.display = "block";
            searchInput.focus();
        }
    }
    
    // Open search input when clicking the icon
    searchIcon.addEventListener("click", toggleSearch);
    
    // Prevent input from closing when clicking inside it
    searchInput.addEventListener("click", (event) => event.stopPropagation());
    
    // Close search input if clicking outside (on the document)
    document.addEventListener("click", function () {
        searchBlock.style.display = "none";
    });
    


    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                const results = searchProducts(searchTerm);
                displayResults(results);
            }
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            searchInput.style.display = "flex";
        } else {
            searchInput.style.display = "none";
        }
    });

    function searchProducts(term) {
        return products.filter(product =>
            product.title.toLowerCase().includes(term.toLowerCase()) ||
            product.description.toLowerCase().includes(term.toLowerCase())
        );
    }

    function displayResults(results) {
        resultsDiv.innerHTML = "";

        if (results.length === 0) {
            resultsDiv.innerHTML = "<p>Ничего не найдено.</p>";
        } else {
            results.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.className = "product";
                productDiv.innerHTML = `
                    <a href="/pages/product-page.html?id=${product.id}" target="_blank" class="product-link">
                        <img src="${product.images[0]}" class="small-img">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                    </a>
                `;
                resultsDiv.appendChild(productDiv);
            });
        }

        searchOverlay.style.display = "flex";
    }

    closeSearch.addEventListener("click", () => {
        searchOverlay.style.display = "none";
    });

    searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.style.display = "none";
        }
    });
});

