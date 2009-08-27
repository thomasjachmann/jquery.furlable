(function($) {
  
  // configure the global furlable namespace
  $.furlable = {
    // the defaults
    defaults: {
      max:      20,     // maximum visible characters when furled
      duration: 500,    // duration (ms) for furling
      before:   null,   // leading wrapper of furled content
      after:    null,   // trailing wrapper of furled content
      hasMore:  '...',  // trailing text to display when furled (before trailing wrapper)
    },
    
    // the truncateHtml function used to truncate html
    truncateHtml: function(html, length) {
      return truncateNode($('<div/>').html(html), length).html();
    },
  };
  
  // private function to truncate any node
  function truncateNode(node, length) {
    return (node.nodeType == 3) ? truncateTextNode(node, length) : truncateOtherNode(node, length);
  }
  
  // private function to truncate plain text nodes
  function truncateTextNode(node, length) {
    var truncated = node.data.replace(/\s+/g, ' ').slice(0, length);
    return $('<div/>').text(truncated).html();
  }
  
  // private function to truncate non plain text nodes
  function truncateOtherNode(node, length) {
    node = $(node);
    var truncated = node.clone().empty();
    var remaining = length;
    node.contents().each(function() {
      if (remaining > 0) {
        var child = truncateNode(this, remaining);
        if (child)
          truncated.append(child);
        remaining = length - truncated.text().length;
      }
    });
    return truncated;
  }
  
  // the furlable function to initialize furlables
  $.fn.furlable = function(options) {
    var o = $.extend({}, $.furlable.defaults, options);
    
    this.each(function() {
      var $this = $(this);
      
      // determine parameters
      var lo = o.hasMore ? -$('<div/>').html(o.hasMore).text().length : 0;
      var hi = $this.text().length - o.max
      var cur = hi;
      var unfurled = $this.html();
      
      // setup furling
      var furl = function(to) {
        if (to != cur) {
          var furled = '';
          if (o.before)
            furled += o.before;
          if (to < 0) {
            furled += $.furlable.truncateHtml(unfurled, o.max);
            furled += $.furlable.truncateHtml(o.hasMore, -to);
          } else {
            furled += $.furlable.truncateHtml(unfurled, o.max + to);
          }
          if (o.after)
            furled += o.after;
          $this.html(furled);
        }
        cur = length;
      };
      furl(lo);
      var furled = true;
      
      // setup animation
      var furlimate = function(from, to) {
        $({furlableCount: from}).animate({furlableCount: to}, {
          duration: o.duration,
          step: function() {
            furl(Math.round(this.furlableCount));
          },
          complete: function() {
            furl(to); // make sure it's fully animated even on very short durations
          }
        });
      };
      $this.click(function() {
        furled ? furlimate(lo, hi) : furlimate(hi, lo);
        furled = !furled;
      });
    })
    
    return this;
  };
})(jQuery);
