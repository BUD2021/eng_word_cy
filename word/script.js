$(document).ready(function() {
    $.getJSON('word.json', function(data) {
        const tableBody = $('#word-table-body');
        const indexList = $('#index-list');
        const words = data["工作表1"];

        // 生成表格內容和快速索引
        words.forEach((word, index) => {
            const yearArray = JSON.parse(word.年分.replace(/'/g, '"'));
            const truncatedYears = yearArray.length > 10 ? yearArray.slice(0, 10).join(', ') + '...' : yearArray.join(', ');

            const row = `
                <tr id="index-${index}">
                    <td>${index + 1}</td>
                    <td class="eng">${word.單字}</td>
                    <td class="count-display">${word.次數}</td>
                    <td class="level-display">${word.級數}</td>
                    <td>${word.中文}</td>
                    <td class="year-display">
                        <span>${truncatedYears}</span>
                        <button class="btn btn-link btn-sm toggle-years float-end" data-full="${yearArray.join(', ')}">顯示完整</button>
                    </td>
                </tr>
            `;
            tableBody.append(row);

            // 添加快速索引，每 50 個單字為一個索引
            if (index % 50 === 0) {
                const indexLink = `
                    <li><a class="dropdown-item" href="#index-${index}">
                        序列${index + 1}
                    </a></li>`;
                indexList.append(indexLink);
            }
        });

        // 顯示/隱藏年份功能
        $('.toggle-years').click(function() {
            const fullYears = $(this).data('full');
            const yearDisplay = $(this).siblings('span');

            if (yearDisplay.text() === fullYears) {
                yearDisplay.text(fullYears.slice(0, 10) + '...');
                $(this).text('顯示完整');
            } else {
                yearDisplay.text(fullYears);
                $(this).text('隱藏');
            }
        });

        // 隱藏年份、次數和級數欄位在手機上
        if (window.innerWidth <= 768) {
            $('th:nth-child(3), th:nth-child(4), th:nth-child(6), td.count-display, td.level-display, td.year-display').hide();
        }

        // 使表格在手機上可左右滑動
        const tableContainer = $('.table-responsive');
        tableContainer.css('overflow-x', 'auto'); // 確保容器可左右滾動
    });

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
});

// 取得按鈕元素
const toggleChineseBtn = document.getElementById('toggleChineseBtn');
// 設定一個變數來追蹤中文是否顯示
let isChineseBlurred = false;

// 監聽按鈕點擊事件
toggleChineseBtn.addEventListener('click', function() {
    // 切換模糊狀態
    isChineseBlurred = !isChineseBlurred;

    // 選取所有的 "中文" 欄位
    const chineseCells = document.querySelectorAll('#word-table td:nth-child(5)');

    // 根據狀態加上或移除模糊效果
    chineseCells.forEach(cell => {
        if (isChineseBlurred) {
            cell.style.filter = 'blur(5px)';  // 套用 5px 的模糊效果
        } else {
            cell.style.filter = 'none';  // 移除模糊效果
        }
    });

    // 更新按鈕文字
    toggleChineseBtn.textContent = isChineseBlurred ? '顯示中文' : '隱藏中文';
});


