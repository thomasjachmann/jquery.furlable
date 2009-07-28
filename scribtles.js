(function($) {
  $.fn.animateText = function(options, callback) {
    var defaults = {
      duration: 500
    };
    var options = $.extend(defaults, options)
    
    var $this = $(this);
    if (options.html == undefined) {
      var html = '';
      var text = this.text();
      var from = text.length;
      var to = 0;
    } else {
      var html = options.html;
      var text = $('<div>' + html + '</div>').text();
      var from = 0;
      var to = text.length;
    }
    jQuery({animateTextCount: from}).animate({animateTextCount: to}, {
      duration: options.duration,
      step: function() {
        $this.text(text.substring(0, Math.round(this.animateTextCount)));
      },
      complete: function() {
        $this.html(html);
        if (callback)
          callback.call();
      }
    });
    return this;
  }
  $.fn.shorten = function(options) {
    var defaults = {
      slicePoint: 20,
      hasMore: '...',
      wrapperBefore: null,
      wrapperAfter: null,
      hasMoreDuration: 100,
      htmlDuration: 500
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
      html += '<span class="expanded">' + options.hasMore + '</span>';
      html += options.wrapperAfter;
      $this.html(html);
    
      $this.data('expanded', false);
    
      $this.click(function() {
        var expanded = $(this).data('expanded');
        var span = $this.find('span.expanded');
        if (expanded) {
          span.animateText({duration: options.htmlDuration}, function() { span.animateText({html: options.hasMore, duration: options.hasMoreDuration}); });
        } else {
          span.animateText({duration: options.hasMoreDuration}, function() { span.animateText({html: endText, duration: options.htmlDuration}) });
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