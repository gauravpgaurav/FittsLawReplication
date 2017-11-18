$(document).ready(function(){
                var numberOfTargets = $('input:text').val();
                var fieldTracker = 0;
                var diametricFlag = false;
                var id_placeholder = "img_"
                
                function createFields() {
                    $('.field').remove();
                    fieldTracker = 0;
                    var container = $('#container');
                    for(var i = 0; i < numberOfTargets; i++) {
                        $('<img/>', {
                            'id': 'img_' + i,
                            'src': 'images/black_ring.png',
                            'class': 'field',
                            'width': '20px',
                            'height': '20px'
                        }).appendTo(container);
                    }
                    $("#img_0").attr('src','images/red.png');
                    $(".field").click(function(){
                        var currentColor = $(this).attr('src');
                        console.log("currentColor : " + currentColor);
                        if(currentColor == 'images/red.png') {
                            //console.log("fieldTracker1 : " + fieldTracker);
                            $(this).attr('src','images/black_ring.png');
                            fieldTracker = ($(this).attr('id')).replace( /^\D+/g, '');
                            //console.log("fieldTracker2 : " + fieldTracker);
                            nextTarget();
                        }
                    });
                    /*
                    $(".field").mouseenter(function(){
                        $(this).attr('src','images/orange.png');
                    });
                    $(".field").mouseleave(function(){
                        $(this).attr('src','images/black_ring.png');
                    });
                    */
                }
                $(".field").click(function(){
                        var currentColor = $(this).attr('src');
                        console.log("currentColor : " + currentColor);
                        if(currentColor == 'images/red.png') {
                            //console.log("fieldTracker1 : " + fieldTracker);
                            $(this).attr('src','images/black_ring.png');
                            fieldTracker = ($(this).attr('id')).replace( /^\D+/g, '');
                            //console.log("fieldTracker2 : " + fieldTracker);
                            nextTarget();
                        }
                });
                
                function nextTarget() {
                    if (fieldTracker == (numberOfTargets - 1)) {
                        alert("Done !");
                        $(".field").attr('src','images/black_ring.png');
                        return;
                    }
                    var limit = numberOfTargets/2;
                    if(diametricFlag) {
                        console.log("fieldTracker3 : " + fieldTracker);
                        fieldTracker = fieldTracker - (limit - 1);
                        console.log("fieldTracker4 : " + fieldTracker);
                        $("#img_" + fieldTracker).attr('src','images/red.png');
                        diametricFlag = false;
                    } else {
                        console.log("fieldTracker3 : " + fieldTracker);
                        fieldTracker = +fieldTracker + + limit;
                        console.log("fieldTracker4 : " + fieldTracker);
                        $("#img_" + fieldTracker).attr('src','images/red.png');
                        diametricFlag = true;
                    }
                }
                
                function distributeFields() {
                    var radius = 200;
                    var fields = $('.field'), container = $('#container'),
                        width = container.width(), height = container.height(),
                        angle = 0, step = (2*Math.PI) / fields.length;
                    fields.each(function() {
                        var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
                        var y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
                        if(window.console) {
                            //console.log($(this).text(), x, y);
                        }
                        $(this).css({
                            left: x + 'px',
                            top: y + 'px'
                        });
                        angle += step;
                    });
                }

                $('input').change(function() {
                    createFields();
                    distributeFields();
                });

                createFields();
                distributeFields();
            });