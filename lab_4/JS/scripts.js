document.addEventListener("DOMContentLoaded", () => {
    const reviews = [
        { name: "Вася", text: "Отличный эликсир!", rating: 5, date: new Date("2000-10-19") },
        { name: "Иисус", text: "Повысил рейтинг!", rating: 4, date: new Date("988-01-01")},
        { name: "Адольф", text: "Не заметил эффекта, но купил.", rating: 3, date: new Date("1941-06-22")},
        { name: "Иосиф", text: "овысил рейтинг, но вкус странный.", rating: 5, date:new Date("1945-01-09") },
        { name: "Саня", text: "Получил волко-жену бонусом... Спасите, она выносит мне мозги...", rating: 2, date: new Date("2022-02-24") },
        { name: "Иван", text: "Отличный продукт!", rating: 5, date: new Date("3033-04-24") },
        { name: "Мамай", text: "Неплохо, но можно лучше", rating: 3, date: new Date("1267-07-13") },
        { name: "Владимир", text: "Понравилось! Буду брать ещё.", rating: 4, date: new Date("1922-12-30") }
    ];

    const form = document.getElementById("review-form");
    const reviewsList = document.getElementById("reviews-list");
    const minRatingInput = document.getElementById("min-rating");
    const sortOrder = document.getElementById("sort-order");
    const applyFiltersButton = document.getElementById("apply-filters");
    const themeToggle = document.getElementById("theme-toggle");

    // Функция рендера отзывов
    function renderReviews() {
        reviewsList.innerHTML = "";
        let filteredReviews = [...reviews];

        // Фильтрация по минимальной оценке
        const minRating = parseInt(minRatingInput.value);
        if (!isNaN(minRating)) {
            filteredReviews = filteredReviews.filter(review => review.rating >= minRating);
        }

        // Сортировка
        if (sortOrder.value === "rating") {
            filteredReviews.sort((a, b) => b.rating - a.rating);
        } else {
            filteredReviews.sort((a, b) => b.date - a.date);
        }

        // Генерация HTML
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

    // Обработчик отправки формы
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

    // Обработчик фильтрации
    applyFiltersButton.addEventListener("click", renderReviews);

    // Переключение темы
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
    });

    // Инициализация
    renderReviews();
});