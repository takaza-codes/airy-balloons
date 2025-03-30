ymaps.ready(init);

function init() {
  const coords = [53.534700, 49.297674];
  const map = new ymaps.Map('map', {
    center: coords,
    zoom: 16,
    controls: ['zoomControl']
  });

  const placemark = new ymaps.Placemark(coords, {
    balloonContent: 'Проспект Степана Разина, 2'
  }, {
    iconLayout: 'default#image',
    iconImageHref: '../../assets/logos/location.svg', // ваш SVG‑файл
    iconImageSize: [62, 70],
    iconImageOffset: [-33, -40]
  });

  map.geoObjects.add(placemark);
}
