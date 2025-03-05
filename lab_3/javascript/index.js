function startGame() {
    // Начало игры с использованием confirm
    let play = confirm("Хотите сыграть в игру 'Угадай произведение'? Я загадаю 4 классических произведения русской литературы, а вы попробуете угадать их по подсказкам!");

    if (!play) {
        alert("Жаль, что вы не хотите играть. Возвращайтесь, когда передумаете!");
        return;
    }

    // Массив произведений
    const works = [
        { title: "идиот", hint: "Это произведение о князе, который отличается своей добротой и наивностью в жестоком мире.", extraHint: "Автор - Фёдор Достоевский." },
        { title: "горе от ума", hint: "Комедия в стихах о молодом человеке, который конфликтует с обществом из-за своего острого ума.", extraHint: "Автор - Александр Грибоедов." },
        { title: "преступление и наказание", hint: "История о студенте, который совершает убийство и сталкивается с муками совести.", extraHint: "Главный герой - Раскольников." },
        { title: "мастер и маргарита", hint: "Роман о любви, дьяволе и писателе, чья рукопись не горит.", extraHint: "Автор - Михаил Булгаков." }
    ];

    let correctAnswers = 0; // Счетчик правильных ответов
    let currentQuestion = 0; // Текущий вопрос

    alert("Я загадал 4 произведения русской литературы. У вас будет по 3 попытки на каждое произведение. Начнем!");

    // Цикл по всем произведениям
    while (currentQuestion < works.length) {
        let attempts = 3;
        const currentWork = works[currentQuestion];

        while (attempts > 0) {
            let guess = prompt(`Вопрос ${currentQuestion + 1}/4\nПодсказка: ${currentWork.hint}\nЕсли нужна дополнительная подсказка, напишите 'подсказка'.\nКак называется произведение? (Осталось попыток: ${attempts})`);

            if (guess === null) {
                alert("Вы отменили игру. До встречи!");
                return;
            }

            guess = guess.trim().toLowerCase();

            if (guess === "") {
                alert("Пожалуйста, введите название или 'подсказка'!");
                continue;
            }

            if (guess === "подсказка") {
                let extraHint = confirm("Хотите получить дополнительную подсказку?");
                if (extraHint) {
                    alert(`Дополнительная подсказка: ${currentWork.extraHint}`);
                } else {
                    alert("Хорошо, продолжайте без подсказки!");
                }
                continue;
            }

            if (guess === currentWork.title) {
                alert(`Поздравляю! Вы угадали! Это действительно "${currentWork.title.charAt(0).toUpperCase() + currentWork.title.slice(1)}"!`);
                correctAnswers++;
                break; // Переход к следующему произведению
            } else {
                attempts--;
                if (attempts > 0) {
                    alert(`Неправильно! У вас осталось ${attempts} попыт${attempts === 1 ? "ка" : "ки"}. Попробуйте еще раз!`);
                } else {
                    alert(`Попытки закончились! Это было "${currentWork.title.charAt(0).toUpperCase() + currentWork.title.slice(1)}".`);
                    break; // Переход к следующему произведению
                }
            }
        }
        currentQuestion++; // Переход к следующему вопросу
    }

    // Итоговый результат
    alert(`Игра окончена! Вы угадали ${correctAnswers} из ${works.length} произведений.`);

    // Предложение сыграть заново
    playAgain();
}

function playAgain() {
    let replay = confirm("Хотите сыграть еще раз?");
    if (replay) {
        startGame();
    } else {
        alert("Спасибо за игру! До новых встреч!");
    }
}