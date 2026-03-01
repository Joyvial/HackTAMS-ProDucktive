function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

document.addEventListener('DOMContentLoaded', function() {
  var firstTab = document.querySelector('.tablinks');
  if (firstTab) {
    firstTab.click();
  }

  // ducks movement initialization: run after DOM is ready so the
  // <img> elements exist and have width/height values
  const images = document.querySelectorAll('.ducks');
  images.forEach(img => {
    // if the image hasn't loaded yet, wait for it
    if (!img.complete) {
      img.addEventListener('load', () => setupDuck(img));
    } else {
      setupDuck(img);
    }
  });
});

function setupDuck(img) {
  // random starting position within viewport
  img.style.left = Math.random() * (window.innerWidth - img.width) + 'px';

  let direction = Math.random() < 0.5 ? -1 : 1;
  const speed = 0.2 + Math.random() * 0.5;

  if (img.dataset.altSrc) 
    {
    setInterval(() => 
        {
      const tmp = img.src;
      img.src = img.dataset.altSrc;
      img.dataset.altSrc = tmp;
    }, 1000); // change frame every 400ms
  }

  function move() {
    let currentLeft = parseFloat(img.style.left) || 0;
    currentLeft += speed * direction;
    if (currentLeft <= 0) direction = 1;
    if (currentLeft >= window.innerWidth - img.width) direction = -1;
    if (direction === 1) {
        img.classList.add('flipped');
    } else {
        img.classList.remove('flipped');
    }
    img.style.left = currentLeft + 'px';
    requestAnimationFrame(move);
  }

  move();
}
