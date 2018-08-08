(function(){
    'use strict';
    var header = document.getElementById('header3');
    var deg = 0;
    function rotateHeader() {
        deg = deg + 6;
        header.style.transform = 'rotateX(' + deg +  'deg)';
    }
    setInterval(rotateHeader, 20);
})();