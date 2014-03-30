define(function(requre, exports, module) {

    function getAbsolutePosition(ele) {
        var position = { x : 0, y : 0 };

        for (var i = ele; i; i = i.offsetParent) {
            position.x += i.offsetLeft;
            position.y += i.offsetTop;
        }

        return position;
    }

    var Gallery = function() {
        var $this = this;
        var $node = (function(id) {
            var gallery = document.getElementById(id);
            return gallery;
        })('gallery');
        var $slides = $node.children[0];
        var $buttons = $node.children[1];

        this.buttons = [];
        this.slides = $slides.children;
        this.selectedIndex = 0;

        for (var i = 0; i < this.slides.length; i++) {
            var btn = document.createElement('LI');

            btn.index = i;
            btn.setAttribute('class', 'indicator');
            btn.addEventListener('click', function(event) {
                $this.gotoSlide(this.index);
            });
            $buttons.appendChild(btn);
            this.buttons.push(btn);

            this.slides[i].style.height = document.body.offsetHeight + 'px';
        }

        $buttons.style.marginTop = -($buttons.clientHeight / 2) + 'px';

        window.addEventListener('resize', function(event) {
            for (var i = 0; i < $this.slides.length; i++) {
                $this.slides[i].style.height = document.body.offsetHeight + 'px';
            }
        });
    };

    (function() {

        /**
         * Scroll to the specified slide
         * 
         * @param index
         *            The index of slide
         */
        this.gotoSlide = function(index) {
            if (index < 0 || index >= this.slides.length) {
                // index out of bounds
                return;
            }

            var btn = this.buttons[index];
            var slide = this.slides[index];

            this.buttons[this.selectedIndex].setAttribute('class', 'indicator');
            btn.setAttribute('class', 'indicator selected');
            document.body.scrollTop = getAbsolutePosition(slide).y;
            this.selectedIndex = index;
        };

    }).call(Gallery.prototype);

    module.exports = Gallery;

});
