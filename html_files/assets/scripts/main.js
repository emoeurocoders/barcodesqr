jQuery(document).ready(function($) {
    //mobile menu toggle
    // menu toggle 
    $('.nav-hamburger').on('touchstart click', function(e) {
        if (event.handled === false) return
        e.preventDefault();
        e.stopPropagation();
        event.handled = true;
        $('body').toggleClass('menuOpen');
    });

    //app sidebar toggle
    $('#mainApp .brg').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('#mainApp').toggleClass('menuOpen');
    });
    $(document).on('click', function(e) {
        if ($('#mainApp').hasClass('menuOpen') && !$(e.target).closest('#mainApp .lft').length) {
            $('#mainApp').removeClass('menuOpen');
        }
    });
	$('#mainApp .nte .close').on('click', function(e) {
		e.preventDefault();
		$('#mainApp .nte').remove();
	});

	//password toggle
	$('#mainApp .tbl .tgl').on('click', function() {
		var on = $(this).toggleClass('on').hasClass('on');
		$(this).next('.ln2').text(on ? 'On' : 'Off');
	});

	//stats chart
	if ($('#statsChart').length && window.Chart) {
		Chart.defaults.font.family = '"Inter", "Helvetica Neue", Arial, "Nimbus Sans L", FreeSans';
		$.getJSON('assets/data/stats.json', function(data) {
			new Chart($('#statsChart')[0], {
				type: 'line',
				data: {
					labels: data.labels,
					datasets: $.map(data.datasets, function(set) {
						return { label: set.label, data: set.data, borderColor: set.color, backgroundColor: set.color, borderWidth: 2, pointRadius: 0, pointHoverRadius: 3, tension: 0 };
					})
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					interaction: { mode: 'index', intersect: false },
					scales: {
						y: { min: 0, max: 10, ticks: { stepSize: 2, color: '#9ca3af', font: { size: 12 }, padding: 8 }, grid: { color: '#e2e6ec' }, border: { display: false } },
						x: { ticks: { color: '#9ca3af', font: { size: 12 }, maxRotation: 0, autoSkip: false, callback: function(val, index) { return index % 3 === 0 ? this.getLabelForValue(val) : ''; } }, grid: { display: false }, border: { display: false } }
					},
					plugins: {
						legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'line', color: '#6b7280', font: { size: 13 }, boxWidth: 20, padding: 16 } }
					}
				}
			});
		});
	}

});