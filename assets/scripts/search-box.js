document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput"); // Desktop input
    const searchInputMobile = document.getElementById("searchInputMobile"); // Mobile input in overlay
    const searchIcon = document.getElementById("searchIcon");
    const resultsDiv = document.getElementById("results");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearch = document.getElementById("closeSearch");

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function toggleSearch(event) {
        event.stopPropagation();

        if (isMobile()) {
            if (searchOverlay.style.display === "none" || searchOverlay.style.display === "") {
                showSearch();
            } else {
                hideSearch();
            }
        }
    }

    //Отображение поля ввода: внутри модального окна для мобильных устройств, в хедере для десктопа
    function showSearch() {
        if (isMobile()) {
            searchOverlay.style.display = "flex"; 
            searchInputMobile.style.display = "inline-block";

            searchInputMobile.value = "";
            setTimeout(() => {
                searchInputMobile.scrollIntoView({ behavior: 'smooth', block: 'center' });
                searchInputMobile.focus();
            }, 100);
        } else {
            searchOverlay.style.display = "flex";
            searchInput.style.display = "inline-block";
        }
    }

    // Прятать модальное окно и затемнение
    function hideSearch() {
        resultsDiv.innerHTML = ""; // Очистка результатов поиска
        if (isMobile()) {
            searchOverlay.style.display = "none"; 
            searchInputMobile.value = "";
        } else {
            searchOverlay.style.display = "none";
        }
    }

    // Вызывать модальное окно при клике на иконку поиска, если она есть
    if (searchIcon) {
        searchIcon.addEventListener("click", toggleSearch);
        // searchIcon.addEventListener("touchstart", (e) => {
        //     e.preventDefault();
        //     toggleSearch(e);
        // });
        searchIcon.addEventListener("touchstart", (e) => {
            // Здесь можно вызвать stopPropagation, если нужно предотвратить всплытие,
            // но не отменяем стандартное поведение, чтобы якорные ссылки работали.
            e.stopPropagation();
            toggleSearch(e);
        });
    }

    // Не закрывать окно при клике на поле ввода или окно отображения результатов
    searchInput.addEventListener("click", (event) => event.stopPropagation());
    searchInputMobile.addEventListener("click", (event) => event.stopPropagation());
    resultsDiv.addEventListener("click", (event) => event.stopPropagation());

    document.addEventListener("click", function (event) {
        if (!searchOverlay.contains(event.target) && event.target !== searchIcon) {
            hideSearch();
        }
    });

    // Обработка нажатия Enter
    function handleSearchInput(event, inputElement) {
        if (event.key === "Enter") {
            const searchTerm = inputElement.value.trim();
            if (searchTerm) {
                const results = searchProducts(searchTerm);
                displayResults(results);
            }
        }
    }

    // Поиск товаров, у которых в названии или описании есть введенное в поисковое поле слово
    function searchProducts(term) {
        return products.filter(product =>
            product.title.toLowerCase().includes(term.toLowerCase()) ||
            product.description.toLowerCase().includes(term.toLowerCase())
        );
    }

    // Отображение результатов в модальном окне
    function displayResults(results) {
        resultsDiv.innerHTML = "";

        if (results.length === 0) {
            resultsDiv.innerHTML = "<p>Ничего не найдено.</p>";
        } else {
            const searchResultsHeading = document.createElement("h2");
            searchResultsHeading.textContent = "Результаты поиска";
            resultsDiv.appendChild(searchResultsHeading);

            results.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.className = "product";
                productDiv.innerHTML = `
                    <a href="/pages/product-page.html?id=${product.id}" target="_blank" class="product-link">
                        <div id="small-img-container">
                            <img src="${product.images[0]}" class="small-img">
                        </div>
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                    </a>
                `;
                resultsDiv.appendChild(productDiv);
            });
        }

        if (!isMobile()) {
            searchOverlay.style.display = "flex";
        }
    }

    // Закрывать модальное окно по клике на крестик
    closeSearch.addEventListener("click", (e) => {
        e.preventDefault();
        hideSearch();
    });

    // Закрывать модальное окно по клику на затемненный фон
    searchOverlay.addEventListener("click", (e) => {
        if (e.target === searchOverlay) {
            hideSearch();
        }
    });

    // Обработка нажатия Enter
    searchInput.addEventListener("keypress", (event) => handleSearchInput(event, searchInput));
    searchInputMobile.addEventListener("keypress", (event) => handleSearchInput(event, searchInputMobile));

    // Ресайз окна
    window.addEventListener("resize", () => {
        if (window.innerWidth <= 768) {
            if (searchOverlay.style.display === "flex") {
                showSearch();
            } else {
                hideSearch();
            }
        } else {
            searchOverlay.style.display = "flex"; 
            hideSearch(); 
        }
    });
});


