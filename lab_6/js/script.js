let blocks = [];
let draggedBlock = null;
let currentUserId = null;

class Block {
    constructor(data) {
        this.data = data;
    }
    render() {
        throw new Error("Method 'render()' must be implemented.");
    }
}

class TextBlock extends Block {
    render() {
        return `<div class="block text-block">${this.data}</div>`;
    }
}

class ImageBlock extends Block {
    render() {
        return `<div class="block image-block"><img src="${this.data}" alt="Image"></div>`;
    }
}

class LinkBlock extends Block {
    render() {
        return `<div class="block link-block"><a href="${this.data.url}" target="_blank">${this.data.text}</a></div>`;
    }
}

function buildPage() {
    const container = document.getElementById('blocks-container');
    container.innerHTML = '';
    blocks.forEach((block, index) => {
        const blockElement = document.createElement('div');
        blockElement.innerHTML = block.render();
        blockElement.firstChild.dataset.index = index;

        if (document.body.classList.contains('edit-mode')) {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.onclick = () => removeBlock(index);
            blockElement.firstChild.appendChild(deleteButton);

            blockElement.firstChild.draggable = true;
            blockElement.firstChild.addEventListener('dragstart', handleDragStart);
            blockElement.firstChild.addEventListener('dragover', handleDragOver);
            blockElement.firstChild.addEventListener('drop', handleDrop);
            blockElement.firstChild.addEventListener('dragend', handleDragEnd);
        }
        container.appendChild(blockElement);
    });
}

function handleDragStart(e) {
    draggedBlock = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.remove('drag-over');

    if (draggedBlock !== this) {
        const fromIndex = parseInt(draggedBlock.dataset.index);
        const toIndex = parseInt(this.dataset.index);

        [blocks[fromIndex], blocks[toIndex]] = [blocks[toIndex], blocks[fromIndex]];
        saveToLocalStorage();
        buildPage();
    }
}

function handleDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.block').forEach(block => {
        block.classList.remove('drag-over');
    });
}

function toggleEditMode() {
    document.body.classList.toggle('edit-mode');
    buildPage();
}

function addBlock(type, data) {
    let newBlock;
    switch (type) {
        case 'text':
            newBlock = new TextBlock(data);
            break;
        case 'image':
            newBlock = new ImageBlock(data);
            break;
        case 'link':
            newBlock = new LinkBlock({ url: data, text: 'Link' });
            break;
        default:
            throw new Error("Unknown block type");
    }
    blocks.push(newBlock);
    saveToLocalStorage();
    buildPage();
}

function removeBlock(index) {
    blocks.splice(index, 1);
    saveToLocalStorage();
    buildPage();
}

function saveToLocalStorage() {
    const serializedBlocks = blocks.map(block => ({
        type: block.constructor.name,
        data: block.data
    }));
    localStorage.setItem('blocks', JSON.stringify(serializedBlocks));
}

function loadFromLocalStorage() {
    const serializedBlocks = JSON.parse(localStorage.getItem('blocks'));
    if (serializedBlocks) {
        blocks = serializedBlocks.map(blockData => {
            switch (blockData.type) {
                case 'TextBlock':
                    return new TextBlock(blockData.data);
                case 'ImageBlock':
                    return new ImageBlock(blockData.data);
                case 'LinkBlock':
                    return new LinkBlock(blockData.data);
                default:
                    throw new Error("Unknown block type");
            }
        });
        buildPage();
    }
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function isValidImageUrl(url) {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
}

// Функция для блокировки/разблокировки кнопок
function toggleButton(apiType, disable) {
    const button = document.querySelector(`.nav-item[data-api="${apiType}"]`);
    if (button) button.disabled = disable;
}

// API функции с блокировкой кнопок
async function fetchRandomUser() {
    toggleButton('random-user', true);
    showLoading(true);
    try {
        const response = await fetch('https://reqres.in/api/users?page=1');
        if (!response.ok) throw new Error(`GET error! Status: ${response.status}`);
        const data = await response.json();
        const user = data.data[Math.floor(Math.random() * data.data.length)];
        addBlock('text', `👤 ${user.first_name} ${user.last_name} (${user.email})`);
    } catch (error) {
        addBlock('text', `Ошибка загрузки пользователя: ${error.message}`);
    } finally {
        showLoading(false);
        toggleButton('random-user', false);
    }
}

async function fetchJoke() {
    toggleButton('joke', true);
    showLoading(true);
    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        if (!response.ok) throw new Error(`GET error! Status: ${response.status}`);
        const joke = await response.json();
        addBlock('text', `😂 ${joke.setup} - ${joke.punchline}`);
    } catch (error) {
        addBlock('text', `Ошибка загрузки шутки: ${error.message}`);
    } finally {
        showLoading(false);
        toggleButton('joke', false);
    }
}

async function fetchQuote() {
    toggleButton('quote', true);
    showLoading(true);
    try {
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) throw new Error(`GET error! Status: ${response.status}`);
        const quote = await response.json();
        const quoteText = `💬 "${quote.quote}" - ${quote.author}`;
        addBlock('text', quoteText);
    } catch (error) {
        addBlock('text', `Ошибка загрузки цитаты: ${error.message}`);
    } finally {
        showLoading(false);
        toggleButton('quote', false);
    }
}

async function createUser() {
    toggleButton('create-user', true);
    showLoading(true);
    try {
        if (currentUserId) {
            addBlock('text', `⚠ Ошибка: Нельзя создать больше одного пользователя. Удалите текущего.`);
            return;
        }
        const response = await fetch('https://reqres.in/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Alex Purple', email: 'alex.purple@paradise.com' })
        });
        if (!response.ok) throw new Error(`POST error! Status: ${response.status}`);
        const data = await response.json();
        currentUserId = data.id;
        addBlock('text', `➕ Пользователь создан: ${data.name} (${data.email}) ID: ${data.id}`);
    } catch (error) {
        addBlock('text', `Ошибка создания пользователя: ${error.message}`);
    } finally {
        showLoading(false);
        toggleButton('create-user', false);
    }
}

async function updateUser() {
    toggleButton('update-user', true);
    showLoading(true);
    try {
        if (!currentUserId) throw new Error('Сначала создайте пользователя');
        const response = await fetch(`https://reqres.in/api/users/${currentUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Alex Updated', email: 'alex.updated@paradise.com' })
        });
        if (!response.ok) throw new Error(`PUT error! Status: ${response.status}`);
        const data = await response.json();
        addBlock('text', `🔄 Пользователь обновлен: ${data.name} (${data.email})`);
    } catch (error) {
        addBlock('text', `Ошибка обновления пользователя: ${error.message}`);
    } finally {
        showLoading(false);
        toggleButton('update-user', false);
    }
}

async function patchUser() {
    toggleButton('patch-user', true);
    showLoading(true);
    try {
        if (!currentUserId) throw new Error('Сначала создайте пользователя');
        const response = await fetch(`https://reqres.in/api/users/${currentUserId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'alex.patched@paradise.com' })
        });
        if (!response.ok) throw new Error(`PATCH error! Status: ${response.status}`);
        const data = await response.json();
        addBlock('text', `📝 Частично обновлен: Email: ${data.email}`);
    } catch (error) {
        addBlock('text', `Ошибка частичного обновления: ${error.message}`);
    } finally {
        showLoading(false);
        toggleButton('patch-user', false);
    }
}

async function deleteUser() {
    toggleButton('delete-user', true);
    showLoading(true);
    try {
        if (!currentUserId) throw new Error('Сначала создайте пользователя');
        const response = await fetch(`https://reqres.in/api/users/${currentUserId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`DELETE error! Status: ${response.status}`);
        addBlock('text', `🗑 Пользователь ID:${currentUserId} удален`);
        currentUserId = null;
    } catch (error) {
        addBlock('text', `Ошибка удаления пользователя: ${error.message}`);
    } finally {
        showLoading(false);
        toggleButton('delete-user', false);
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();

    const modal = document.getElementById('add-block-modal');
    const addBlockButton = document.getElementById('add-block-button');
    const closeModal = document.querySelector('.close');
    const confirmAddBlock = document.getElementById('confirm-add-block');

    document.getElementById('edit-mode-toggle').onclick = toggleEditMode;

    addBlockButton.onclick = () => modal.style.display = 'block';
    closeModal.onclick = () => modal.style.display = 'none';

    confirmAddBlock.onclick = () => {
        const type = document.getElementById('block-type').value;
        const data = document.getElementById('block-data').value;

        if (!data) {
            alert('Please enter data');
            return;
        }

        if (type === 'image' && !isValidImageUrl(data)) {
            alert('Please enter a valid image URL (jpg, jpeg, png, gif, webp)');
            return;
        }

        addBlock(type, data);
        document.getElementById('block-data').value = '';
        modal.style.display = 'none';
    };

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const apiType = item.dataset.api;
            if (apiType === 'random-user') fetchRandomUser();
            if (apiType === 'joke') fetchJoke();
            if (apiType === 'quote') fetchQuote();
            if (apiType === 'create-user') createUser();
            if (apiType === 'update-user') updateUser();
            if (apiType === 'patch-user') patchUser();
            if (apiType === 'delete-user') deleteUser();
        });
    });
});