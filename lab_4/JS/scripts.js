document.addEventListener("DOMContentLoaded", () => {
    const reviews = [
        { name: "Вася", text: "Отличный эликсир!", rating: 5, date: new Date() },
        { name: "Лена", text: "Повысил рейтинг, но вкус странный.", rating: 4, date: new Date() },
        { name: "Коля", text: "Не заметил эффекта, но купил.", rating: 3, date: new Date()},
        { name: "Анна", text: "Теперь я заслуженный артист России!!!", rating: 5, date: new Date() },
        { name: "Саня", text: "Получил волко-жену бонусом... Спасите, она выносит мне мозги...", rating: 2, date: new Date() }
    ];

    const form = document.getElementById("review-form");
    const reviewsList = document.getElementById("reviews-list");
    const minRatingInput = document.getElementById("min-rating");
    const sortOrder = document.getElementById("sort-order");
    const applyFiltersButton = document.getElementById("apply-filters");

    function renderReviews() {
        reviewsList.innerHTML = "";
        let filteredReviews = [...reviews];

        const minRating = parseInt(minRatingInput.value);
        if (!isNaN(minRating)) {
            filteredReviews = filteredReviews.filter(review => review.rating >= minRating);
        }

        if (sortOrder.value === "rating") {
            filteredReviews.sort((a, b) => b.rating - a.rating);
        } else {
            filteredReviews.sort((a, b) => b.date - a.date);
        }

        filteredReviews.forEach(review => {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review");
            reviewElement.innerHTML = `
                <strong>${review.name}</strong>
                <p>${review.text}</p>
                <small>Оценка: ${review.rating} ⭐ | ${review.date.toLocaleDateString()}</small>
            `;
            reviewsList.appendChild(reviewElement);
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const text = document.getElementById("review-text").value.trim();
        const rating = parseInt(document.getElementById("rating").value);

        if (!name || !text || isNaN(rating) || rating < 1 || rating > 5) {
            alert("Заполните все поля корректно (оценка от 1 до 5)!");
            return;
        }

        reviews.push({ name, text, rating, date: new Date() });
        form.reset();
        renderReviews();
    });

    applyFiltersButton.addEventListener("click", renderReviews);

    renderReviews();
});


document.addEventListener("DOMContentLoaded", () => {
    const reviews = [
        { name: "Иван", text: "Отличный продукт!", rating: 5, date: new Date() },
        { name: "Мария", text: "Неплохо, но можно лучше", rating: 3, date: new Date() },
        { name: "Алексей", text: "Понравилось! Буду брать ещё.", rating: 4, date: new Date() }
    ];

    const form = document.getElementById("review-form");
    const nameInput = document.getElementById("name");
    const textInput = document.getElementById("review-text");
    const ratingInput = document.getElementById("rating");
    const reviewsContainer = document.getElementById("reviews-container");
    const filterSelect = document.getElementById("filter-rating");
    const sortSelect = document.getElementById("sort-reviews");

    // Функция рендера отзывов
    function renderReviews() {
        reviewsContainer.innerHTML = "";
        let filteredReviews = [...reviews];

        // Фильтрация по оценке
        const filterValue = filterSelect.value;
        if (filterValue !== "all") {
            const minRating = parseInt(filterValue);
            filteredReviews = filteredReviews.filter(review => review.rating >= minRating);
        }

        // Сортировка
        const sortValue = sortSelect.value;
        if (sortValue === "highest") {
            filteredReviews.sort((a, b) => b.rating - a.rating);
        } else if (sortValue === "lowest") {
            filteredReviews.sort((a, b) => a.rating - b.rating);
        } else {
            filteredReviews.sort((a, b) => b.date - a.date);
        }

        // Генерация HTML отзывов
        filteredReviews.forEach(review => {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review");
            reviewElement.innerHTML = `
                <strong>${review.name}</strong> 
                <span class="rating">⭐ ${review.rating}</span>
                <p>${review.text}</p>
                <small>${review.date.toLocaleString()}</small>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    }

    // Обработчик отправки формы
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const text = textInput.value.trim();
        const rating = parseInt(ratingInput.value);

        if (!name || !text || isNaN(rating) || rating < 1 || rating > 5) {
            alert("Пожалуйста, заполните все поля корректно (оценка от 1 до 5)");
            return;
        }

        // Добавление нового отзыва
        reviews.push({ name, text, rating, date: new Date() });

        // Очистка формы
        form.reset();

        // Обновление списка отзывов
        renderReviews();
    });

    // Обработчики фильтрации и сортировки
    filterSelect.addEventListener("change", renderReviews);
    sortSelect.addEventListener("change", renderReviews);

    // Инициализация отзывов
    renderReviews();
});
// Находим кнопку
const themeToggle = document.getElementById("theme-toggle");

// Проверяем, есть ли сохранённая тема в LocalStorage
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
}

// Добавляем обработчик клика на кнопку
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    // Сохраняем выбранную тему в LocalStorage
    if (document.body.classList.contains("light-theme")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
});




