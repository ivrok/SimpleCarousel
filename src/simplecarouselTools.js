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