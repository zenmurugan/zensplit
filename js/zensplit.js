/* ============================================================== 
 * zensplit.js v1.0.0
 * http://github.com/zenmurugan/zensplit
/* ============================================================== 
 * Copyright (c) 2013 Senthil Murugan 
 * Author: Senthil Murugan (http://github.com/zenmurugan
 * 
 * Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 * =========================================================== */
 
/** 
 * Parameters:
 *   type      => values: "vsplit" or "hsplit"
 *   position  => value in %
 *                Position of the splitter between
 *   min_limit => value in %
                  Minimum width or height the container should have
 */
(function( $ ) {
  $.fn.zensplit = function(options) {
    var zs = $.extend({
        version     : "1.0.0",
        type        : "vsplit",
        position    : "50",
        cur_resize  : "col-resize",
        min_limit   : "10",
    },options || {});
    
    this.addClass("zensplitter_panel");
    var splitter = $('<div></div>');
    var zensplit = this;
    var position;
    var panel0 = zensplit.children().first();
    var panel1 = panel0.next(); 
    var moving = false;
    if(zs.type == "vsplit") {
        panel0.addClass("left_area");
        panel1.addClass("right_area");
        splitter.addClass("vsplitter");
    } else {
        panel0.addClass("top_area");
        panel1.addClass("bottom_area");        
        splitter.addClass("hsplitter");
    }
    splitter.append($("<div/>").addClass("zsthumb"));
    panel0.after(splitter);
    // initialize position of the splitter
    var self = $.extend(this,{
        init : (function() {
            if(zs.type == "vsplit") {
                this.position((zs.position) * 0.01 * zensplit.width());
                //panel0.width(((zs.position) * 0.01 * zensplit.width() - (splitter.width())));
                //panel1.width((((100 - zs.position)) * 0.01 * zensplit.width() - (splitter.width())));
                //position = panel0.width();
                //splitter.css("left",position);                
                // splitter.children().css("top",((splitter.height()/2)-(splitter.children().height()/2)));
                zs.cur_resize = "col-resize";
            } else {
                this.position((zs.position) * 0.01 * zensplit.height());
                // panel0.height(((zs.position) * 0.01 * zensplit.height() - (splitter.height())));
                // panel1.height((((100 - zs.position)) * 0.01 * zensplit.height() - (splitter.height())));
                // position = (panel0.height());
                // splitter.css("top",position);
                // splitter.children().css("left",((splitter.width()/2)-(splitter.children().width()/2)));
                zs.cur_resize = "row-resize";
                
            }
        }),
        position : (function(current_pos) {
            if(zs.type == "vsplit") {
                if (current_pos === undefined) {
                    current_position = panel0.width();
                }
                var splitter_width = (splitter.width()/2) + 1;
                position = (current_pos - splitter_width);
                if((position > (zensplit.width() * (zs.min_limit * 0.01))) && 
                   (position < (zensplit.width() * ((100 - zs.min_limit) * 0.01))) ){
                        splitter.css("left",position);
                        panel0.width(position);
                        panel1.width((self.width() - current_pos - splitter_width));
                        splitter.children().css("top",((splitter.height()/2)-(splitter.children().height()/2)));
                }
            } else {
                if (current_pos === undefined) {
                    current_position = panel0.height();
                }                
                var splitter_height = (splitter.height()/2) + 1;
                position = (current_pos - splitter_height);
                if((position > (zensplit.height() * (zs.min_limit * 0.01))) && 
                   (position < (zensplit.height() * ((100 - zs.min_limit) * 0.01))) ){
                        splitter.css("top",position);
                        panel0.height(position);
                        panel1.height((self.height() - current_pos -splitter_height));
                        splitter.children().css("left",((splitter.width()/2)-(splitter.children().width()/2)));
                }
            }
        }),
        mousemovement : (function(evt) {            
            if (!moving) {            
                return;
            }
            var pos;
            if(zs.type == "vsplit") {                
                pos = (panel0.width() - ((splitter.offset().left) - evt.pageX) );
            } else {
                pos = (panel0.height() - ((splitter.offset().top) - evt.pageY) );
            }
            self.position(pos);
            $("body").css("cursor",zs.cur_resize);
        }),
        mouserelease: (function(evt) {
            moving = false;
            $("body").css("cursor","auto");
            splitter.removeClass("zsdrag");
        }),
    });
    self.init();
    splitter.bind('mousedown mouseup', function(evt) {        
        if (evt.type == 'mousedown') {
            moving = true;
            $("body").css("cursor",zs.cur_resize);
            splitter.addClass("zsdrag");
            zensplit.addClass("unselectable");
            panel0.addClass("unselectable");
            panel1.addClass("unselectable");
        } else {
            moving = false;
            $("body").css("cursor","auto");
            zensplit.removeClass("unselectable");
            panel0.removeClass("unselectable");
            panel1.removeClass("unselectable");
            splitter.removeClass("zsdrag");
        }
    });
    
    splitter.bind('mouseup', self.mouserelease);
    zensplit.bind("mousemove",self.mousemovement);  
    $(document.documentElement).bind("mousemove",self.mousemovement);
    $(document.documentElement).bind("mouseup",self.mouserelease);
    
  };
}( jQuery ));
