$(document).ready(function() {
    var numberOfTargets = 16;
    var targetTracker = 0;
    var diametricFlag = false;
    var outer_Radius_Array = [100, 150, 200, 250, 300];
    var inner_Radius_Array = [20, 25, 30, 35, 40];
    var iterations = 1;
    var outer_itr = 0;
    var inner_radius = 0;
    var outer_radius = 0;
    inner_Radius_Array = shuffle(inner_Radius_Array);
    outer_Radius_Array = shuffle(outer_Radius_Array);
    
    function updateTargetSize() {
        inner_radius = inner_Radius_Array.pop();
        console.log('Itr ', iterations);
        console.log('inner_radius ', inner_radius);
    }
    
    function updateTargetDistance() {
        outer_radius = outer_Radius_Array[outer_itr];
        console.log('Itr ', iterations);
        console.log('outer_radius ', outer_radius);
    }
    
    function generateTargets() {
        updateTargetSize();
        $('.target').remove();
        targetTracker = 0;
        var container = $('#container');
        for (var i = 0; i < numberOfTargets; i++) {
            $('<img/>', {
                'id': 'img_' + i,
                'src': 'images/black_ring.png',
                'class': 'target',
                'width': inner_radius + 'px',
                'height': inner_radius + 'px'
            }).appendTo(container);
        }
        positionTargets();
        $('#img_0').attr('src', 'images/red.png');
        $('.target').click(function() {
            var currentColor = $(this).attr('src');
            if (currentColor == 'images/red.png') {
                $(this).attr('src', 'images/black_ring.png');
                targetTracker = ($(this).attr('id')).replace(/^\D+/g, '');
                nextTarget();
            }
        });
    }
    $('.target').click(function() {
        var currentColor = $(this).attr('src');
        if (currentColor == 'images/red.png') {
            $(this).attr('src', 'images/black_ring.png');
            targetTracker = ($(this).attr('id')).replace(/^\D+/g, '');
            nextTarget();
        }
    });

    function nextTarget() {
        if (targetTracker == (numberOfTargets - 1)) {
            alert('Stage Completed ( ' + iterations + ' of 6) !');
            $('.target').attr('src', 'images/black_ring.png');
            iterations++;
            if (iterations <= 6) {
                if ((iterations-1) % 3 == 0) {
                    outer_itr = 0;
                    generateTargets();
                } else {
                    $('.target').attr('src', 'images/black_ring.png');
                    $('#img_0').attr('src', 'images/red.png');
                    outer_itr++;
                    positionTargets();
                }
            }
            else {
                return;
            }
        }
        var limit = numberOfTargets / 2;
        if (diametricFlag) {
            if (targetTracker != (numberOfTargets - 1)) {
                targetTracker = targetTracker - (limit - 1);
                $('#img_' + targetTracker).attr('src', 'images/red.png');
            }  
            diametricFlag = false;
        } else {
            targetTracker = +targetTracker + +limit;
            $('#img_' + targetTracker).attr('src', 'images/red.png');
            diametricFlag = true;
        }
    }

    function positionTargets() {
        updateTargetDistance();
        var targets = $('.target'),
            container = $('#container'),
            width = container.width(),
            height = container.height(),
            angle = 0,
            step = (2 * Math.PI) / targets.length;
        targets.each(function() {
            var x = Math.round(width / 2 + outer_radius * Math.cos(angle) - $(this).width() / 2);
            var y = Math.round(height / 2 + outer_radius * Math.sin(angle) - $(this).height() / 2);
            $(this).css({
                left: x + 'px',
                top: y + 'px'
            });
            angle += step;
        });
    }

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }
    generateTargets();
    positionTargets();
});