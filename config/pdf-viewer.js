// PDF查看器功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的PDF路径和标题
    function getUrlParams() {
        const params = {};
        const queryString = window.location.search;
        const searchParams = new URLSearchParams(queryString);

        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }

        return params;
    }

    // 初始化PDF查看器
    function initPdfViewer() {
        const params = getUrlParams();
        const pdfFrame = document.getElementById('pdfFrame');
        const directoryList = document.getElementById('directoryList');

        // 判断是否是标志性成果
        const isAchievement = params.file && params.file.includes('标志性成果首页');

        // 生成目录
        if (isAchievement) {
            // 生成标志性成果目录（静态写死）
            const achievementItems = [
                { title: '1.入选《习近平新时代中国特色社会主义思想学生读本》', file: './Asset/标志性成果首页/1/1.pdf' },
                { title: '2.教育部职业教育"走出去"首批试点学校（全国最早）', file: './Asset/标志性成果首页/2/2.pdf' },
                { title: '3.教育部"教育这十年"专题收录', file: './Asset/标志性成果首页/3/3.pdf' },
                { title: '4.教育部"十三五"期间职教"最大的亮点"之一', file: './Asset/标志性成果首页/4/4.pdf' },
                { title: '5.教育部职业教育"走出去"扩大试点学校', file: './Asset/标志性成果首页/5/5.pdf' },
                { title: '6.入选《2018中国高等职业教育质量年度报告》', file: './Asset/标志性成果首页/6/6.pdf' },
                { title: '7.入选广东省《推进共建"一带一路"教育行动计划》', file: './Asset/标志性成果首页/7/7.pdf' },
                { title: '8.赞比亚学生在世界职业院校技能大赛总决赛获奖', file: './Asset/标志性成果首页/8/8.pdf' },
                { title: '9.国家专业资源库子项目："一带一路"职教之窗', file: './Asset/标志性成果首页/9/9.pdf' },
                { title: '10.教育部"汉语桥"课程：建筑汉语——走进岭南建筑', file: './Asset/标志性成果首页/10/10.pdf' }
            ];

            achievementItems.forEach((item, index) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `./pdf_viewer.html?title=标志性成果${index + 1}&file=${item.file}`;
                a.textContent = item.title;
                
                // 阻止默认事件
                a.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('链接点击被阻止:', item.title);
                    // 可以在这里添加自定义的处理逻辑，比如更新PDF显示
                    updatePdfDisplay(item.file, item.title);
                });
                
                li.appendChild(a);
                directoryList.appendChild(li);
            });


        } else {
            // 生成默认目录
            const defaultItems = [
                { title: '推荐书', file: './Asset/1推荐书.pdf' },
                { title: '成果总结报告', file: './Asset/2成果总结报告.pdf' },
                { title: '必要佐证材料', file: './Asset/4必要佐证材料.pdf' },
                { title: '其他支撑材料', file: './Asset/3其他支撑材料.pdf' }
            ];

            defaultItems.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `./pdf_viewer.html?title=${encodeURIComponent(item.title)}&file=${encodeURIComponent(item.file)}`;
                a.textContent = item.title;
                
                // 阻止默认事件
                a.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('链接点击被阻止:', item.title);
                    // 可以在这里添加自定义的处理逻辑，比如更新PDF显示
                    updatePdfDisplay(item.file, item.title);
                });
                
                li.appendChild(a);
                directoryList.appendChild(li);
            });
        }

        // 设置PDF文件路径
        if (params.file) {
            pdfFrame.src = decodeURIComponent(params.file);
        } else {
            // 默认显示第一个PDF
            pdfFrame.src = './Asset/四个pdf都先用这个展示，要求是pdf目录可以看到.pdf';
        }

        // 设置页面标题
        if (params.title) {
            document.title = decodeURIComponent(params.title) + ' - 2025年广东省教学成果奖网站';
        }

        // 高亮当前选中的目录项
        highlightActiveDirectoryItem(params.title);
    }

    // 更新PDF显示
    function updatePdfDisplay(pdfFile, title) {
        const pdfFrame = document.getElementById('pdfFrame');
        
        // 更新PDF源
        pdfFrame.src = pdfFile;
        
        // 更新页面标题
        document.title = title + ' - 2025年广东省教学成果奖网站';
        
        // 更新URL而不刷新页面
        const newUrl = `./pdf_viewer.html?title=${encodeURIComponent(title)}&file=${encodeURIComponent(pdfFile)}`;
        window.history.pushState({ title, file: pdfFile }, title, newUrl);
        
        // 高亮当前选中的目录项
        highlightActiveDirectoryItem(title);
        
        console.log('PDF已更新为:', pdfFile);
    }

    // 高亮当前选中的目录项
    function highlightActiveDirectoryItem(title) {
        const directoryLinks = document.querySelectorAll('.directory-list li a');

        directoryLinks.forEach(link => {
            link.classList.remove('active');
            // 匹配链接文本或处理带数字前缀的情况
            const linkText = link.textContent.trim();
            if (linkText === title || linkText.includes(title.replace(/标志性成果\d+/, '').trim())) {
                link.classList.add('active');
            }
        });
    }

    // 处理浏览器前进后退按钮
    window.addEventListener('popstate', function(event) {
        if (event.state) {
            const pdfFrame = document.getElementById('pdfFrame');
            pdfFrame.src = event.state.file;
            document.title = event.state.title + ' - 2025年广东省教学成果奖网站';
            highlightActiveDirectoryItem(event.state.title);
        }
    });

    // 为整个目录列表添加事件委托，阻止所有链接的默认行为
    document.addEventListener('click', function(e) {
        // 检查点击的是否是目录列表中的链接
        if (e.target.tagName === 'A' && e.target.closest('.directory-list')) {
            e.preventDefault();
            console.log('通过事件委托阻止了链接默认行为:', e.target.textContent);
        }
    });

    // 页面加载完成后初始化
    initPdfViewer();
});