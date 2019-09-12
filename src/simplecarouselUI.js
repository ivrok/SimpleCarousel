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