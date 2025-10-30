// PDF查看器功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的PDF路径和标题
    function getUrlParams() {
        var params = {};
        var queryString = window.location.search;
        
        // 兼容老浏览器的URL参数解析方法
        if (queryString) {
            // 移除开头的问号
            queryString = queryString.substring(1);
            
            // 分割参数
            var pairs = queryString.split('&');
            
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                if (pair.length === 2) {
                    var key = decodeURIComponent(pair[0]);
                    var value = decodeURIComponent(pair[1]);
                    params[key] = value;
                }
            }
        }

        return params;
    }

    // 初始化PDF查看器
    function initPdfViewer() {
        var params = getUrlParams();
        var pdfFrame = document.getElementById('pdfFrame');
        var directoryList = document.getElementById('directoryList');

        // 判断是否是标志性成果
        var isAchievement = params.file && params.file.includes('标志性成果首页');

        // 生成目录
        if (isAchievement) {
            // 生成标志性成果目录（静态写死）
            var achievementItems = [
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

            // 使用传统for循环替代forEach
            for (var i = 0; i < achievementItems.length; i++) {
                var item = achievementItems[i];
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = './pdf_viewer.html?title=标志性成果' + (i + 1) + '&file=' + item.file;
                a.textContent = item.title;
                
                // 阻止默认事件（使用闭包保持变量）
                (function(currentItem) {
                    a.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log('链接点击被阻止:', currentItem.title);
                        // 可以在这里添加自定义的处理逻辑，比如更新PDF显示
                        updatePdfDisplay(currentItem.file, currentItem.title);
                    });
                })(item);
                
                li.appendChild(a);
                directoryList.appendChild(li);
            }


        } else {
            // 生成默认目录
            var defaultItems = [
                { title: '推荐书', file: './Asset/1推荐书.pdf' },
                { title: '成果总结报告', file: './Asset/2成果总结报告.pdf' },
                { title: '必要佐证材料', file: './Asset/4必要佐证材料.pdf' },
                { title: '其他支撑材料', file: './Asset/3其他支撑材料.pdf' }
            ];

            // 使用传统for循环替代forEach
            for (var j = 0; j < defaultItems.length; j++) {
                var item = defaultItems[j];
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = './pdf_viewer.html?title=' + encodeURIComponent(item.title) + '&file=' + encodeURIComponent(item.file);
                a.textContent = item.title;
                
                // 阻止默认事件（使用闭包保持变量）
                (function(currentItem) {
                    a.addEventListener('click', function(e) {
                        e.preventDefault();
                        console.log('链接点击被阻止:', currentItem.title);
                        // 可以在这里添加自定义的处理逻辑，比如更新PDF显示
                        updatePdfDisplay(currentItem.file, currentItem.title);
                    });
                })(item);
                
                li.appendChild(a);
                directoryList.appendChild(li);
            }
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
        var pdfFrame = document.getElementById('pdfFrame');
        
        // 更新PDF源
        pdfFrame.src = pdfFile;
        
        // 更新页面标题
        document.title = title + ' - 2025年广东省教学成果奖网站';
        
        // 更新URL而不刷新页面
        var newUrl = './pdf_viewer.html?title=' + encodeURIComponent(title) + '&file=' + encodeURIComponent(pdfFile);
        if (window.history && window.history.pushState) {
            window.history.pushState({ title: title, file: pdfFile }, title, newUrl);
        }
        
        // 高亮当前选中的目录项
        highlightActiveDirectoryItem(title);
        
        console.log('PDF已更新为:', pdfFile);
    }

    // 高亮当前选中的目录项
    function highlightActiveDirectoryItem(title) {
        var directoryLinks = document.querySelectorAll('.directory-list li a');

        // 使用传统for循环替代forEach
        for (var k = 0; k < directoryLinks.length; k++) {
            var link = directoryLinks[k];
            if (link.classList) {
                link.classList.remove('active');
            } else {
                // 兼容老浏览器的className处理
                link.className = link.className.replace(/\bactive\b/g, '').trim();
            }
            
            // 匹配链接文本或处理带数字前缀的情况
            var linkText = link.textContent ? link.textContent.trim() : link.innerText.trim();
            var cleanTitle = title.replace(/标志性成果\d+/, '').trim();
            
            if (linkText === title || linkText.indexOf(cleanTitle) !== -1) {
                if (link.classList) {
                    link.classList.add('active');
                } else {
                    // 兼容老浏览器的className处理
                    link.className += ' active';
                }
            }
        }
    }

    // 处理浏览器前进后退按钮
    window.addEventListener('popstate', function(event) {
        if (event.state) {
            var pdfFrame = document.getElementById('pdfFrame');
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