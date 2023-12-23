var counter = 1;
var slider = document.querySelector('.slider');

setInterval(function() {
  // Calculate the scroll position for the next image
  var scrollPos = slider.clientWidth * (counter - 1);

  // Smoothly scroll to the next image
  slider.scrollTo({
    left: scrollPos,
    behavior: 'smooth'
  });

  counter++;

  if (counter > 5) {
    counter = 1;
  }
}, 3000);
