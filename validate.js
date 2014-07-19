/*
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {
    'use strict';
    $.fn.validate = function () {

        var idForm = $(this).attr('id');
        var form = $('#' + idForm);
        var first = false;
        var idInput = '';
        var v = false;

        var getPosition = function ($element) {
            $element   = $element || this.$element;
            var el     = $element[0];
            var isBody = el.tagName == 'BODY';
            return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
              scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
              width:  isBody ? $(window).width()  : $element.outerWidth(),
              height: isBody ? $(window).height() : $element.outerHeight()
            }, isBody ? { top: 0, left: 0 } : $element.offset())
          }

        form.css('position', "relative");


        $("#" + $(this).attr('id')).on("click", 'input[type=submit]', function(event) {
            event.preventDefault();
            String.prototype.fulltrim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
            first = false;
            form.find('input,textarea,select').filter('[required]:visible').each(function() {
                var str = $(this).val();
                str = str.fulltrim();
                
                $(this).on("change", function(event) {
                    var value = $(this).val();
                    value = value.fulltrim();
                    if(value.length > 0 && $(this).next().hasClass('popover')) {
                        $(this)
                            .css("border","none")
                            .removeClass('empty_field')
                            .next('div')
                            .remove();
                    }
                });

                if(str.length > 0) {
                // If a field not the empty -  remove a class-indication
                    $(this)
                        .css("border","none")
                        .removeClass('empty_field')
                        .next('div')
                        .remove();
                } else {
                // If a field the empty -  add a class-indication
                    if (!$(this).next().hasClass('popover')) {
                        if(!first){
                            var el = $(this);
                            var x = 0;
                            var y = 0;
                            var pos = getPosition(el);
                            var posForm = getPosition(form);
                            y = pos.top - posForm.top + pos.height;
                            x = pos.left - posForm.left;
                            $(this)
                                .css("border","1px solid red")
                                .addClass('empty_field')
                                .after('<div class="popover bottom" style="top: ' + y +'px; left: ' + x + 'px">\
                                    <div class="arrow"></div><div class="popover-content">\
                                    <span class="warning"></span>Please fill out this field</div></div>');
                            $(this).val('');
                        }
                    }
                    if (!first) {
                        idInput = $(this);
                        first = true;
                    }
                }
            });
            var sizeEmpty = form.find('.empty_field').size();
            if (sizeEmpty > 0) {
                idInput.focus();
                v = false;
            } else {
                v = true;
            }
            if (v) {
                $('#' + idForm).submit();
            }
        });
    }
})(jQuery);

$(document).ready(function () {
    $('form').each(function(){
        $(this).validate();
    });
});
