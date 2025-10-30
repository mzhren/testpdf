// 项目成果点击跳转功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有成果项
    const achievementItems = document.querySelectorAll('.achievement-item');
    
    // 为每个成果项添加点击事件
    achievementItems.forEach(item => {
        item.addEventListener('click', function() {
            // 获取成果项的文本内容
            const achievementText = this.textContent.trim();
            
            // 获取data-pdf属性
            const pdfNumber = this.getAttribute('data-pdf');
            
            // 根据不同的成果项跳转到不同的PDF页面
            let pdfUrl = '';
            let title = '';
            
            // 处理标志性成果
            if (pdfNumber) {
                pdfUrl = `./Asset/标志性成果首页/${pdfNumber}/${pdfNumber}.pdf`;
                title = achievementText;
            } else if (achievementText.includes('推荐书')) {
                pdfUrl = './Asset/1推荐书.pdf';
                title = '推荐书';
            } else if (achievementText.includes('成果总结报告')) {
                pdfUrl = './Asset/2成果总结报告.pdf';
                title = '成果总结报告';
            } else if (achievementText.includes('必要佐证材料')) {
                pdfUrl = './Asset/4必要佐证材料.pdf';
                title = '必要佐证材料';
            } else if (achievementText.includes('其他支撑材料')) {
                pdfUrl = './Asset/3其他支撑材料.pdf';
                title = '其他支撑材料';
            }
            
            // 如果找到了对应的PDF，则跳转
            if (pdfUrl) {
                console.log('跳转到PDF:', pdfUrl);
                window.location.href = `./pdf_viewer.html?title=${encodeURIComponent(title)}&file=${encodeURIComponent(pdfUrl)}`;
            } else {
                console.log('未找到对应的PDF文件');
            }
        });
        
        // 添加鼠标悬停效果，确保元素是可点击的
        item.style.cursor = 'pointer';
    });
});