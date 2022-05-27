$(function () {

    Popup.init('.js-open-popup');

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var player;

    function createPlayer(url, elemId) {
        if (document.querySelector('iframe#elemId')) {
            player.loadVideoById({
                videoId: url
            })
            player.stopVideo()
        } else {
            player = new YT.Player(elemId, {
                height: '100%',
                width: '100%',
                videoId: url,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
        console.log(player);
    }

    function onPlayerReady(event) {
        event.target.stopVideo();
    }

    function onPlayerStateChange(event) {}

    function destroyPlayer() {
        try {
            player.stopVideo();
            player.destroy();
            player = null;
        } catch {}

    }

    $('body')
        .on('click', '.popup_visible', function (event) {
            var elem = event.target
            if (elem.classList.contains('popup') || elem.classList.contains('js-popup-close')) {
                setTimeout(function() {
                    destroyPlayer()
                }, 100) 
                $('.video__player--bckgrnd').fadeIn()
                $('.js-popup-slider').slick('unslick')
            }
        })
        .on('click', '.cooks__card', function() {
            var _this = $(this)
            var _currentIdx = _this.data('current-slide')

            $('.video__player--bckgrnd').each(function(_idx, _elem) {
                var _url = _elem.dataset.url
                if (_url !== '') {
                    _elem.remove()
                }
            })

            $('.js-popup-slider').not('.slick-initialized').slick({
                initialSlide: -1,
                dots: false,
                arrows: true,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 600,
                fade: true,
                cssEase: 'linear',
                adaptiveHeight: true,
                responsive: [{
                    breakpoint: 650,
                    settings: {
                        dots: true,
                        arrows: false,
                        adaptiveHeight: true,
                    }
                }]
            })
    
            setTimeout(function () {
                $('.js-popup-slider').slick('slickGoTo', _currentIdx, true);
            }, 0)
    
            $('.js-popup-slider .slick-dots li').each(function (idx, elem) {
                var _color = $('.js-popup-slider .popup__inner')[idx].dataset.group
                elem.classList.add(_color)
            })

            Popup.open('#video-popup')
        })
        .on('afterChange', '.js-popup-slider',function(event, slick, currentSlide, nextSlide){
            destroyPlayer()
            var _elem = $('#video__player--' + currentSlide)
            var _url = _elem.data('url')
            var _elemId = _elem[0]
            if (_url !== '') {
                createPlayer(_url, _elemId)
            }
        })
        .on('mouseenter', '.slick-track.animated', function() {
            $(this).removeClass('animated')
        }) 

    // ===== anchor

    var anchors = document.querySelectorAll('.header__link')
    anchors.forEach(function (elem, idx) {
        elem.addEventListener('click', function (e) {
            e.preventDefault()
            var blockID = elem.getAttribute('href').substr(1)
            document.getElementById(blockID).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })

        })
    })

    // ===== slider
   
    var desktopSlickOption = {
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        speed: 600,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 60000,
        responsive: [{
            breakpoint: 650,
            settings: {
                arrows: false,
                dots: true
            }
        }]
    }

    var mobileSlickOption = {
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 600,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 60000
    }

    if (window.innerWidth > 650) {
        $('.js-cooks-slider').on('init reInit', function(event, slick){
            $('.cooks__block .slick-track').addClass('animated')
        });
        $('.js-assortment-slider').slick({...desktopSlickOption, asNavFor: '.js-header-slider'})
    }

    if (window.innerWidth < 650) {
        $('.js-mobile-slider').slick(mobileSlickOption)
    }

    $('.js-header-slider').slick({...desktopSlickOption, 
        asNavFor: '.js-assortment-slider', 
        responsive: [
            {
              breakpoint: 650,
              settings: {
                asNavFor: null, 
              }
            }]
    })

    $('.js-cooks-slider').slick({
        dots: false,
        arrows: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        variableWidth: true,
        responsive: [{
                breakpoint: 650,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: true,
                }
            },
            {
                breakpoint: 450,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                }
            },
        ]
    })

    //  ===== resize

    function closeMenu(elem) {
        elem.removeClass('open')
    }

    function openMenu(elem) {
        elem.addClass('open')
    }

    $('body').on('click', '.header__burger', function () {
        var _this = $(this)
        var _mobMenu = $('.header__right')

        if (_this.hasClass('open')) {
            closeMenu(_this)
            closeMenu(_mobMenu)
        } else {
            openMenu(_this)
            openMenu(_mobMenu)
        }
    })

    $('body').on('click', '.header__right', function (event) {
        event.stopPropagation();
        var elem = event.target
        var _burger = $('.header__burger')
        var _mobMenu = $('.header__right')
        if (elem.classList.contains('header__right') || elem.classList.contains('header__link') || $(elem).parents('.header__link').length) {
            closeMenu(_mobMenu)
            closeMenu(_burger)
        }
    })

    $(window).on('resize', function (event) {
        if (window.innerWidth > 650) {
            if ($('.js-mobile-slider').hasClass('slick-slider')) {
                $('.js-mobile-slider').slick('unslick')
                $('.js-header-slider').slick('unslick')
                $('.js-assortment-slider').not('.slick-initialized').slick({...desktopSlickOption, asNavFor: '.js-header-slider'})
            }

            var _burger = $('.header__burger')
            var _mobMenu = $('.header__right')
            if (_burger.hasClass('open')) {
                closeMenu(_mobMenu)
                closeMenu(_burger)
            }

        } else {
            if ($('.js-assortment-slider').hasClass('slick-slider')) {
                $('.js-assortment-slider').slick('unslick')
                $('.js-mobile-slider').not('.slick-initialized').slick(mobileSlickOption)
            }
        }
    })

    setTimeout(function () {
        $('body').addClass('visible')

    }, 250)
})