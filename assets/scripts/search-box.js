document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchBlock = document.querySelector(".search");
    const searchIcon = document.getElementById("searchIcon");
    const resultsDiv = document.getElementById("results");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearch = document.getElementById("closeSearch");
    const messengerIcons = document.querySelector(".messengers");

    function toggleSearch(event) {
        event.stopPropagation();

        if (searchBlock.style.display === "none" || searchBlock.style.display === "") {
            showSearch();
        } else {
            hideSearch();
        }
    }

    function showSearch() {
        messengerIcons.style.display = "none";
        searchBlock.style.display = "flex";
        searchInput.style.display = "inline-block";
        searchInput.focus();
    }

    function hideSearch() {
        if (window.innerWidth <= 768) { 
            searchBlock.style.display = "none";
        }
        resultsDiv.innerHTML = "";
        messengerIcons.style.display = "flex";
    }

    searchIcon.addEventListener("click", toggleSearch);
    searchIcon.addEventListener("touchstart", toggleSearch);

    searchInput.addEventListener("click", (event) => event.stopPropagation());
    resultsDiv.addEventListener("click", (event) => event.stopPropagation());

    document.addEventListener("click", function (event) {
        if (!searchBlock.contains(event.target) && event.target !== searchIcon) {
            hideSearch();
        }
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const searchTerm = searchInput.value.trim();
            if (!searchTerm) return;
            const results = searchProducts(searchTerm);
            displayResults(results);
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
                        <div class="small-img-container">
                    <img src="${product.images[0]}" class="small-img">
                    </div>
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
        searchInput.value = "";
        hideSearch();
    });

    closeSearch.addEventListener("touchstart", () => {
        searchOverlay.style.display = "none";
        searchInput.value = "";
        hideSearch();
    });

    searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.style.display = "none";
            searchInput.value = "";
            hideSearch();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            showSearch();
        } else {
            hideSearch();
        }
    });
});
