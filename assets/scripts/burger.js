document.getElementById('hamb').addEventListener('click', function() {
    this.classList.toggle('active');
    const menu = document.getElementById('menu');
    menu.classList.toggle('active'); 
  });  