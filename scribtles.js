(function($) {
  $.fn.shorten = function(options) {
    var defaults = {
      slicePoint: 20,
      hasMore: '...',
      wrapperBefore: null,
      wrapperAfter: null,
      fadeDuration: 250
    };
    var options = $.extend(defaults, options);
    
    this.each(function() {
      var $this = $(this);
    
      var allText = $this.html();
      var startText = allText.slice(0, options.slicePoint).replace(/\w+$/,'');
      startTags = startText.match(/<\w[^>]*>/g);
      if (startTags) {
        startText = allText.slice(0, options.slicePoint + startTags.join('').length).replace(/\w+$/,'');
      }
      if (startText.lastIndexOf('<') > startText.lastIndexOf('>') ) {
        startText = startText.slice(0, startText.lastIndexOf('<'));
      }
      var endText = allText.slice(startText.length);
    
      var html = '';
      html += options.wrapperBefore;
      html += startText;
      html += '<span class="expander">' + options.hasMore + '</span>';
      html += '<span class="expanded" style="display: none;">' + endText + '</span>';
      html += options.wrapperAfter;
      $this.html(html);
    
      $this.data('expanded', false);
    
      $this.click(function() {
        var expanded = $(this).data('expanded');
        if (expanded) {
          $this.find('span.expanded').fadeOut(options.fadeDuration, function() {
            $this.find('span.expander').show();
          });
        } else {
          $this.find('span.expander').hide().next('span.expanded').fadeIn(options.fadeDuration);
        }
        $(this).data('expanded', !expanded);
      });
    })
  };
})(jQuery);

$(document).ready(function() {
  $('.digression').shorten({
    wrapperBefore: '&lt;digression&gt;',
    wrapperAfter: '&lt;/digression&gt;'
  });
  $('.expansion').shorten({
    wrapperBefore: '&lt;expansion&gt;',
    wrapperAfter: '&lt;/expansion&gt;'
  });
});