let blocks = [];

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
        return `<div class="block link-block"><a href="${this.data.url}">${this.data.text}</a></div>`;
    }
}

function buildPage() {
    const container = document.getElementById('blocks-container');
    container.innerHTML = '';
    blocks.forEach((block, index) => {
        const blockElement = document.createElement('div');
        blockElement.innerHTML = block.render();
        if (document.body.classList.contains('edit-mode')) {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = () => removeBlock(index);
            blockElement.appendChild(deleteButton);
        }
        container.appendChild(blockElement);
    });
}

function toggleEditMode() {
    const body = document.body;
    body.classList.toggle('edit-mode');
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
    buildPage();
    saveToLocalStorage();
}

function removeBlock(index) {
    blocks.splice(index, 1);
    buildPage();
    saveToLocalStorage();
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

// Модальное окно
const modal = document.getElementById('add-block-modal');
const addBlockButton = document.getElementById('add-block-button');
const closeModal = document.querySelector('.close');
const confirmAddBlock = document.getElementById('confirm-add-block');

addBlockButton.onclick = () => {
    modal.style.display = 'block';
};

closeModal.onclick = () => {
    modal.style.display = 'none';
};

confirmAddBlock.onclick = () => {
    const type = document.getElementById('block-type').value;
    const data = document.getElementById('block-data').value;
    if (data) {
        addBlock(type, data);
        modal.style.display = 'none';
    }
};

// Загрузка страницы
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    document.getElementById('edit-mode-toggle').onclick = toggleEditMode;
});