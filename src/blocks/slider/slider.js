import 'jquery';
import 'ion-rangeslider';
import 'ion-rangeslider/css/ion.rangeSlider.css';
import './skins/toxin.scss';

import './slider.scss';

var $range = $('.slider__range'),
  $value = $('.slider__values'),
  instance,
  min = 0,
  max = 15700;

$range.ionRangeSlider({
  skin: 'big',
  hide_min_max: true,
  hide_from_to: true,
  type: 'double',
  min: min,
  max: max,
  from: 5000,
  to: 10000,
  onStart: updateInputs,
  onChange: updateInputs,
});

instance = $range.data('ionRangeSlider');

function formatNumber(val) {
  return val.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
}

function updateInputs(data) {
  $value.val(`${formatNumber(data.from)}₽ - ${formatNumber(data.to)}₽`);
}
