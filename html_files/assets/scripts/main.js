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

	//review link https:// prefill
	$('#reviewLink').on('focus', function() {
		if ($(this).val() === '') {
			$(this).val('https://');
		}
	}).on('focusout', function() {
		if ($(this).val() === 'https://') {
			$(this).val('');
		}
	});

	//qr name character counter
	$('#qrName').on('input', function() {
		$(this).closest('.fld').find('.cnt').text($(this).val().length + '/' + $(this).attr('maxlength'));
	}).trigger('input');
	
	 //validate
    function validateForm(el) {
        if ($('.cc-number').length) {
            $('.cc-number').payment('formatCardNumber');
        }
        if ($('.cc-cvc').length) {
            $('.cc-cvc').payment('formatCardCVC');
        }
        if ($('.cc-exp').length) {
            $('.cc-exp').payment('formatCardExpiry');
        }
        //enable button
        function toggleContinue(validator) {
            if ($(".btnContinue").length) {
                var isValid = validator.checkForm(); // silent check, shows no messages
                $(validator.currentForm).find(".btnContinue")
                    .prop("disabled", !isValid)
                    .toggleClass("btnEnabled", isValid)
                    .toggleClass("btnDisabled", !isValid);
            }
        }

        //check bot
        $(el).validate({
            //onkeyup: false,
            //onkeyup: function(element) {$(element).valid()},
            onkeyup: function(element, event) {
                toggleContinue(this);
                if ($(element).hasClass("error") || $(element).hasClass("errorListen")) {
                    $.validator.defaults.onkeyup.call(this, element, event);
                } else {
                    return false;
                }
            },
            highlight: function(element) {
                toggleContinue(this);
                $(element).addClass("error");
                if (!$(element).hasClass("errorListen")) {
                    $(element).addClass("errorListen");
                }
            },
            onfocusout: function(element, event) {
                toggleContinue(this);
                this.element(element);
            },
            invalidHandler: function(event, validator) {},
            errorClass: 'error',
            errorElement: 'small',
            errorPlacement: function(error, element) {
                var theEl = element.parent();
                if (element.parent('.col').length) {
                    theEl = element.parents('#selColsWrp');
                }
                error.appendTo(theEl);
            },
            // other rules and options
            ignore: ":hidden",
            rules: {
                /*inTrNameF: {
                	validnamecharsf: true
                },
                inTrNameL: {
                	validnamecharsl: true
                },
                inTrName: {
                	validhandlechars: true,
                	nonumberstart: true,
                	maxhandlenumbers: true
                }*/

            },
            messages: {
                inTrNameF: {
                    validnamecharsf: "Please enter your first name."
                },
                inTrNameL: {
                    validnamecharsl: "Please enter your last name."
                },
                inTrName: {
                    validhandlechars: "Can only contain a-z and numbers.",
                    nonumberstart: "Must start with a-z, and then only allows a-z,0-9.",
                    maxhandlenumbers: "Too many numbers."
                }
            },
            submitHandler: function(form, event) {
                event.preventDefault();
                // form.submit();  
                $(form).addClass('processing');
                var postUrl = $(form).attr('action');
                var formData = $(form).serialize();
                var newUrl = false;
                if ($(form).is('[data-confirm]')) {
                    if ($(form).data('confirm').length) {
                        newUrl = $(form).data('confirm')
                    }
                }
				console.log('Submit Placeholder');
				 //on ajax submit success
                if ($(form).is('[data-confirm]')) {
                 fireModal(newUrl);
                 }
                return false;
            }
        });
    }

    $('.jQvalidate form, form.validate, .validate form').each(function(i, theEl) {
        validateForm(theEl);
    });
    $('body').on('click', '.validateEmail', function(e) {
        e.preventDefault();
        $("#inputEmail").valid();
        $("#inputEmail").trigger("focus");
    });
	
	//cc lightbox
    if ($('[data-lbox]').length) {
        function fireModal(theUrl) {
            theModal = theUrl.replace(/.html/, '');
            theModal = theModal.replace(/^(.*[\\\/])/, '');
            theModal = theModal.replace(/index/, '');
            theModal = theModal.replace(/lbox_/, '');
            $('.remodal-wrapper .closeMob, .remodal-overlay .closeDesk').remove();
            $(".lBboxWrp").empty();
            $(".lBboxWrp").load(theUrl + " #lboxCont", function() {
                theCurModal = $('.lBboxWrp').remodal();
                //$('.remodal-wrapper').prepend('<a href="#" class="closeDesk circ" data-remodal-action="close" ></a>');
                $('.lBboxWrp').addClass('lboxBG').addClass('lbox_' + theModal);
                //$(".lBboxWrp").prepend('<span class="closeMob icon-mega-1" data-remodal-action="close"></span>');
                //add package value, can remove this if using other method
                theCurModal.open();
                var theEl = $('.lBboxWrp form.validate');
                validateForm(theEl);
            });
        };
        $('body').prepend('<div id="lBox"><div class="lBboxWrp"></div></div>');
        $('body').on('click', '[data-lbox]', function(e) {
            e.stopPropagation();
            e.preventDefault();
            var modalUrl = $(this).attr('data-lbox');
            fireModal(modalUrl);
        });
        //listener to remove differential class		
        $(document).on('closed', '.remodal', function(e) {
            $(".lBboxWrp").removeClass('lbox_' + theModal);
            $(".lBboxWrp").removeAttr('style');
            $('.remodal-wrapper .closeDesk').remove();
        });
        //mobile bottom close link
        $(document).on('click', '.closeModal', function(e) {
            e.stopPropagation();
            e.preventDefault();
            theCurModal.close();
        });
    }
	
	
	
	
	
    $('body').on('click', '.cvvInfo', function(e) {
        e.preventDefault();
        $('.pop').addClass('active');
    });
	
	//password toggle
    $('body').on('click', '.passwordToggle', function() {
        if ($(this).parent().find('[type=password]').length) {
            $(this).parent().find('input').attr('type', 'text')
        } else {
            $(this).parent().find('input').attr('type', 'password')
        }
    });
    //password toggle
    $('body').on('click', '.passwordDiscToggle', function() {
        $(this).parent().find('input').toggleClass(['masked', 'unmasked']);
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
	//press logos infinite scroller
	if ($('#mainPressScroll .lst').length) {
		var $pressWrap = $('#mainPressScroll .scrl');
		var $pressTrack = $('#mainPressScroll .lst');
		var pressSet = $pressTrack.children();
		var pressSetWidth = 0;
		var pressX = 0;
		var pressLast = null;
		var pressPaused = false;
		var pressSpeed = 40; //px per second
		$pressTrack.append(pressSet.clone());
		function pressMeasure() {
			pressSetWidth = $pressTrack.children().eq(pressSet.length)[0].offsetLeft - pressSet[0].offsetLeft;
			while ($pressTrack[0].scrollWidth < $pressWrap.width() + pressSetWidth * 2) {
				$pressTrack.append(pressSet.clone());
			}
			pressX = pressX % pressSetWidth;
		}
		pressMeasure();
		$(window).on('resize', pressMeasure);
		$pressWrap.on('mouseenter', function() { pressPaused = true; }).on('mouseleave', function() { pressPaused = false; });
		function pressStep(ts) {
			if (pressLast !== null && !pressPaused) {
				pressX -= pressSpeed * (ts - pressLast) / 1000;
				if (pressX <= -pressSetWidth) { pressX += pressSetWidth; }
				$pressTrack.css('transform', 'translateX(' + pressX + 'px)');
			}
			pressLast = ts;
			requestAnimationFrame(pressStep);
		}
		requestAnimationFrame(pressStep);
	}

	//terms toggle
	$('#mainTerms .toc .tgl').on('click', function (e) {
		e.preventDefault();
		var open = $(this).closest('.toc').toggleClass('open').hasClass('open');
		$(this).find('.txt').text(open ? 'Show fewer sections' : 'Show all 31 sections');
	});
});