$(document).ready(function() {
  $('.digression').furlable({
    wrapperBefore: '&lt;digression&gt;',
    wrapperAfter: '&lt;/digression&gt;'
  });
  $('.expansion').furlable({
    wrapperBefore: '&lt;expansion&gt;',
    wrapperAfter: '&lt;/expansion&gt;',
    htmlDuration: 2000,
    moreText: 'more...',
    lessText: 'less...',
  });
});