class SimpleCarousel {
    #$carousel = null;
    #moving = false;
    #params = {}

    constructor(carouselIdentificator, params) {
        var defParams = {
            time: 700,
            scrollItems: 1,
            autoScroll: true,
            autoScrollTime: 3000,
        };

        this.#params = {...defParams, ...params};

        this.#$carousel = document.querySelector(carouselIdentificator);

        if (this.#$carousel === null) {

            return console.warn('There is no element ' + carouselIdentificator + '.');
        }

        this.#init();
    }

    #init = () => {

        this.#$carousel.classList.add('SimpleCarousel');

        this.SCUI = new SimpleCarouselUI({...this.#params, ...{$carousel: this.#$carousel}});

        this.$container = this.SCUI.getObjects().$container;

        this.slideWidth = this.SCUI.getObjects().slideWidth;

        this.#initHandlers();

        if (this.#params.autoScroll) {

            this.#setAutoScroll();
        }
    }

    #setAutoScroll = () => {

        this.autoScrollItl = setInterval(() => {

            if (this.SCUI.controlStatus()) {

                this.right();
            } else {

                this.#stopAutoScroll();
            }
        }, this.#params.autoScrollTime + this.#params.time);
    }

    #stopAutoScroll = () => {

        if (this.autoScrollItl) {

            clearInterval(this.autoScrollItl);
        }
    }

    #initHandlers = () => {

        this.SCUI.getObjects().$leftBtn.addEventListener('click', () => this.left());

        this.SCUI.getObjects().$rightBtn.addEventListener('click', () => this.right());

        window.addEventListener("resize", () => {

            this.SCUI.resizeCarousel();

            this.slideWidth = this.SCUI.getObjects().slideWidth;

            if (this.#params.autoScroll) {

                this.#stopAutoScroll();

                this.#setAutoScroll();
            }
        });
    }

    left = () => {
        this.#setRightSideIfNoLeftChildren().then(() => {

            var SCT = SimpleCarouselTools;

            var mleft = parseFloat(this.$container.style['margin-left']);

            this.$container.style['margin-left'] = mleft + this.slideWidth * this.#params.scrollItems + 'px';

            var children = SCT.getChildren(this.$container);

            for (var iChild = 0; iChild < children.length; iChild++) {

                var $child = children[iChild];

                if ($child.classList.contains('active')) {

                    this.#setActiveSlides(iChild - this.#params.scrollItems, iChild + this.SCUI.countOfViewSlides - this.#params.scrollItems);

                    break;
                }
            }
        });
    }

    #setRightSideIfNoLeftChildren = () => {

        return new Promise((res, rej) => {

            var SCT = SimpleCarouselTools;

            var leftChildren = this.#getLeftSlides();
            if (leftChildren.length < this.#params.scrollItems) {

                this.SCUI.transitionOff();

                setTimeout(() => {

                    var rightShift = this.SCUI.getObjects().originalChildren.length - leftChildren.length;

                    this.$container.style['margin-left'] = (this.#getSizeOfItems(this.$container.children) - rightShift * this.slideWidth) * -1 + 'px';

                    var children = SCT.getChildren(this.$container);

                    var begin = children.length - rightShift;

                    this.#setActiveSlides(begin, begin + this.SCUI.countOfViewSlides);

                    setTimeout(() => {

                        this.SCUI.transitionOn();

                        return res();
                    }, 20);
                }, 20);
            } else {

                return res();
            }
        });
    }


    #setLeftSideIfNoRightChildren = () => {

        return new Promise((res, rej) => {

            var SCT = SimpleCarouselTools;

            var rightChildren = this.#getRightSlides();

            if (rightChildren.length < this.#params.scrollItems) {

                this.SCUI.transitionOff();

                setTimeout(() => {

                    var leftShift = this.SCUI.getObjects().originalChildren.length - rightChildren.length - this.SCUI.countOfViewSlides;

                    console.log(leftShift);

                    this.$container.style['margin-left'] = (leftShift * this.slideWidth) * -1 + 'px';

                    var begin = leftShift;

                    this.#setActiveSlides(begin, begin + this.SCUI.countOfViewSlides);

                    setTimeout(() => {

                        this.SCUI.transitionOn();

                        return res();
                    }, 20);
                }, 20);
            } else {

                return res();
            }
        });
    }

    #setActiveSlides = (fromI, toI) => {

        var SCT = SimpleCarouselTools;

        var children = SCT.getChildren(this.$container);
        for (var iChild in children) {

            if (iChild >= fromI && iChild < toI) {

                children[iChild].classList.add('active');
            } else {

                children[iChild].classList.remove('active');
            }
        }
    }

    #getLeftSlides = () => {

        var slides = this.$container.children;

        var leftSlides = [];
        if (this.$container.querySelector('.active')) {

            for (var iSlide in slides) {

                var $slide = slides[iSlide];

                if ($slide.classList.contains('active')) {

                    break;
                }

                leftSlides.push($slide);
            }
        }

        return leftSlides;
    }

    #getRightSlides = () => {

        var SCT = SimpleCarouselTools;

        var slides = SCT.getChildren(this.$container).reverse();

        var rightSlides = [];
        if (this.$container.querySelector('.active')) {

            for (var iSlide in slides) {

                var $slide = slides[iSlide];

                if ($slide.classList.contains('active')) {

                    break;
                }

                rightSlides.push($slide);
            }
        }

        return rightSlides.reverse();
    }

    right = () => {
        this.#setLeftSideIfNoRightChildren().then(() => {

            var SCT = SimpleCarouselTools;

            var mleft = parseFloat(this.$container.style['margin-left']);

            this.$container.style['margin-left'] = mleft - this.slideWidth * this.#params.scrollItems + 'px';

            var children = SCT.getChildren(this.$container);

            for (var iChild = 0; iChild < children.length; iChild++) {

                var $child = children[iChild];

                if ($child.classList.contains('active')) {

                    var begin = iChild + this.#params.scrollItems;

                    this.#setActiveSlides(begin, begin + this.SCUI.countOfViewSlides);

                    break;
                }
            }
        });
    }

    #getSizeOfItems = (list) => this.slideWidth * list.length
}
SimpleCarouselTools = {
    setStyles: function ($el, styles) {
        for (style in styles) {

            $el.style[style] = styles[style];
        }
    },

    addElement: function ($parent, type, params) {

        var $el = document.createElement(type);

        if (params.classes) {

            params.classes.map(className => $el.classList.add(className));
        }

        $parent.appendChild($el);

        return $el;
    },

    getStyle: function ($el, strCssRule) {

        var strValue = "";

        if (document.defaultView && document.defaultView.getComputedStyle) {

            strValue = document.defaultView.getComputedStyle($el, "").getPropertyValue(strCssRule);
        } else if ($el.currentStyle) {

            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {

                return p1.toUpperCase();
            });

            strValue = $el.currentStyle[strCssRule];
        }

        return strValue;
    },

    computeFullElementWidht: function ($el) {
        var SCT = SimpleCarouselTools;

        return parseInt(SCT.getStyle($el, 'width')) + parseInt(SCT.getStyle($el, 'margin-left')) + parseInt(SCT.getStyle($el, 'margin-right'))
            + parseInt(SCT.getStyle($el, 'border-left-width')) + parseInt(SCT.getStyle($el, 'border-right-width'))
            + parseInt(SCT.getStyle($el, 'padding-left')) + parseInt(SCT.getStyle($el, 'padding-right'));
    },

    computeFullInnerElementWidth: function ($el) {
        var SCT = SimpleCarouselTools;

        return parseInt(SCT.getStyle($el, 'width')) - parseInt(SCT.getStyle($el, 'padding-left')) - parseInt(SCT.getStyle($el, 'padding-right'));
    },

    getChildren: function ($el) {
        return Array.prototype.slice.call($el.children);
    },

    intervalFromStart: function (cb, time) {

        cb();

        return setInterval(cb, time);
    },

    setClassAndReturnEl: function($el, className) {
        $el.classList.add(className);

        return $el;
    }
}
class SimpleCarouselUI {
    constructor(params) {

        this.$carousel = params.$carousel;

        this.params = params;

        this.#initUI();

        return this;
    }

    getObjects = () => {

        var SCT = SimpleCarouselTools;

        return {
            $container: this.$container,
            $leftBtn: this.$leftBtn,
            $rightBtn: this.$rightBtn,
            originalChildren: this.originalChildren,
            countOfViewSlides: this.countOfViewSlides,
            slideWidth: parseInt(SCT.computeFullElementWidht(this.$container.children[0])),
        }
    };

    #initUI = () => {

        this.#initUIContainer();

        this.#initUIConrol();

        this.resizeCarousel();
    }

    resizeCarousel = () => {

        var SCT = SimpleCarouselTools;

        this.transitionOff();

        this.childWidth = SCT.computeFullElementWidht(this.$container.children[0]);

        this.$carousel.style.width = '100%';

        var carWidth = SCT.computeFullInnerElementWidth(this.$carousel);

        this.countOfViewSlides = Math.floor(carWidth / this.childWidth);

        if (this.countOfViewSlides >= this.$container.children.length) {

            this.$carousel.style.width = this.childWidth * this.$container.children.length + 'px';

            this.#hideControl();
        } else {

            this.$carousel.style.width = carWidth - (carWidth % this.childWidth) + 'px';

            var children = SCT.getChildren(this.$container);

            if (this.$container.querySelector('.clone') === null) {

                children.map(($child) => this.$container.appendChild(SCT.setClassAndReturnEl($child.cloneNode(true), 'clone')));

                children.reverse().map(($child) => this.$container.prepend(SCT.setClassAndReturnEl($child.cloneNode(true), 'clone')));
            }

            if (this.$container.querySelector('.active') === null) {

                for (var iChild = 0; iChild < this.countOfViewSlides; iChild++) {

                    this.originalChildren[iChild].classList.add('active');
                }

            } else {

                var children = SCT.getChildren(this.$container);

                var first = false, last = 0;
                for (var iChild in children) {

                    var $child = children[iChild];

                    if ($child.classList.contains('active') && first === false) {

                        first = true;
                        last = parseInt(iChild) + this.countOfViewSlides - 1;

                        continue;
                    }

                    $child.classList.remove('active');

                    if (first !== false && last >= iChild) {

                        $child.classList.add('active');
                    }
                }

            }

            var children = SCT.getChildren(this.$container);

            var leftChildrenCount = 0;
            for (var iChild in children) {

                if (children[iChild].classList.contains('active')) {
                    break;
                }

                leftChildrenCount++;
            }

            this.$container.style['margin-left'] = this.$container.style['margin-left'] - this.childWidth * leftChildrenCount + 'px';

            this.#showControl();
        }

        setTimeout(() => {
            this.transitionOn();
        }, 1);
    }

    #initUIContainer = () => {

        var SCT = SimpleCarouselTools;

        if (!this.$carousel.querySelector('.SimpleCarousel-container')) {
            this.$carousel.innerHTML = '<div class="SimpleCarousel-container">' + this.$carousel.innerHTML + '</div>';

            this.$container = this.$carousel.querySelector('.SimpleCarousel-container')
        }

        this.originalChildren = SCT.getChildren(this.$container);
    }

    #initUIConrol = () => {

        this.$controls = SimpleCarouselTools.addElement(this.$carousel, 'div', {classes: ['SimpleCarousel-controls']});

        this.$leftBtnContainer = SimpleCarouselTools.addElement(this.$controls, 'div', {classes: ['SimpleCarousel-leftBtnContainer', 'SimpleCarousel-btnContainer']});
        this.$rightBtnContainer = SimpleCarouselTools.addElement(this.$controls, 'div', {classes: ['SimpleCarousel-rightBtnContainer', 'SimpleCarousel-btnContainer']});

        this.$leftBtn = SimpleCarouselTools.addElement(this.$leftBtnContainer, 'i', {classes: ['SimpleCarousel-arrow', 'SimpleCarousel-left']});
        this.$rightBtn = SimpleCarouselTools.addElement(this.$rightBtnContainer, 'i', {classes: ['SimpleCarousel-arrow', 'SimpleCarousel-right']});
    }

    #hideControl = () => this.$controls.style.display = 'none';

    #showControl = () => this.$controls.style.display = 'block';

    controlStatus = () => this.$controls.style.display == 'block' ? true : false;

    transitionOn = () => this.$container.style.transition = 'all ' + this.params.time / 1000 + 's ease 0s'

    transitionOff = () => this.$container.style.transition = 'none'
}