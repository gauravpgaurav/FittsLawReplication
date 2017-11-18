$(document).ready(function() {
    var numberOfTargets = 16;
    var targetTracker = 0;
    var diametricFlag = false;
    var outer_Radius_Array = [100, 150, 200, 250, 300];
    var inner_Radius_Array = [20, 25, 30, 35, 40];
    var iterations = 1;

    function generateTargets() {
        $('.target').remove();
        inner_Radius_Array = shuffle(inner_Radius_Array);
        var inner_radius = inner_Radius_Array.pop();
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
        $("#img_0").attr('src', 'images/red.png');
        $(".target").click(function() {
            var currentColor = $(this).attr('src');
            console.log("currentColor : " + currentColor);
            if (currentColor == 'images/red.png') {
                $(this).attr('src', 'images/black_ring.png');
                targetTracker = ($(this).attr('id')).replace(/^\D+/g, '');
                nextTarget();
            }
        });
    }
    $(".target").click(function() {
        var currentColor = $(this).attr('src');
        console.log("currentColor : " + currentColor);
        if (currentColor == 'images/red.png') {
            $(this).attr('src', 'images/black_ring.png');
            targetTracker = ($(this).attr('id')).replace(/^\D+/g, '');
            nextTarget();
        }
    });

    function nextTarget() {
        if (targetTracker == (numberOfTargets - 1)) {
            alert("Stage Completed ( " + iterations + " of 3) !");
            $(".target").attr('src', 'images/black_ring.png');
            iterations++;
            if (iterations < 4) {
                generateTargets();
                positionTargets();
            }
            else {
                return;
            }
        }
        var limit = numberOfTargets / 2;
        if (diametricFlag) {
            targetTracker = targetTracker - (limit - 1);
            $("#img_" + targetTracker).attr('src', 'images/red.png');
            diametricFlag = false;
        } else {
            targetTracker = +targetTracker + +limit;
            $("#img_" + targetTracker).attr('src', 'images/red.png');
            diametricFlag = true;
        }
    }

    function positionTargets() {
        outer_Radius_Array = shuffle(outer_Radius_Array);
        var outer_radius = outer_Radius_Array.pop();
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