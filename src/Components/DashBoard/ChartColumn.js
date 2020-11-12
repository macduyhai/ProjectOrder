export const chartColumn = {
    chart: {
        type: 'column',
        height: 420,
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
        text: '',
        style: {
            fontSize: '15px',
            color: '#666666',
            textTransform: 'uppercase',
        }
    },
    xAxis: {
        categories: ['Waitting', 'Shipping', 'Delay', 'Completed'],
        labels: {
            skew3d: true,
            style: {
                fontSize: '12px',
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
    legend: {
        enabled: false
    },
    yAxis: {
        allowDecimals: false,
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
    tooltip: {
        shared: true,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#b1b1b5'
        }
    },
    plotOptions: {
        column: {
            depth: 25,
            pointPadding: 0.2,
        },
        series: {
            cursor: 'pointer',
            point: {
                events: {
                    click: function () {

                        // alert('value: '+ time +', Traffic: '+ this.y);
                    }
                }
            }
        }

    },
    series: [{
        name: 'Orders for day',
        data: [0,0,0,0],
        color: '#ffc241'
    }],
    navigation: {
        buttonOptions: {
            enabled: false
        }
    }
}