document.getElementById('hamb').addEventListener('click', function() {
    this.classList.toggle('active');
    const menu = document.getElementById('menu');
    menu.classList.toggle('active'); 
  });  

  document.querySelectorAll('#menu a').forEach(item => {
    item.addEventListener('click', () => {
      document.getElementById('hamb').classList.remove('active');
      document.getElementById('menu').classList.remove('active');
    });
  });
  