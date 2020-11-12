import Highcharts from 'highcharts';

var total = 0;
Highcharts.setOptions({
    colors: ['#008ffb', '#00e396', '#feb019', '#ff4560']
});

export const chartDay = {
    chart: {
        zoomType: 'x',
        height: 380,
        backgroundColor: {
            linearGradient: { x1: 1, y1: 1, x2: 1, y2: 1 },
            stops: [
                [0, '#ffff']
            ]
        },
        style: {
            fontFamily: '\'Unica One\', sans-serif'
        },
        plotBorderColor: '#e6e6e6'
    },
    title: {
        text: 'Total: ' + total,
        style: {
            fontSize: '15px',
            color: '#666666',
            textTransform: 'uppercase',
        }
    },
    xAxis: {
        type: 'datetime',
        labels: {
            format: '{value:%d/%m}',
            style: {
                color: '#666666'
            }
        },
        gridLineColor: '#e6e6e6',
        lineColor: '#e6e6e6',
        minorGridLineColor: '#505053',
        tickColor: '#e6e6e6',
        title: {
            style: {
                color: '#666666'

            }
        }
    },
    yAxis: {
        min: 0,
        gridLineColor: '#e6e6e6',
        labels: {
            style: {
                color: '#666666'
            }
        },
        lineColor: '#e6e6e6',
        minorGridLineColor: '#505053',
        tickColor: '#e6e6e6',
        tickWidth: 1,
        title: {
            style: {
                color: '#666666'
            },
            text: ''
        }
    },
    legend: {
        enabled: false,
    },
    tooltip: {
        xDateFormat: '%d-%m-%Y',
        shared: true,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#b1b1b5'
        }
    },
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            marker: {
                radius: 2
            },
            lineWidth: 1,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        },
    },

    series: [{
        type: 'area',
        name: 'Traffic',
        data: [0]
    }],

    navigation: {
        buttonOptions: {
            enabled: true,
        },
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 450
            },
            chartOptions: {
                chart: {
                    height: 280
                }
            }
        }]
    }
};