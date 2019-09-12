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