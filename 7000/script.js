$(document).ready(function() {
    const tableBody = $('#word-table-body');
    const indexList = $('#index-list');

    // 載入指定級別的單字
    function loadLevel(level) {
        $.getJSON('word.json', function(data) {
            const words = data[level];
            tableBody.empty(); // 清空表格
            indexList.empty(); // 清空快速索引

            words.forEach((word, index) => {
                const rowId = `index-${index}`; // 唯一ID
                const row = `
                    <tr id="${rowId}">
                        <td>${index + 1}</td>
                        <td class="eng">${word.單字}</td>
                        <td>${word.中文}</td>
                    </tr>
                `;
                tableBody.append(row);

                // 添加快速索引，每 50 個單字為一個索引
                if (index % 50 === 0) {
                    const indexLink = `
                        <li><a class="dropdown-item" href="#${rowId}">
                            序列${index + 1}
                        </a></li>`;
                    indexList.append(indexLink);
                }
            });

            // 重置搜尋功能
            searchInput.value = '';
            searchRows();
        });
    }

    // 綁定按鈕事件
    $('#level1Btn').click(() => loadLevel('1級'));
    $('#level2Btn').click(() => loadLevel('2級'));
    $('#level3Btn').click(() => loadLevel('3級'));
    $('#level4Btn').click(() => loadLevel('4級'));
    $('#level5Btn').click(() => loadLevel('5級'));
    $('#level6Btn').click(() => loadLevel('6級'));

    // 預設載入 1級
    loadLevel('1級');

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
            if (isChineseBlurred) {
                cell.style.filter = 'blur(4px)';
                cell.style.transform = 'translateZ(0)';  // 啟用硬體加速
            } else {
                cell.style.filter = 'none';
                cell.style.transform = 'none';  // 恢復原狀
            }
        });
        toggleChineseBtn.textContent = isChineseBlurred ? '顯示中文' : '隱藏中文';
    });


    // 搜尋功能
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    function searchRows() {
        const searchTerm = searchInput.value.toLowerCase();
        const wordRows = document.querySelectorAll('#word-table tbody tr');

        wordRows.forEach(row => {
            const word = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            if (word.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchRows();
    });
});
