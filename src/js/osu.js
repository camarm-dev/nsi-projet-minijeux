//constante

const monScore = document.getElementById('monScore');
const boxBalle = document.getElementById('boxBalle');
var Score = monScore;
var cursor = document.getElementById("cursor");




//curseur
document.body.addEventListener("mousemove", function(e) {
    cursor.style.left = e.clientX + "px",
      cursor.style.top = e.clientY + "px";
  });


function sunbeams() {
    $.each($(".particletext.sunbeams"), function(){
    var linecount = ($(this).width()/50)*10;
    for(var i = 0; i <= linecount; i++) {
        $(this).append('<span class="particle" style="top:' + $.rnd(-50,0) + '%; left:' + $.rnd(0,100) + '%;width:' + $.rnd(1,3) + 'px; height:' + $.rnd(80,160) + '%;animation-delay: -' + ($.rnd(0,30)/10) + 's;"></span>');
       }
    });
 }


jQuery.rnd = function(m,n) {
    m = parseInt(m);
    n = parseInt(n);
    return Math.floor( Math.random() * (n - m + 1) ) + m;
}

//Score
boxBalle.addEventListener('click', () => {
Score = Score+1 ;
});






sunbeams();