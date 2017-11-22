$(document).ready(function() {
    var numberOfTargets = 4;
    var targetTracker = 0;
    var diametricFlag = false;
    var outer_Radius_Array = [100, 200, 300];
    var inner_Radius_Array = [20, 40];
    var iterations = 1;
    var inner_itr = 0;
    var outer_itr = 0;
    var inner_radius = 0;
    var outer_radius = 0;
    var start_time = 0;
    var end_time = 0;
    var time_Array = [];
    var MT_Array = [];
    var Final_MT_Array = [];
    var ID_Array = [];
    var Final_ID_Array = [];
    var TP_Array = [];
    var id_outer_tracker = 0;

    inner_Radius_Array = shuffle(inner_Radius_Array);
    outer_Radius_Array = shuffle(outer_Radius_Array);

    function updateTargetSize() {
        inner_radius = inner_Radius_Array[inner_itr];
        //console.log('Itr ', iterations);
        //console.log('inner_radius ', inner_radius);
    }

    function updateTargetDistance() {
        outer_radius = outer_Radius_Array[outer_itr];
        //console.log('Itr ', iterations);
        //console.log('outer_radius ', outer_radius);
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

    function nextTarget() {
        // Check if last target reached
        if (targetTracker == (numberOfTargets - 1)) {
            var stage = 0;
            if (iterations > 6) {
                stage = iterations - 6; 
            } else {
                stage = iterations;
            }
            $('#placeholder').text('User ' + Math.floor(((iterations - 1) / 6) + 1) +' : Stage ' + stage + ' of 6 completed !');
            $('.target').attr('src', 'images/black_ring.png');
            iterations++;
            // Check if not all rounds are over
            if (iterations <= 12) {
                if ((iterations - 1) % 6 == 0) {
                    inner_Radius_Array = shuffle(inner_Radius_Array);
                    outer_Radius_Array = shuffle(outer_Radius_Array);
                    alert('Next User\'s turn !');
                    $('#placeholder').text('User 2 :');
                    inner_itr = 0;
                }
                // Check if all distances covered for one target size
                if ((iterations - 1) % 3 == 0) {
                    outer_itr = 0;
                    if ((iterations - 1) != 6) {
                        inner_itr++;
                    }
                    id_outer_tracker = 2;
                    setID();
                    generateTargets();
                } else {
                    // Calculate next distance for previous target size
                    $('.target').attr('src', 'images/black_ring.png');
                    $('#img_0').attr('src', 'images/red.png');
                    outer_itr++;
                    positionTargets();
                    id_outer_tracker = outer_itr - 1;
                }
            } else {
                id_outer_tracker = 2;
                setID();
                $('.target').remove();
                //console.log('MT_Array', MT_Array);
                //console.log('ID_Array', ID_Array);
                $('#container').hide();
                $('#title').text('Results :')
                $('#placeholder').hide();
                dataPreprocessing();
                createGraph(Final_ID_Array, Final_MT_Array, 'Movement Time - MT (milliseconds)');
                for (var i=0; i<Final_ID_Array.length; i++) {
                    TP_Array.push((Final_ID_Array[i]/Final_MT_Array[i]));
                }
                //console.log('TP_Array', TP_Array);
                createGraph(Final_ID_Array, TP_Array, 'Throughput - TP');
                return;
            }
        }
        var limit = numberOfTargets / 2;
        // If the target pair is to be completed
        if (diametricFlag) {
            // Check if Round not over i.e. not last target
            if (targetTracker != (numberOfTargets - 1)) {
                targetTracker = targetTracker - (limit - 1);
                $('#img_' + targetTracker).attr('src', 'images/red.png');
                end_time = (Date.now()) - start_time;
                time_Array.push(end_time);
            } else {
                setID();
            }
            diametricFlag = false;
        } else {
            // New target pair has been started
            targetTracker = +targetTracker + +limit;
            $('#img_' + targetTracker).attr('src', 'images/red.png');
            diametricFlag = true;
            start_time = Date.now();
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

    function setID() {
        // Round is over
        var arrayLength = time_Array.length;
        var totalTimeForRound = 0;
        for (var i = 0; i < arrayLength; i++) {
            totalTimeForRound += time_Array[i];
        }
        ID_Array.push((Math.log2((2 * (outer_Radius_Array[id_outer_tracker]) / inner_radius) + 1)));
        MT_Array.push((totalTimeForRound / arrayLength));
        time_Array = [];
    }

    function createGraph(ID_Array, MT_Array, y_label) {
        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y);

        var svg = d3.select('body').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var data = create_data(6);

        data.forEach(function(d) {
            d.x = +d.x;
            d.y = +d.y;
            d.yhat = +d.yhat;
        });

        var line = d3.line()
            .x(function(d) {
                return x(d.x);
            })
            .y(function(d) {
                return y(d.yhat);
            });

        x.domain(d3.extent(data, function(d) {
            return d.x;
        }));
        y.domain(d3.extent(data, function(d) {
            return d.y;
        }));

        svg.append('text')
            .attr('y', 0 - width / 2)
            .attr('x', 0 - margin.bottom)
            .attr('dx', '1em')
            .style('text-anchor', 'middle')
            .text('ID Value');
        
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .text('Hello')
            .call(xAxis)
            .append('text')
            .attr('class', 'label')
            .attr('x', width)
            .attr('y', -6)
            .style('text-anchor', 'end')
            .text('X-Value');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text(y_label);


        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Y-Value')

        svg.selectAll('.dot')
            .data(data)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 3.5)
            .attr('cx', function(d) {
                return x(d.x);
            })
            .attr('cy', function(d) {
                return y(d.y);
            });

        svg.append('path')
            .datum(data)
            .attr('class', 'line')
            .attr('d', line);



        function create_data(nsamples) {
            var x = ID_Array;
            var y = MT_Array;
            var n = nsamples;
            var x_mean = 0;
            var y_mean = 0;
            var term1 = 0;
            var term2 = 0;
            // create x and y values
            for (var i = 0; i < n; i++) {
                x_mean += x[i]
                y_mean += y[i]
            }
            // calculate mean x and y
            x_mean /= n;
            y_mean /= n;

            // calculate coefficients
            var xr = 0;
            var yr = 0;
            for (i = 0; i < x.length; i++) {
                xr = x[i] - x_mean;
                yr = y[i] - y_mean;
                term1 += xr * yr;
                term2 += xr * xr;

            }
            var b1 = term1 / term2;
            var b0 = y_mean - (b1 * x_mean);
            // perform regression 

            yhat = [];
            // fit line using coeffs
            for (i = 0; i < x.length; i++) {
                yhat.push(b0 + (x[i] * b1));
            }

            var data = [];
            for (i = 0; i < y.length; i++) {
                data.push({
                    'yhat': yhat[i],
                    'y': y[i],
                    'x': x[i]
                })
            }
            return (data);
        }
    }
    
    function dataPreprocessing() {
        for (var i = 0; i < (ID_Array.length/2); i++) {
            for (var j = ID_Array.length/2; j < ID_Array.length; j++) {
                if (ID_Array[i] == ID_Array[j]) {
                    Final_ID_Array.push(ID_Array[i]);
                    var meanMT = (MT_Array[i] + MT_Array[j])/2;
                    Final_MT_Array.push(meanMT);
                    break;
                }
            }
        }
        //console.log('Final_ID_Array', Final_ID_Array);
        //console.log('Final_MT_Array', Final_MT_Array);
    }
    
    generateTargets();
    positionTargets();
    
    $('.target').click(function() {
        var currentColor = $(this).attr('src');
        if (currentColor == 'images/red.png') {
            $(this).attr('src', 'images/black_ring.png');
            targetTracker = ($(this).attr('id')).replace(/^\D+/g, '');
            nextTarget();
        }
    });
});