// 页面加载完成后执行其他功能
document.addEventListener('DOMContentLoaded', function() {
    
    // 横向滚动图片区域功能实现
    function initScrollImages() {
        const scrollContainer = document.querySelector('.scroll-images-wrapper');
        const container = document.querySelector('.scroll-images-container');
        if (!scrollContainer || !container) return;
        
        const scrollItems = document.querySelectorAll('.scroll-image-item');
        if (scrollItems.length === 0) return;
        
        // 容器设置
        scrollContainer.style.display = 'flex';
        scrollContainer.style.gap = '20px';
        scrollContainer.style.padding = '10px 0';
        
        // 容器设置
        container.style.width = '1200px';
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        
        // 复制原始项目以确保有足够的内容滚动
        const originalItems = Array.from(scrollItems);
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            scrollContainer.appendChild(clone);
        });
        
        // 重新获取所有项目（包括克隆的）
        let items = Array.from(document.querySelectorAll('.scroll-image-item'));
        
        // 动画变量
        let animationId = null;
        let isScrolling = true;
        let scrollPosition = 0;
        const scrollSpeed = 1; // 滚动速度
        
        // 滚动函数
        function scroll() {
            if (!isScrolling) return;
            
            // 更新滚动位置
            scrollPosition += scrollSpeed;
            
            // 计算第一个可见项的位置
            const firstItemWidth = items[0].offsetWidth + 20; // 宽度+间距
            
            // 当第一个项目完全滚出视图时，重置位置并调整DOM
            if (scrollPosition >= firstItemWidth) {
                // 将第一个项目移动到末尾
                const firstItem = items[0];
                scrollContainer.appendChild(firstItem);
                
                // 更新项目数组
                items.push(firstItem);
                items.shift();
                
                // 重置滚动位置
                scrollPosition = 0;
            }
            
            // 应用滚动效果
            scrollContainer.style.transform = `translateX(-${scrollPosition}px)`;
            
            // 继续动画
            animationId = requestAnimationFrame(scroll);
        }
        
        // 启动滚动
        function startScrolling() {
            if (isScrolling) return;
            isScrolling = true;
            animationId = requestAnimationFrame(scroll);
        }
        
        // 停止滚动
        function stopScrolling() {
            isScrolling = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
        
        // 事件监听
        container.addEventListener('mouseenter', stopScrolling);
        container.addEventListener('mouseleave', startScrolling);
        
        // 窗口大小变化时重新计算
        window.addEventListener('resize', () => {
            // 重置滚动位置
            scrollPosition = 0;
            scrollContainer.style.transform = 'translateX(0)';
        });
        
        // 开始滚动
        animationId = requestAnimationFrame(scroll);
    }
    
    // 轮播图功能实现
    function initCarousel() {
        // 轮播图自动切换
        const carouselSlider = document.querySelector('.carousel-slider');
        const carouselItems = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('.indicator');
        const prevButton = document.getElementById('prevSlide');
        const nextButton = document.getElementById('nextSlide');
        let currentIndex = 0;
        const itemWidth = 100 / 3; // 因为有3个轮播项，每个占1/3宽度
        
        // 设置初始位置
        carouselSlider.style.transform = `translateX(0)`;
        
        // 切换到指定索引的轮播图
        function goToSlide(index) {
            if (index < 0) index = 0;
            if (index >= carouselItems.length - 2) index = carouselItems.length - 2; // 留出缓冲
            
            currentIndex = index;
            const translateX = -index * itemWidth;
            carouselSlider.style.transform = `translateX(${translateX}%)`;
            
            // 更新指示器状态
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        // 下一张轮播图
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        // 上一张轮播图
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        // 自动轮播
        let carouselInterval = setInterval(nextSlide, 3000);
        
        // 鼠标悬停时暂停轮播
        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        // 鼠标离开时恢复轮播
        carouselContainer.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 3000);
        });
        
        // 绑定按钮事件
        if (prevButton) prevButton.addEventListener('click', prevSlide);
        if (nextButton) nextButton.addEventListener('click', nextSlide);
        
        // 绑定指示器点击事件
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
        });
    }
    
    // 视频切换功能实现
    function initVideoSwitcher() {
        const mainVideo = document.getElementById('mainVideo');
        const videoThumbnails = document.querySelectorAll('.video-thumbnail');
        
        // 禁用主视频的画中画功能
        if (mainVideo) {
            mainVideo.disablePictureInPicture = true;
        }
        
        if (mainVideo && videoThumbnails.length > 0) {
            // 处理每个视频缩略图
            videoThumbnails.forEach((thumbnail, index) => {
                // 获取视频路径
                const videoSrc = thumbnail.getAttribute('data-video');
                
                // 设置视频为缩略图源
                thumbnail.src = videoSrc;
                thumbnail.muted = true; // 静音加载
                thumbnail.autoplay = false;
                thumbnail.loop = false;
                thumbnail.disablePictureInPicture = true; // 禁用画中画功能
                
                // 设置缩略图样式
                thumbnail.style.width = '100%';
                thumbnail.style.height = '100%';
                thumbnail.style.objectFit = 'cover';
                thumbnail.style.cursor = 'pointer';
                thumbnail.style.transition = 'border 0.3s ease';
                thumbnail.style.boxSizing = 'border-box';
                thumbnail.style.display = 'block'; // 确保视频元素可见
                
                // 监听视频加载元数据事件，设置到第一帧
                thumbnail.addEventListener('loadedmetadata', () => {
                    thumbnail.currentTime = 0.1; // 设置到第一帧附近
                });
                
                // 监听视频可以播放事件，暂停在第一帧
                thumbnail.addEventListener('canplay', () => {
                    thumbnail.pause();
                });
                
                // 为视频缩略图添加点击事件
                thumbnail.addEventListener('click', () => {
                    // 更新所有视频缩略图的样式
                    videoThumbnails.forEach(t => {
                        t.classList.remove('active');
                        t.style.border = 'none';
                    });
                    // 高亮当前选中的视频
                    thumbnail.classList.add('active');
                    thumbnail.style.border = '2px solid #4CAF50';
                    
                    // 设置主视频源
                    if (videoSrc) {
                        mainVideo.src = videoSrc;
                        mainVideo.load();
                        mainVideo.muted = true;
                        mainVideo.play().catch(error => {
                            console.log('视频自动播放失败:', error);
                        });
                    }
                });
                
                // 加载视频以显示第一帧
                thumbnail.load();
            });
            
            // 标记第一个视频为active
            if (videoThumbnails.length > 0) {
                videoThumbnails[0].classList.add('active');
                videoThumbnails[0].style.border = '2px solid #4CAF50';
            }
            
            // 初始化第一个视频
            const firstVideoSrc = videoThumbnails[0].getAttribute('data-video');
            if (firstVideoSrc && mainVideo) {
                mainVideo.src = firstVideoSrc;
                mainVideo.load();
                mainVideo.muted = true;
                mainVideo.play().catch(error => {
                    console.log('视频自动播放失败:', error);
                });
            }
        }
    }
    
    // 初始化各功能模块
    if (document.querySelector('.scroll-images-wrapper')) {
        initScrollImages();
    }
    
    if (document.querySelector('.carousel-slider')) {
        initCarousel();
    }
    
    initVideoSwitcher();
    
    // 监听左侧视频区域高度变化，动态设置右侧内容区域高度
    function syncLeftRightHeight() {
        // 直接监听视频容器元素，而不是整个左侧区域
        const videoContainer = document.querySelector('.video-container');
        const rightSection = document.querySelector('.right-section');
        
        if (videoContainer && rightSection) {
            // 设置右侧区域的高度等于视频容器的高度
            const containerHeight = videoContainer.offsetHeight;
            rightSection.style.height = containerHeight + 'px';
            rightSection.style.overflowY = 'auto';
            rightSection.style.paddingRight = '10px'; // 为滚动条留出空间
            rightSection.style.boxSizing = 'border-box';
        }
    }
    
    // 初始化时同步高度
    syncLeftRightHeight();
    
    // 监听视频加载完成事件，确保视频尺寸确定后更新高度
    const mainVideo = document.getElementById('mainVideo');
    if (mainVideo) {
        // 监听视频元数据加载完成事件
        mainVideo.addEventListener('loadedmetadata', syncLeftRightHeight);
        // 监听视频尺寸变化事件
        mainVideo.addEventListener('resize', syncLeftRightHeight);
        // 监听视频播放状态变化
        mainVideo.addEventListener('playing', syncLeftRightHeight);
        // 监听视频源变化
        mainVideo.addEventListener('srcChange', syncLeftRightHeight);
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', syncLeftRightHeight);
    
    // 监听视频切换事件
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // 使用setTimeout确保视频已经开始切换并加载
            setTimeout(syncLeftRightHeight, 200);
            // 增加额外的延迟检查，确保视频完全加载后再次同步
            setTimeout(syncLeftRightHeight, 800);
        });
    });
    
    // 添加MutationObserver监听左侧区域的DOM变化，确保能捕获到动态变化
    const leftSection = document.querySelector('.left-section');
    if (leftSection) {
        const observer = new MutationObserver(() => {
            syncLeftRightHeight();
        });
        observer.observe(leftSection, {
            attributes: true,
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // 视频加载处理
    function handleVideoLoad() {
        // 设置视频源
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            if (!video.src && video.querySelector('source')) {
                video.load();
            }
            // 视频播放
            video.play().catch(error => {
                console.log('视频播放失败:', error);
            });
            // 设置视频为静音
            video.muted = true;
        });
    }
    
    handleVideoLoad();
});