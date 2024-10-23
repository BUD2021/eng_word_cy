$(document).ready(function() {
    const tableBody = $('#word-table-body');
    const indexList = $('#index-list');
    let allWords = []; // 儲存所有單字

    // 載入所有級別的單字
    function loadAllWords() {
        $.getJSON('word.json', function(data) {
            for (const [key, words] of Object.entries(data)) {
                words.forEach(word => {
                    if (word.單字 && word.中文) {
                        allWords.push({ ...word, level: key }); // 為每個單字添加級數
                    }
                });
            }
            loadLevel('1級'); // 預設載入1級
        });
    }

    // 載入指定級別的單字
    function loadLevel(level) {
        console.log(`Loading level: ${level}`); // 調試輸出
        tableBody.empty(); // 清空表格
        indexList.empty(); // 清空快速索引

        // 過濾當前級別的單字
        const filteredWords = allWords.filter(word => word.level === level);
        console.log(`Filtered words:`, filteredWords); // 調試輸出

        filteredWords.forEach((word, index) => {
            const rowId = `row-${index}`; // 唯一ID
            const row = 
                `<tr id="${rowId}">
                    <td>${index + 1}</td>
                    <td class="eng">${word.單字}</td>
                    <td>${word.中文}</td>
                    <td>${word.level}</td> <!-- 新增級數欄位 -->
                </tr>`;
            tableBody.append(row);

            // 添加快速索引，每 50 個單字為一個索引
            if (index % 50 === 0) {
                const indexLink = 
                    `<li><a class="dropdown-item" href="#${rowId}">
                        序列${index + 1}
                    </a></li>`;
                indexList.append(indexLink);
            }
        });
    }

    // 綁定按鈕事件
    $('#level1Btn').click(() => { searchInput.setAttribute('data-current-level', '1級'); loadLevel('1級'); });
    $('#level2Btn').click(() => { searchInput.setAttribute('data-current-level', '2級'); loadLevel('2級'); });
    $('#level3Btn').click(() => { searchInput.setAttribute('data-current-level', '3級'); loadLevel('3級'); });
    $('#level4Btn').click(() => { searchInput.setAttribute('data-current-level', '4級'); loadLevel('4級'); });
    $('#level5Btn').click(() => { searchInput.setAttribute('data-current-level', '5級'); loadLevel('5級'); });
    $('#level6Btn').click(() => { searchInput.setAttribute('data-current-level', '6級'); loadLevel('6級'); });


    // 載入所有單字
    loadAllWords();

    // 顯示返回頂端按鈕
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#scrollToTop').fadeIn();
        } else {
            $('#scrollToTop').fadeOut();
        }
    });

    // 返回頂端功能
    $('#scrollToTop').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 400);
        return false;
    });

    // 隱藏中文功能
    const toggleChineseBtn = document.getElementById('toggleChineseBtn');
    let isChineseBlurred = false;

    toggleChineseBtn.addEventListener('click', function() {
        isChineseBlurred = !isChineseBlurred;
        const chineseCells = document.querySelectorAll('#word-table td:nth-child(3)');
        chineseCells.forEach(cell => {
            cell.style.filter = isChineseBlurred ? 'blur(4px)' : 'none';
        });
        toggleChineseBtn.textContent = isChineseBlurred ? '顯示中文' : '隱藏中文';
    });

    // 搜尋功能
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    function searchRows() {
        const searchTerm = searchInput.value.toLowerCase();
        tableBody.empty(); // 清空表格以顯示搜尋結果
    
        if (searchTerm.trim() === '') {
            // 如果搜尋字串是空的，重新載入當前級別的單字
            const currentLevel = searchInput.getAttribute('data-current-level') || '1級';
            loadLevel(currentLevel);
            return;
        }
    
        const filteredWords = allWords.filter(word => {
            const englishWord = typeof word.單字 === 'string' ? word.單字.toLowerCase() : '';
            const chineseWord = typeof word.中文 === 'string' ? word.中文.toLowerCase() : '';
            return englishWord.includes(searchTerm) || chineseWord.includes(searchTerm);
        });
    
        filteredWords.forEach((word, index) => {
            const rowId = `row-${index}`; // 唯一ID
            const row = 
                `<tr id="${rowId}">
                    <td>${index + 1}</td>
                    <td class="eng">${word.單字}</td>
                    <td>${word.中文}</td>
                    <td>${word.level}</td> <!-- 新增級數欄位 -->
                </tr>`;
            tableBody.append(row);
        });
    }
    

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchRows();
    });
});
