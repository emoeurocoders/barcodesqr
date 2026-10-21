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
	/*if ($('#mainPressScroll .lst').length) {
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
	}*/

	//mainB faq accordion, one item open at a time
	$('#mainFaqs .btm > .lst .qst').on('click', function() {
		var $itm = $(this).closest('.itm');
		if ($itm.hasClass('act')) {
			$itm.removeClass('act').find('.ans').stop(true, true).slideUp(220);
			return;
		}
		$('#mainFaqs .btm > .lst .itm.act').removeClass('act').find('.ans').stop(true, true).slideUp(220);
		$itm.addClass('act').find('.ans').stop(true, true).slideDown(220);
	});

	//terms toggle
	$('#mainTerms .toc .tgl').on('click', function (e) {
		e.preventDefault();
		var open = $(this).closest('.toc').toggleClass('open').hasClass('open');
		$(this).find('.txt').text(open ? 'Show fewer sections' : 'Show all 31 sections');
	});

	//mobile home (main_mobile.html)
	if ($('body.mobHome').length) {
		//side menu
		$('.mobHome #mainHdr .brg').on('click', function(e) {
			e.preventDefault();
			$('body').toggleClass('mobNavOpen');
		});
		$('.mobHome #mobNav .cls, .mobHome .ovl').on('click', function(e) {
			e.preventDefault();
			$('body').removeClass('mobNavOpen');
		});
		$('.mobHome #mobNav .lst a').on('click', function() {
			$('body').removeClass('mobNavOpen');
		});
		//more formats toggle
		$('.mobHome #mainTypes .mid').on('click', function() {
			$('#mainTypes').toggleClass('open');
		});
		//footer accordions
		$('.mobHome #mainFooter .col .ln1').on('click', function() {
			$(this).closest('.col').toggleClass('open');
		});
		//sticky bottom cta, shows once the hero cta scrolls away, hides at the final cta / open menu / open modal / keyboard
		if ($('#mobCta').length) {
			var mobCtaHeroGone = false, mobCtaEndVis = false, mobCtaKb = false;
			var mobCtaSync = function() {
				var blocked = $('body').hasClass('mobNavOpen') || $('html').hasClass('remodal-is-locked') || mobCtaKb;
				$('body').toggleClass('mobCtaShow', mobCtaHeroGone && !mobCtaEndVis && !blocked);
			};
			var theHeroCta = $('#mainHero .btnWrp .btn')[0];
			var theEndCta = $('#mainReady .rgt .btn')[0];
			if (theHeroCta) {
				new IntersectionObserver(function(entries) {
					mobCtaHeroGone = !entries[0].isIntersecting;
					mobCtaSync();
				}).observe(theHeroCta);
			}
			if (theEndCta) {
				new IntersectionObserver(function(entries) {
					mobCtaEndVis = entries[0].isIntersecting;
					mobCtaSync();
				}).observe(theEndCta);
			}
			//menu / modal state lives in body + html classes
			new MutationObserver(mobCtaSync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
			new MutationObserver(mobCtaSync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
			//mobile keyboard
			$(document).on('focusin', 'input, textarea, select', function() {
				mobCtaKb = true;
				mobCtaSync();
			});
			$(document).on('focusout', 'input, textarea, select', function() {
				setTimeout(function() {
					mobCtaKb = $(document.activeElement).is('input, textarea, select');
					mobCtaSync();
				}, 80);
			});
		}
	}

	//create step 1 mobile (create_mobile.html) - view all 23 qr types toggle
	if ($('#mainCreate.createAltMob').length) {
		$('#mainCreate.createAltMob .lst .itm.mor > a').on('click', function (e) {
			e.preventDefault();
			$(this).closest('.itm').toggleClass('open');
			$('#mainCreate.createAltMob .lft .xtr').stop(true, true).slideToggle(260);
		});
	}

	//create step 2 mobile pages (create_mobile_website / _vcard / _multilink)
	if ($('#mainCreate.createMob2').length) {
		var $cr = $('#mainCreate.createMob2');
		var crSocColors = { facebook: '#1877f2', instagram: '#e1306c', whatsapp: '#25d366', tiktok: '#000000', youtube: '#ff0000', linkedin: '#0a66c2', x: '#000000', telegram: '#26a5e4', messenger: '#0084ff', snapchat: '#f7c600', pinterest: '#e60023', reddit: '#ff4500', line: '#06c755', wechat: '#07c160', viber: '#7360f2' };
		var crSocNames = { facebook: 'Facebook', instagram: 'Instagram', whatsapp: 'WhatsApp', tiktok: 'TikTok', youtube: 'YouTube', linkedin: 'LinkedIn', x: 'X', telegram: 'Telegram', messenger: 'Messenger', snapchat: 'Snapchat', pinterest: 'Pinterest', reddit: 'Reddit', line: 'LINE', wechat: 'WeChat', viber: 'Viber' };
		var crSocOrder = ['facebook', 'instagram', 'whatsapp', 'tiktok', 'youtube', 'linkedin', 'x', 'telegram', 'messenger', 'snapchat', 'pinterest', 'reddit', 'line', 'wechat', 'viber'];
		var crChvSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>';
		var crLnkSvg = '<span class="ic"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span>';
		var crMlLnksDef = $cr.find('.pvwMl .lnks').html();
		var crMlSocsDef = $cr.find('.pvwMl .socs').html();
		var crSmSocsDef = $cr.find('.pvwSoc .socs').html();
		var crMnItsDef = $cr.find('.pvwMenu .its').html();
		var crPayProv = {
			paypal: { n: 'PayPal', c: '#003087', d: ['paypal.com', 'paypal.me'] },
			stripe: { n: 'Stripe', c: '#635bff', d: ['stripe.com'] },
			cashapp: { n: 'CashApp', c: '#00d632', d: ['cash.app'] },
			braintree: { n: 'Braintree', c: '#0e1311', d: ['braintreepayments.com'] },
			square: { n: 'Square', c: '#0e1311', d: ['square.link', 'squareup.com'] },
			payoneer: { n: 'Payoneer', c: '#ff4800', d: ['payoneer.com'] },
			venmo: { n: 'Venmo', c: '#008cff', d: ['venmo.com'] },
			verifone: { n: 'Verifone (2Checkout)', c: '#00a3e0', d: ['2checkout.com', '2co.com'] },
			applepay: { n: 'Apple Pay', c: '#0e1311', d: [] },
			googlepay: { n: 'Google Pay', c: '#4285f4', d: [] },
			adyen: { n: 'Adyen', c: '#0abf53', d: ['adyen.com'] },
			klarna: { n: 'Klarna', c: '#e96f8f', d: ['klarna.com'] },
			cartesbancaires: { n: 'Cartes Bancaires', c: '#083969', d: [] },
			giropay: { n: 'Giropay', c: '#000268', d: ['giropay.de'] },
			other: { n: 'Other provider', c: '#6b7280', d: [] }
		};
		function crFmtTime(theT) {
			var theP = theT.split(':');
			var theH = parseInt(theP[0], 10);
			var theAp = theH >= 12 ? 'PM' : 'AM';
			var theH12 = theH % 12 || 12;
			return theH12 + (theP[1] !== '00' ? ':' + theP[1] : '') + ' ' + theAp;
		}
		function crEsc(theStr) {
			return $('<i>').text(theStr).html();
		}

		//enter key routes through the Next validation
		$cr.find('form.crMobFrm').on('submit', function(e) {
			e.preventDefault();
			$cr.find('.ftr .btnNext').trigger('click');
		});

		//compact preview expand / collapse
		$cr.find('.pvwCmp .bar').on('click', function(e) {
			e.preventDefault();
			$(this).closest('.pvwCmp').toggleClass('open').find('> .bd').stop(true, true).slideToggle(220);
		});

		//accordions
		$cr.find('.frm .acc > .hd').on('click', function(e) {
			e.preventDefault();
			$(this).closest('.acc').toggleClass('open').find('> .bd').stop(true, true).slideToggle(220);
		});
		function crOpenAcc($acc) {
			if ($acc.length && !$acc.hasClass('open')) {
				$acc.addClass('open').find('> .bd').stop(true, true).slideDown(220);
			}
		}

		//character counters
		$cr.on('input', '.fld input[maxlength]:not(#qrName), .fld textarea[maxlength]', function() {
			$(this).closest('.fld').find('.cnt').text($(this).val().length + '/' + $(this).attr('maxlength'));
		});

		//https:// prefill on url fields
		$cr.on('focusin', 'input.inUrl', function() {
			if ($(this).val() === '') {
				$(this).val('https://');
			}
		}).on('focusout', 'input.inUrl', function() {
			if ($(this).val() === 'https://') {
				$(this).val('');
			}
		});

		//info tooltips, tap to open, outside tap or Escape closes
		$cr.on('click', '.tipWrp .tipIco', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var $wrp = $(this).closest('.tipWrp');
			var on = !$wrp.hasClass('on');
			$cr.find('.tipWrp.on').removeClass('on');
			$wrp.toggleClass('on', on);
		});
		$(document).on('click', function() {
			$cr.find('.tipWrp.on').removeClass('on');
		});
		$(document).on('keydown', function(e) {
			if (e.key === 'Escape') {
				$cr.find('.tipWrp.on').removeClass('on');
			}
		});

		//social platform picker
		$cr.find('.socGrd .itm > a').on('click', function(e) {
			e.preventDefault();
			var $itm = $(this).closest('.itm');
			var theSoc = $itm.attr('data-soc');
			var on = !$itm.hasClass('on');
			$itm.toggleClass('on', on);
			var $fld = $cr.find('.socFlds .fld[data-soc="' + theSoc + '"]');
			$fld.toggleClass('on', on).stop(true, true)[on ? 'slideDown' : 'slideUp'](200);
			if (on) {
				$fld.find('input').trigger('focus');
			} else {
				$fld.find('input').val('').removeClass('error');
				$fld.find('small.error').remove();
			}
			crPreview();
			if ($cr.find('.socReq').children('small.error').length) {
				crSocErrSync(false);
			}
		});
		$cr.find('.socFlds .fld .rmv').on('click', function(e) {
			e.preventDefault();
			var theSoc = $(this).closest('.fld').attr('data-soc');
			$cr.find('.socGrd .itm[data-soc="' + theSoc + '"] > a').trigger('click');
		});
		$cr.find('.socMore').on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('on');
			$cr.find('.socGrd').toggleClass('more');
		});

		//image uploads, swap into the live preview
		function crSetImg(theSrc, theTgt) {
			$cr.find('img.pvwImg').each(function() {
				if (theTgt && $(this).attr('data-img') !== theTgt) return;
				if (!theTgt && $(this).attr('data-img')) return;
				var theFin = theSrc || $(this).data('def') || '';
				$(this).attr('src', theFin).toggle(!!theFin);
			});
		}
		$cr.on('change', '.upl input[type=file]:not([multiple])', function() {
			var theFile = this.files && this.files[0];
			var $bd = $(this).closest('.bd');
			var theTgt = $(this).attr('data-tgt') || null;
			if (!theFile || !window.FileReader) return;
			var theReader = new FileReader();
			theReader.onload = function(ev) {
				$bd.find('.uplPrv').addClass('on').find('img').attr('src', ev.target.result);
				crSetImg(ev.target.result, theTgt);
			};
			theReader.readAsDataURL(theFile);
		});
		$cr.on('click', '.uplPrv .rmv', function(e) {
			e.preventDefault();
			var $bd = $(this).closest('.bd');
			$bd.find('.uplPrv').removeClass('on').find('img').removeAttr('src');
			$bd.find('input[type=file]').val('');
			crSetImg(null, $bd.find('input[type=file]').attr('data-tgt') || null);
		});

		//address mode segment
		$cr.find('.seg a').on('click', function(e) {
			e.preventDefault();
			$(this).addClass('on').siblings().removeClass('on');
			var theMode = $(this).attr('data-mode');
			$cr.find('.adrMan').toggle(theMode === 'manual');
			$cr.find('.adrUrl').toggle(theMode === 'url');
		});

		//multilink links editor
		var $lnkLst = $cr.find('.lnkLst');
		function crRenum() {
			var theLbl = $lnkLst.attr('data-lbl') || 'Link';
			$lnkLst.find('.lnkRow').each(function(i) {
				$(this).find('.lhd .ln1').text(theLbl + ' ' + (i + 1));
			});
		}
		$cr.find('.addLnk').on('click', function(e) {
			e.preventDefault();
			var $row = $lnkLst.find('.lnkRow').first().clone();
			$row.find('input, textarea').val('').removeClass('error');
			$row.find('small.error').remove();
			$lnkLst.append($row);
			crRenum();
			$row.find('.lnkNme').trigger('focus');
		});
		$lnkLst.on('click', '.ctl .rmv', function(e) {
			e.preventDefault();
			if ($lnkLst.find('.lnkRow').length > 1) {
				$(this).closest('.lnkRow').remove();
				crRenum();
				crPreview();
			}
		});
		$lnkLst.on('click', '.ctl .mvu', function(e) {
			e.preventDefault();
			var $row = $(this).closest('.lnkRow');
			$row.prev('.lnkRow').before($row);
			crRenum();
			crPreview();
		});
		$lnkLst.on('click', '.ctl .mvd', function(e) {
			e.preventDefault();
			var $row = $(this).closest('.lnkRow');
			$row.next('.lnkRow').after($row);
			crRenum();
			crPreview();
		});

		//live preview, sample content swaps out as the customer types
		function crSocSel() {
			var theSel = [];
			for (var i = 0; i < crSocOrder.length; i++) {
				if ($cr.find('.socGrd .itm[data-soc="' + crSocOrder[i] + '"]').hasClass('on')) {
					theSel.push(crSocOrder[i]);
				}
			}
			return theSel;
		}
		function crPreview() {
			//website, fake sample page appears once the url is valid
			if ($('#siteUrl').length) {
				var theUrl = $.trim($('#siteUrl').val());
				var urlOk = crUrlOk(theUrl);
				$cr.find('.pvwSite .lnk2').text(urlOk ? theUrl : 'https://www.yourwebsite.com');
				$cr.find('.pvwSite').toggleClass('has', urlOk);
			}
			//vcard
			if ($('#vcFirst').length) {
				var theNm = $.trim($.trim($('#vcFirst').val()) + ' ' + $.trim($('#vcLast').val()));
				$cr.find('.pvwNm').text(theNm || 'Ava Whitfield');
				$cr.find('.pvwRl').text($.trim($('#vcRole').val()) || 'Senior Product Designer');
				$cr.find('.pvwVcd .sum').text($.trim($('#vcSummary').val()) || 'Designing thoughtful, human-centered products — pairing research and craft to turn rough ideas into polished experiences.');
				var theSel = crSocSel();
				var theCols = theSel.length ? theSel.slice(0, 4) : ['instagram', 'facebook', 'linkedin', 'youtube'];
				$cr.find('.pvwDts').each(function() {
					var $dts = $(this).empty();
					for (var i = 0; i < theCols.length; i++) {
						$dts.append($('<i>').css('background', crSocColors[theCols[i]]).append($('<img>').attr({ src: 'assets/images/create2_soc_' + theCols[i] + '.svg', alt: '' })));
					}
				});
			}
			//multilink
			if ($('#mlTitle').length) {
				$cr.find('.pvwMl .ttl').text($.trim($('#mlTitle').val()) || 'The Matcha Den');
				$cr.find('.pvwMl .dsc').text($.trim($('#mlDesc').val()) || 'A cozy matcha bar pouring comforting, Japanese-inspired drinks all day long.');
				var theRows = [];
				$lnkLst.find('.lnkRow .lnkNme').each(function() {
					if ($.trim($(this).val())) {
						theRows.push($.trim($(this).val()));
					}
				});
				var $lnks = $cr.find('.pvwMl .lnks');
				if (theRows.length) {
					$lnks.empty();
					for (var i = 0; i < theRows.length; i++) {
						$lnks.append('<div class="lrow' + (i === 0 ? ' pri' : '') + '">' + crLnkSvg + '<span class="tx">' + crEsc(theRows[i]) + '</span>' + crChvSvg + '</div>');
					}
				} else {
					$lnks.html(crMlLnksDef);
				}
				var theSel2 = crSocSel();
				var $socs = $cr.find('.pvwMl .socs');
				if (theSel2.length) {
					$socs.empty();
					for (var j = 0; j < theSel2.length; j++) {
						$socs.append('<div class="lrow"><i class="bdg2" style="background:' + crSocColors[theSel2[j]] + ';"><img src="assets/images/create2_soc_' + theSel2[j] + '.svg" alt=""></i><span class="tx">' + crSocNames[theSel2[j]] + '</span>' + crChvSvg + '</div>');
					}
				} else {
					$socs.html(crMlSocsDef);
				}
			}
			//menu
			if ($('#mnTitle').length) {
				$cr.find('.pvwMenu .ttl').text($.trim($('#mnTitle').val()) || 'Bella Italia Menu');
				var theCat = $.trim($('#mnCat').val());
				$cr.find('.pvwMenu .cat').text(theCat).toggleClass('on', !!theCat);
				var theIts = [];
				$lnkLst.find('.lnkRow').each(function() {
					var theNm = $.trim($(this).find('.lnkNme').val());
					var thePrc = $.trim($(this).find('.mnPrc').val());
					if (theNm && thePrc) {
						theIts.push({ nm: theNm, prc: thePrc, ds: $.trim($(this).find('.mnDsc').val()) });
					}
				});
				var $its = $cr.find('.pvwMenu .its');
				if (theIts.length) {
					$its.empty();
					for (var q = 0; q < theIts.length; q++) {
						$its.append('<div class="it"><div class="ln"><span class="nm2">' + crEsc(theIts[q].nm) + '</span><span class="dots"></span><span class="prc">' + crEsc(theIts[q].prc) + '</span></div>' + (theIts[q].ds ? '<p class="ds">' + crEsc(theIts[q].ds) + '</p>' : '') + '</div>');
					}
				} else {
					$its.html(crMnItsDef);
				}
			}
			//wifi
			if ($('#wfSsid').length) {
				$cr.find('.pvwWifi .pvwSsid').text($.trim($('#wfSsid').val()) || 'CozyCornerWiFi');
				var theSec = $('#wfSec').val();
				var theMeta = theSec === 'nopass' ? 'Open network · No password' : (theSec === 'WEP' ? 'WEP' : 'WPA/WPA2') + ' · Password protected';
				if ($('#wfHidden').prop('checked')) {
					theMeta += ' · Hidden network';
				}
				$cr.find('.pvwWifi .meta').text(theMeta);
			}
			//image gallery title
			if ($('#imTitle').length) {
				$cr.find('.pvwGal .gt').text($.trim($('#imTitle').val()) || 'Summer Memories');
			}
			//whatsapp
			if ($('#waMsg').length) {
				$cr.find('.pvwWa .bub p').text($.trim($('#waMsg').val()) || "Hi! 👋 I just scanned your QR code and I'd love to hear more — can you fill me in?");
			}
			//email draft
			if ($('#emTo').length) {
				$cr.find('.pvwEml .eto').text($.trim($('#emTo').val()) || 'email@example.com');
				$cr.find('.pvwEml .esub').text($.trim($('#emSubj').val()) || 'Product Inquiry');
				$cr.find('.pvwEml .ebod').text($.trim($('#emBody').val()) || 'Hi there — I just scanned your QR code and wanted to learn more about your services.');
			}
			//google review: the button uses the validated link
			if ($('#rvUrl').length) {
				var theRv = $.trim($('#rvUrl').val());
				$cr.find('.pvwRev .wrb').attr('href', crUrlOk(theRv) ? theRv : '#');
			}
			//sms draft
			if ($('#smsNum').length) {
				var theSn = $.trim($('#smsNum').val());
				var theScc = ($('#smsCc').val() || '+1').split('-')[0];
				$cr.find('.pvwSmsNum').text(theSn ? theScc + ' ' + theSn : '+1 555 123 4567');
				$cr.find('.pvwSms .bub2 p').text($.trim($('#smsMsg').val()) || "Hi! I just scanned your QR code and I'd love to hear more — can you fill me in?");
			}
			//phone dialer
			if ($('#telNum').length) {
				var theTn = $.trim($('#telNum').val());
				var theTcc = ($('#telCc').val() || '+1').split('-')[0];
				$cr.find('.pvwTelNum').text(theTn ? theTcc + ' ' + theTn : '+1 555 555 0123');
			}
			//plain text note
			if ($('#txMsg').length) {
				$cr.find('.pvwTxTtl').text($.trim($('#txTitle').val()) || 'Note');
				$cr.find('.pvwTxBody').text($.trim($('#txMsg').val()) || 'Welcome to the workshop! 👋\n\nWi-Fi: CozyCornerWiFi\nSchedule: kickoff at 9:30, demos after lunch.\nParking: the garage on 5th St — first hour is free.\n\nQuestions? Find anyone in a teal lanyard.');
			}
			//audio card title
			if ($('#auTitle').length) {
				var theAt = $.trim($('#auTitle').val());
				var theAfn = $cr.data('audName') || '';
				$cr.find('.pvwAudTtl').text(theAt || (theAfn ? theAfn.replace(/\.[^.]+$/, '') : 'Welcome Message'));
			}
			//event card
			if ($('#evTitle').length) {
				$cr.find('.pvwEvTtl').text($.trim($('#evTitle').val()) || 'Summer Networking Mixer');
				var theEvD = $('#evStD').val();
				var theEvDt = new Date((theEvD || '2024-06-09') + 'T12:00:00');
				var theMo3 = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
				var theDw3 = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
				$cr.find('.pvwEvMon').text(theMo3[theEvDt.getMonth()]);
				$cr.find('.pvwEvDay').text(('0' + theEvDt.getDate()).slice(-2));
				$cr.find('.pvwEvDow').text(theDw3[theEvDt.getDay()]);
				var theSt3 = $('#evStT').val();
				var theEt3 = $('#evEnT').val();
				var crEvT = function(theT) {
					var theP2 = theT.split(':');
					var theH2 = parseInt(theP2[0], 10);
					return (theH2 % 12 || 12) + ':' + theP2[1] + ' ' + (theH2 >= 12 ? 'PM' : 'AM');
				};
				$cr.find('.pvwEvTime').text(theSt3 ? crEvT(theSt3) + (theEt3 ? ' – ' + crEvT(theEt3) : '') : '6:00 PM – 9:00 PM');
				var theLoc2 = $.trim($('#evLoc').val());
				var theDsc2 = $.trim($('#evDesc').val());
				var theAnyEv = !!($.trim($('#evTitle').val()) || theEvD || theSt3 || theLoc2 || theDsc2);
				var $elr = $cr.find('.pvwEvt .eloc');
				if (theLoc2) {
					$elr.show();
					$elr.find('.pvwEvLoc').text(theLoc2);
					$elr.find('.pvwEvLoc2').hide();
				} else if (theAnyEv) {
					$elr.hide();
				} else {
					$elr.show();
					$elr.find('.pvwEvLoc').text('The Skyline Rooftop');
					$elr.find('.pvwEvLoc2').show().text('123 Main St, New York, NY 10001');
				}
				var $eds = $cr.find('.pvwEvDsc');
				if (theDsc2) {
					$eds.show().text(theDsc2);
				} else if (theAnyEv) {
					$eds.hide();
				} else {
					$eds.show().text('Join us for an evening of great conversations, new connections, and summer vibes. Enjoy refreshments, meet industry professionals, and be part of our growing community!');
				}
			}
			//feedback: the button uses the validated link
			if ($('#fbUrl').length) {
				var theFb = $.trim($('#fbUrl').val());
				$cr.find('.pvwFb .fbb').attr('href', /^https:\/\//i.test(theFb) && crUrlOk(theFb) ? theFb : '#');
			}
			//payment, auto-detect recognized providers from the link
			if ($('#paySel').length) {
				var theLnk = $.trim($('#payLink').val());
				var theHost = (theLnk.match(/^https?:\/\/([^\/?#]+)/i) || [])[1] || '';
				if (theHost) {
					for (var pk in crPayProv) {
						var theDms = crPayProv[pk].d || [];
						for (var di = 0; di < theDms.length; di++) {
							if (theHost.toLowerCase().indexOf(theDms[di]) > -1 && $('#paySel').val() !== pk) {
								$('#paySel').val(pk).removeClass('error').closest('.row').find('small.error').remove();
							}
						}
					}
				}
				var thePv = crPayProv[$('#paySel').val()];
				$cr.find('.pvwPay .pvwPvNm').text(thePv ? thePv.n : '—');
				$cr.find('.pvwPay .pvwPvCh').text(thePv ? thePv.n.charAt(0) : '?').css('background', thePv ? thePv.c : '#9aa3b2');
				$cr.find('.pvwPay .ph4').text(thePv && $('#paySel').val() !== 'other' ? 'Checkout on ' + thePv.n : 'Secure Checkout');
				$cr.find('.pvwPay .ctp').attr('href', /^https:\/\//i.test(theLnk) && crUrlOk(theLnk) ? theLnk : '#');
			}
			//coupon
			if ($('#cpTitle').length) {
				$cr.find('.pvwCpTtl').text($.trim($('#cpTitle').val()) || 'Weekend Special');
				$cr.find('.pvwCpDsc').text($.trim($('#cpDisc').val()) || '20% OFF');
				$cr.find('.pvwCpCod').text($.trim($('#cpCode').val()) || 'SAVE20');
				$cr.find('.pvwCpTrm').text($.trim($('#cpTerms').val()) || 'One per customer. Cannot be combined with other offers.');
				var theEx = $('#cpExp').val();
				var $exr = $cr.find('.pvwCpn .cexp');
				if (theEx) {
					var theDt = new Date(theEx + 'T23:59:59');
					var theOld = theDt.getTime() < new Date().getTime();
					$cr.find('.pvwCpExp').text((theOld ? 'Expired ' : 'Expires ') + theDt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
					$exr.toggleClass('off2', theOld);
				} else {
					$cr.find('.pvwCpExp').text('Expires Dec 31, 2026');
					$exr.removeClass('off2');
				}
			}
			//business page
			if ($('#bzName').length) {
				$cr.find('.pvwBzNm').text($.trim($('#bzName').val()) || 'Harbor & Sage Co.');
				$cr.find('.pvwBzDs').text($.trim($('#bzDesc').val()) || 'Specialty coffee & all-day brunch in the heart of town.');
				var theBzMap = [['#bzPhone', '.bzCall', '+1 555 014 2890'], ['#bzEmail', '.bzMail', 'hello@harborsage.com'], ['#bzWeb', '.bzWeb', 'harborsage.com'], ['#bzAdr', '.bzAdr', '123 Harbor St, Portside']];
				var theAny = false;
				for (var b = 0; b < theBzMap.length; b++) {
					if ($.trim($(theBzMap[b][0]).val())) {
						theAny = true;
					}
				}
				for (var b2 = 0; b2 < theBzMap.length; b2++) {
					var theBv = $.trim($(theBzMap[b2][0]).val());
					var $brw = $cr.find('.pvwBiz ' + theBzMap[b2][1]);
					if (theAny) {
						$brw.toggle(!!theBv);
						if (theBv) {
							$brw.find('.t2').text(theBv.replace(/^https?:\/\//i, ''));
						}
					} else {
						$brw.show().find('.t2').text(theBzMap[b2][2]);
					}
				}
				var theOp = $('#bzOpen').val();
				var theCl = $('#bzClose').val();
				if (theOp && theCl) {
					var theNow = new Date();
					var theNm = theNow.getHours() * 60 + theNow.getMinutes();
					var theOm = parseInt(theOp.split(':')[0], 10) * 60 + parseInt(theOp.split(':')[1], 10);
					var theCm = parseInt(theCl.split(':')[0], 10) * 60 + parseInt(theCl.split(':')[1], 10);
					var theOpen = theOm <= theCm ? (theNm >= theOm && theNm < theCm) : (theNm >= theOm || theNm < theCm);
					$cr.find('.pvwBiz .hrs').toggleClass('cls2', !theOpen);
					$cr.find('.pvwBzHrs').html(theOpen ? '<b>Open</b> &middot; Closes ' + crFmtTime(theCl) : '<b>Closed</b> &middot; Opens ' + crFmtTime(theOp));
				} else {
					$cr.find('.pvwBiz .hrs').removeClass('cls2');
					$cr.find('.pvwBzHrs').html('<b>Open</b> &middot; Closes 3 PM');
				}
			}
			//social media
			if ($('#smHeadline').length) {
				$cr.find('.pvwNm').text($.trim($('#smHeadline').val()) || 'Kaia Bennett');
				$cr.find('.pvwSoc .qot p').text($.trim($('#smDesc').val()) || 'Creating a brighter, more connected world through content, community and good ideas.');
				var theSel3 = crSocSel();
				var $socs2 = $cr.find('.pvwSoc .socs');
				if (theSel3.length) {
					$socs2.empty();
					for (var n = 0; n < theSel3.length; n++) {
						$socs2.append('<div class="lrow"><i class="bdg2" style="background:' + crSocColors[theSel3[n]] + ';"><img src="assets/images/create2_soc_' + theSel3[n] + '.svg" alt=""></i><span class="tx">' + crSocNames[theSel3[n]] + '</span>' + crChvSvg + '</div>');
					}
				} else {
					$socs2.html(crSmSocsDef);
				}
			}
		}
		$cr.on('input', '#siteUrl, #vcFirst, #vcLast, #vcRole, #vcSummary, #mlTitle, #mlDesc, #smHeadline, #smDesc, #mnTitle, #mnCat, #wfSsid, #imTitle, #waMsg, #emTo, #emSubj, #emBody, #rvUrl, #smsNum, #smsMsg, #telNum, #txMsg, #txTitle, #auTitle, #evTitle, #evLoc, #evDesc, #fbUrl, #payLink, #cpTitle, #cpDisc, #cpCode, #cpTerms, #bzName, #bzDesc, #bzPhone, #bzEmail, #bzWeb, #bzAdr, .lnkNme, .mnPrc, .mnDsc', crPreview);
		$cr.on('change', '#paySel, #cpExp, #bzOpen, #bzClose, #smsCc, #telCc, #evStD, #evStT, #evEnD, #evEnT', crPreview);

		//review link help + example-state button guards
		$cr.find('.hlpLnk').on('click', function(e) {
			e.preventDefault();
			$cr.find('.hlpBox').stop(true, true).slideToggle(200);
		});
		$cr.on('click', '.pvwRev .wrb[href="#"], .pvwPay .ctp[href="#"], .pvwFb .fbb[href="#"], .pvwEvt .ecal', function(e) {
			e.preventDefault();
		});

		//coupon: copy code button
		$cr.on('click', '.pvwCpn .cpyb', function() {
			var $theBtn = $(this);
			var theCode = $cr.find('.pvwCpCod').text();
			var theDone = function() {
				$theBtn.find('span').text('Copied!');
				setTimeout(function() {
					$theBtn.find('span').text('Copy code');
				}, 1400);
			};
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(theCode).then(theDone, theDone);
			} else {
				theDone();
			}
		});

		//plain text: copy text button
		$cr.on('click', '.pvwTxt .ncp', function(e) {
			e.preventDefault();
			var $theBtn = $(this);
			var theTxt = $cr.find('.pvwTxBody').text();
			var theDone = function() {
				$theBtn.find('span').text('Copied!');
				setTimeout(function() {
					$theBtn.find('span').text('Copy text');
				}, 1400);
			};
			if (navigator.clipboard && navigator.clipboard.writeText) {
				navigator.clipboard.writeText(theTxt).then(theDone, theDone);
			} else {
				theDone();
			}
		});

		//single-file upload helpers
		function crSizeTxt(theB) {
			return theB >= 1048576 ? (theB / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(theB / 1024)) + ' KB';
		}
		function crFileErr($fld, theMsg) {
			$fld.children('small.error').remove();
			if (theMsg) {
				$fld.append('<small class="error">' + theMsg + '</small>');
			}
		}

		//pdf: single document, embedded preview with page navigation
		if ($('#pdfFile').length) {
			var crPdfUrl = null;
			var crPdfPages = 1;
			var crPdfPage = 1;
			var crPdfDefDoc = $cr.find('.pvwPdf .doc').html();
			function crPdfObj() {
				$cr.find('.pvwPdf .doc').html('<object class="pdfObj" type="application/pdf" data="' + crPdfUrl + '#toolbar=0&navpanes=0&page=' + crPdfPage + '"></object>');
				$cr.find('.pvwPdf .pcnt').text(crPdfPage + ' / ' + crPdfPages);
			}
			$cr.on('change', '#pdfFile', function() {
				var theFile = this.files && this.files[0];
				this.value = '';
				if (!theFile) return;
				var $fld = $cr.find('.fileReq');
				if (theFile.type !== 'application/pdf' && !/\.pdf$/i.test(theFile.name)) {
					crFileErr($fld, 'Please choose a PDF file.');
					return;
				}
				if (theFile.size > 20 * 1048576) {
					crFileErr($fld, 'That file is too large (max 20 MB).');
					return;
				}
				crFileErr($fld, '');
				if (crPdfUrl) {
					URL.revokeObjectURL(crPdfUrl);
				}
				crPdfUrl = URL.createObjectURL(theFile);
				crPdfPage = 1;
				crPdfPages = 1;
				$fld.find('.fileCrd').addClass('on').find('.fnm').text(theFile.name).end().find('.fsz').text(crSizeTxt(theFile.size));
				crPdfObj();
				var theReader = new FileReader();
				theReader.onload = function(ev) {
					var theM = String(ev.target.result).match(/\/Type\s*\/Page[^s]/g);
					if (theM && theM.length) {
						crPdfPages = theM.length;
					}
					$cr.find('.pvwPdf .pcnt').text(crPdfPage + ' / ' + crPdfPages);
				};
				theReader.readAsText(theFile);
			});
			$cr.on('click', '.pvwPdf .nv2', function(e) {
				e.preventDefault();
				if (!crPdfUrl) return;
				crPdfPage = Math.min(crPdfPages, Math.max(1, crPdfPage + ($(this).hasClass('pdfNxt') ? 1 : -1)));
				crPdfObj();
			});
			$cr.on('click', '.fileCrd .frm2', function(e) {
				e.preventDefault();
				if (crPdfUrl) {
					URL.revokeObjectURL(crPdfUrl);
					crPdfUrl = null;
				}
				$cr.find('.fileCrd').removeClass('on');
				$cr.find('.pvwPdf .doc').html(crPdfDefDoc);
				$cr.find('.pvwPdf .pcnt').html('&ndash; / &ndash;');
			});
		}

		//video: single upload, native player preview, captured thumbnail
		if ($('#vidFile').length) {
			var crVidUrl = null;
			var crVidDefWrp = $cr.find('.pvwVid .vidWrp').html();
			var crVidDefFic = $cr.find('.fileCrd .fic').html();
			$cr.on('change', '#vidFile', function() {
				var theFile = this.files && this.files[0];
				this.value = '';
				if (!theFile) return;
				var $fld = $cr.find('.fileReq');
				if (!/^video\//.test(theFile.type) && !/\.(mp4|mov|m4v|avi|webm)$/i.test(theFile.name)) {
					crFileErr($fld, 'Please choose a video file (MP4, MOV, AVI, etc.).');
					return;
				}
				if (theFile.size > 50 * 1048576) {
					crFileErr($fld, 'That file is too large (max 50 MB).');
					return;
				}
				crFileErr($fld, '');
				if (crVidUrl) {
					URL.revokeObjectURL(crVidUrl);
				}
				crVidUrl = URL.createObjectURL(theFile);
				$fld.find('.fileCrd').addClass('on').find('.fnm').text(theFile.name).end().find('.fsz').text(crSizeTxt(theFile.size));
				$cr.find('.pvwVid .vidWrp').html('<video controls preload="metadata" src="' + crVidUrl + '"></video>');
				//grab a frame for the file card thumbnail, fall back to the icon
				var theV = document.createElement('video');
				theV.muted = true;
				theV.src = crVidUrl;
				theV.addEventListener('loadeddata', function() {
					try { theV.currentTime = 0.1; } catch (e) {}
				});
				theV.addEventListener('seeked', function() {
					try {
						var theC = document.createElement('canvas');
						theC.width = 96;
						theC.height = 96;
						var theS = Math.min(theV.videoWidth, theV.videoHeight);
						theC.getContext('2d').drawImage(theV, (theV.videoWidth - theS) / 2, (theV.videoHeight - theS) / 2, theS, theS, 0, 0, 96, 96);
						$cr.find('.fileCrd .fic').html('<img src="' + theC.toDataURL('image/jpeg', 0.72) + '" alt="">');
					} catch (e) {}
				});
			});
			$cr.on('click', '.fileCrd .frm2', function(e) {
				e.preventDefault();
				if (crVidUrl) {
					URL.revokeObjectURL(crVidUrl);
					crVidUrl = null;
				}
				$cr.find('.fileCrd').removeClass('on').find('.fic').html(crVidDefFic);
				$cr.find('.pvwVid .vidWrp').html(crVidDefWrp);
			});
		}

		//audio: single upload, playable card preview
		if ($('#auFile').length) {
			var crAudUrl = null;
			var crAudEl = null;
			var crAudDefFic = $cr.find('.fileCrd .fic').html();
			function crAudTime(theS) {
				theS = Math.max(0, Math.floor(theS || 0));
				return Math.floor(theS / 60) + ':' + ('0' + (theS % 60)).slice(-2);
			}
			function crAudStop() {
				if (crAudEl) {
					crAudEl.pause();
					crAudEl.src = '';
					crAudEl = null;
				}
				if (crAudUrl) {
					URL.revokeObjectURL(crAudUrl);
					crAudUrl = null;
				}
				$cr.find('.pvwAud .ply').removeClass('on');
			}
			$cr.on('change', '#auFile', function() {
				var theFile = this.files && this.files[0];
				this.value = '';
				if (!theFile) return;
				var $fld = $cr.find('.fileReq');
				if (!/^audio\//.test(theFile.type) && !/\.(mp3|m4a|aac|wav|ogg|flac|aiff)$/i.test(theFile.name)) {
					crFileErr($fld, 'Please choose an audio file (MP3, M4A, WAV, etc.).');
					return;
				}
				if (theFile.size > 20 * 1048576) {
					crFileErr($fld, 'That file is too large (max 20 MB).');
					return;
				}
				crFileErr($fld, '');
				crAudStop();
				crAudUrl = URL.createObjectURL(theFile);
				crAudEl = new Audio();
				crAudEl.preload = 'metadata';
				crAudEl.src = crAudUrl;
				$fld.find('.fileCrd').addClass('on').find('.fnm').text(theFile.name).end().find('.fsz').text(crSizeTxt(theFile.size));
				$cr.data('audName', theFile.name);
				$cr.find('.pvwAudFn').text(theFile.name);
				$cr.find('.pvwAud .fil').css('width', '0%');
				$cr.find('.pvwAud .at1').text('0:00');
				$cr.find('.pvwAud .at2').text('0:00');
				crAudEl.addEventListener('loadedmetadata', function() {
					if (crAudEl && isFinite(crAudEl.duration)) {
						$cr.find('.pvwAud .at2').text(crAudTime(crAudEl.duration));
					}
				});
				crAudEl.addEventListener('timeupdate', function() {
					if (!crAudEl) return;
					var thePc = crAudEl.duration ? (crAudEl.currentTime / crAudEl.duration) * 100 : 0;
					$cr.find('.pvwAud .fil').css('width', Math.min(100, thePc) + '%');
					$cr.find('.pvwAud .at1').text(crAudTime(crAudEl.currentTime));
				});
				crAudEl.addEventListener('ended', function() {
					$cr.find('.pvwAud .ply').removeClass('on');
				});
				crPreview();
			});
			$cr.on('click', '.pvwAud .ply', function(e) {
				e.preventDefault();
				if (!crAudEl) return;
				if (crAudEl.paused) {
					crAudEl.play();
					$(this).addClass('on');
				} else {
					crAudEl.pause();
					$(this).removeClass('on');
				}
			});
			$cr.on('click', '.fileCrd .frm2', function(e) {
				e.preventDefault();
				crAudStop();
				$cr.removeData('audName');
				$cr.find('.fileCrd').removeClass('on').find('.fic').html(crAudDefFic);
				$cr.find('.pvwAudFn').text('welcome-message.mp3');
				$cr.find('.pvwAud .fil').css('width', '12%');
				$cr.find('.pvwAud .at1').text('0:00');
				$cr.find('.pvwAud .at2').text('0:28');
				crPreview();
			});
		}

		//google maps: suggestion picker + keyless embed preview
		if ($('#gmQ').length) {
			var crPlaces = [
				{ n: 'Empire State Building', a: '20 W 34th St, New York, NY 10001' },
				{ n: 'Central Park', a: 'New York, NY, USA' },
				{ n: 'Times Square', a: 'Manhattan, NY, USA' },
				{ n: 'Statue of Liberty', a: 'New York, NY, USA' },
				{ n: 'Brooklyn Bridge', a: 'New York, NY 10038' },
				{ n: 'Golden Gate Bridge', a: 'San Francisco, CA, USA' },
				{ n: 'Eiffel Tower', a: 'Paris, France' },
				{ n: 'Big Ben', a: 'London, United Kingdom' }
			];
			var crPinSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>';
			function crMapSug() {
				var theQ = $.trim($('#gmQ').val()).toLowerCase();
				var $lst = $cr.find('.sugLst').empty();
				var theN = 0;
				for (var i = 0; i < crPlaces.length && theN < 5; i++) {
					if (!theQ || (crPlaces[i].n + ' ' + crPlaces[i].a).toLowerCase().indexOf(theQ) > -1) {
						$lst.append('<li data-i="' + i + '"><span class="pic">' + crPinSvg + '</span><span class="ptx"><span class="pn">' + crEsc(crPlaces[i].n) + '</span><span class="pa">' + crEsc(crPlaces[i].a) + '</span></span></li>');
						theN++;
					}
				}
				$lst.toggleClass('on', theN > 0);
			}
			$cr.on('focusin', '#gmQ', crMapSug);
			$cr.on('input', '#gmQ', function() {
				$(this).removeAttr('data-sel');
				$cr.find('.okSel, .srchWrp .clr').removeClass('on');
				crMapSug();
			});
			$cr.on('click', '.sugLst li', function() {
				var thePl = crPlaces[$(this).data('i')];
				var theQ = encodeURIComponent(thePl.n + ', ' + thePl.a);
				$('#gmQ').val(thePl.n + ', ' + thePl.a).attr('data-sel', '1');
				$cr.find('.sugLst').removeClass('on');
				$cr.find('.okSel, .srchWrp .clr').addClass('on');
				$cr.find('.mapReq').children('small.error').remove();
				$cr.find('#gmQ').removeClass('error');
				$cr.find('.gmFrame').attr('src', 'https://www.google.com/maps?q=' + theQ + '&output=embed');
				$cr.find('.mapCrd .mnm').text(thePl.n);
				$cr.find('.mapCrd .madr').text(thePl.a);
				$cr.find('.mapCrd .vgm').attr('href', 'https://www.google.com/maps/search/?api=1&query=' + theQ);
			});
			$cr.on('click', '.srchWrp .clr', function(e) {
				e.preventDefault();
				$('#gmQ').val('').removeAttr('data-sel');
				$cr.find('.okSel, .srchWrp .clr, .sugLst').removeClass('on');
			});
			$(document).on('click', function(e) {
				if (!$(e.target).closest('.srchWrp, .sugLst').length) {
					$cr.find('.sugLst').removeClass('on');
				}
			});
		}

		//event: clear the end-time error on change, show the device time zone
		if ($('#evStD').length) {
			$cr.on('change', '#evStD, #evStT, #evEnD, #evEnT', function() {
				$cr.find('.endChk').children('small.error').remove();
			});
			try {
				var theTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
				if (theTz) {
					$cr.find('.tzNm').text(theTz.replace(/_/g, ' '));
				}
			} catch (e) {}
		}

		//feedback link: prefill the protocol on focus, clear it back on blur
		if ($('#fbUrl').length) {
			$cr.on('focusin', '#fbUrl', function() {
				var theV = $.trim(this.value);
				if (!/^https:\/\//i.test(theV)) {
					this.value = 'https://' + theV.replace(/^https?:\/\//i, '');
					$(this).trigger('input');
				}
			});
			$cr.on('focusout', '#fbUrl', function() {
				if ($.trim(this.value).toLowerCase() === 'https://') {
					this.value = '';
					$(this).trigger('input');
				}
			});
		}

		//whatsapp / sms: suggest the visitor's country code
		var $crCc = $('#waCc, #smsCc, #telCc');
		if ($crCc.length) {
			var theReg = ((navigator.language || '').split('-')[1] || '').toUpperCase();
			var $theOpt = $crCc.first().find('option[data-reg="' + theReg + '"]').first();
			if ($theOpt.length) {
				$crCc.val($theOpt.attr('value'));
			}
		}

		//image gallery: multi-upload, reorder, live preview
		if ($('#imFiles').length) {
			var crImgs = [];
			var crGalDef = ['assets/images/create2_pvw_sunset.jpg', 'assets/images/create2_pvw_cafe.jpg', 'assets/images/create2_pvw_food.jpg', 'assets/images/create2_pvw_team.jpg', 'assets/images/create2_pvw_portrait.jpg', 'assets/images/create2_pvw_video.jpg'];
			var crGalIx = 0;
			var crDragIx = -1;
			var crTouchX = null;
			function crGalList() {
				return crImgs.length ? crImgs : crGalDef;
			}
			function crGalRender() {
				var theLst = crGalList();
				if (crGalIx >= theLst.length) {
					crGalIx = 0;
				}
				$cr.find('.pvwGal .cvw > img').attr('src', theLst[crGalIx]);
				$cr.find('.pvwGal .cntr').text((crGalIx + 1) + ' / ' + theLst.length);
				$cr.find('.pvwCmp .bar .tmb img').attr('src', theLst[0]);
				var $ths = $cr.find('.pvwGal .thumbs').empty();
				for (var i = 0; i < theLst.length && i < 5; i++) {
					$ths.append('<span class="th' + (i === crGalIx ? ' on' : '') + '" data-i="' + i + '"><img src="' + theLst[i] + '" alt=""></span>');
				}
				if (theLst.length > 5) {
					$ths.append('<span class="th more"><span>+' + (theLst.length - 5) + '</span></span>');
				}
				$cr.find('.pvwGal .nv').toggle(theLst.length > 1);
			}
			function crImgForm() {
				$cr.find('.imgGrd .tmb2').remove();
				var $add = $cr.find('.imgGrd .addTile');
				for (var i = 0; i < crImgs.length; i++) {
					$add.before('<li class="tmb2" draggable="true" data-i="' + i + '"><img src="' + crImgs[i] + '" alt=""><a href="#" class="rmv2" aria-label="Remove image"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></a></li>');
				}
				var theFull = crImgs.length >= 10;
				$add.toggle(crImgs.length > 0).toggleClass('off', theFull);
				$cr.find('.upl.blu').toggleClass('off', theFull);
				$cr.find('.imgCnt').text(crImgs.length + '/10');
				if (crImgs.length) {
					$cr.find('.imgReq').children('small.error').remove();
				}
				crGalIx = 0;
				crGalRender();
			}
			$cr.on('change', '#imFiles', function() {
				var theFiles = this.files || [];
				var thePick = [];
				for (var i = 0; i < theFiles.length && crImgs.length + thePick.length < 10; i++) {
					if (theFiles[i].size <= 5 * 1048576) {
						thePick.push(theFiles[i]);
					}
				}
				this.value = '';
				var thePend = thePick.length;
				if (!thePend || !window.FileReader) return;
				$.each(thePick, function(j, theFile) {
					var theReader = new FileReader();
					theReader.onload = function(ev) {
						crImgs.push(ev.target.result);
						if (!--thePend) {
							crImgForm();
						}
					};
					theReader.readAsDataURL(theFile);
				});
			});
			$cr.on('click', '.imgGrd .rmv2', function(e) {
				e.preventDefault();
				crImgs.splice($(this).closest('.tmb2').data('i'), 1);
				crImgForm();
			});
			$cr.on('dragstart', '.imgGrd .tmb2', function() {
				crDragIx = $(this).data('i');
			});
			$cr.on('dragover', '.imgGrd .tmb2', function(e) {
				e.preventDefault();
			});
			$cr.on('drop', '.imgGrd .tmb2', function(e) {
				e.preventDefault();
				var theTo = $(this).data('i');
				if (crDragIx < 0 || theTo === crDragIx) return;
				var theMoved = crImgs.splice(crDragIx, 1)[0];
				crImgs.splice(theTo, 0, theMoved);
				crDragIx = -1;
				crImgForm();
			});
			$cr.on('click', '.pvwGal .nv', function(e) {
				e.preventDefault();
				var theN = crGalList().length;
				crGalIx = (crGalIx + ($(this).hasClass('galNxt') ? 1 : theN - 1)) % theN;
				crGalRender();
			});
			$cr.on('click', '.pvwGal .thumbs .th[data-i]', function() {
				crGalIx = $(this).data('i');
				crGalRender();
			});
			$cr.on('touchstart', '.pvwGal .cvw', function(e) {
				crTouchX = e.originalEvent.touches[0].clientX;
			});
			$cr.on('touchend', '.pvwGal .cvw', function(e) {
				if (crTouchX === null) return;
				var theDx = e.originalEvent.changedTouches[0].clientX - crTouchX;
				crTouchX = null;
				if (Math.abs(theDx) > 40) {
					var theN = crGalList().length;
					crGalIx = (crGalIx + (theDx < 0 ? 1 : theN - 1)) % theN;
					crGalRender();
				}
			});
			crGalRender();
		}

		//wifi: open networks hide + unrequire the password
		$cr.find('#wfSec').on('change', function() {
			var $fld = $cr.find('.fldPass');
			if ($(this).val() === 'nopass') {
				$fld.find('input').removeAttr('data-req').removeClass('error');
				$fld.find('small.error').remove();
				$fld.stop(true, true).slideUp(200);
			} else {
				$fld.find('input').attr('data-req', 'text');
				$fld.stop(true, true).slideDown(200);
			}
			crPreview();
		});
		$cr.find('#wfHidden').on('change', crPreview);

		//validation, no errors until Next is clicked
		function crUrlOk(theVal) {
			return /^https?:\/\/[^\s]+\.[^\s]{2,}/i.test($.trim(theVal));
		}
		function crCheck($in) {
			var theVal = $.trim($in.val());
			var theType = $in.attr('data-req') || $in.attr('data-opt');
			var ok = theType === 'url' ? crUrlOk(theVal) : theVal.length > 0;
			if (theType === 'wap') {
				var theDigits = theVal.replace(/\D/g, '');
				ok = theDigits.length >= 5 && theDigits.length <= 14 && theVal.indexOf('+') === -1;
			}
			if (theType === 'eml') {
				ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(theVal);
			}
			if (theType === 'urls') {
				ok = /^https:\/\//i.test(theVal) && crUrlOk(theVal);
			}
			if (theType === 'tel') {
				var theTd = theVal.replace(/\D/g, '');
				ok = theTd.length >= 5 && theTd.length <= 15;
			}
			//optional fields only validate once something is entered
			if (!$in.attr('data-req') && (!theVal || theVal === 'https://')) {
				ok = true;
			}
			var $row = $in.closest('.row');
			if (ok) {
				$in.removeClass('error');
				$row.find('small.error').remove();
			} else {
				$in.addClass('error');
				if (!$row.find('small.error').length) {
					$row.append('<small class="error">' + $in.attr('data-msg') + '</small>');
				}
			}
			return ok;
		}
		$cr.on('input change', '[data-req].error, [data-opt].error', function() {
			crCheck($(this));
		});
		//app link page: at least one valid store URL
		function crGrpOk() {
			var ok = false;
			$cr.find('.grpReq .grpIn').each(function() {
				var theVal = $.trim($(this).val());
				if (!theVal || theVal === 'https://') return;
				var theType = $(this).attr('data-opt') || 'text';
				var good = true;
				if (theType === 'url') good = crUrlOk(theVal);
				if (theType === 'urls') good = /^https:\/\//i.test(theVal) && crUrlOk(theVal);
				if (theType === 'eml') good = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(theVal);
				if (theType === 'tel') good = theVal.replace(/\D/g, '').length >= 5;
				if (good) {
					ok = true;
				}
			});
			return ok;
		}
		function crGrpErrSync(show) {
			var $grp = $cr.find('.grpReq');
			if (!$grp.length) return true;
			if (crGrpOk()) {
				$grp.children('small.error').remove();
				return true;
			}
			if (show && !$grp.children('small.error').length) {
				$grp.append('<small class="error">' + $grp.attr('data-msg') + '</small>');
			}
			return false;
		}
		$cr.on('input', '.grpReq .grpIn', function() {
			if ($cr.find('.grpReq').children('small.error').length) {
				crGrpErrSync(false);
			}
		});
		//social media page: at least one selected platform with a filled (valid) field
		function crSocOk() {
			var ok = false;
			$cr.find('.socReq .socFlds .fld.on input').each(function() {
				var theVal = $.trim($(this).val());
				if (!theVal || theVal === 'https://') return;
				if (!$(this).hasClass('inUrl') || crUrlOk(theVal)) {
					ok = true;
				}
			});
			return ok;
		}
		function crSocErrSync(show) {
			var $soc = $cr.find('.socReq');
			if (!$soc.length) return true;
			if (crSocOk()) {
				$soc.children('small.error').remove();
				return true;
			}
			if (show && !$soc.children('small.error').length) {
				$soc.append('<small class="error">' + $soc.attr('data-msg') + '</small>');
			}
			return false;
		}
		$cr.on('input', '.socReq .socFlds input', function() {
			if ($cr.find('.socReq').children('small.error').length) {
				crSocErrSync(false);
			}
		});
		$cr.find('.ftr .btnNext').on('click', function(e) {
			e.preventDefault();
			var $bad = $();
			$cr.find('[data-req], [data-opt]').each(function() {
				if (!crCheck($(this))) {
					$bad = $bad.add(this);
				}
			});
			var socOk = crSocErrSync(true);
			var grpOk = crGrpErrSync(true);
			var imgOk = true;
			var $imr = $cr.find('.imgReq');
			if ($imr.length) {
				imgOk = $cr.find('.imgGrd .tmb2').length > 0;
				if (imgOk) {
					$imr.children('small.error').remove();
				} else if (!$imr.children('small.error').length) {
					$imr.append('<small class="error">' + $imr.attr('data-msg') + '</small>');
				}
			}
			var fileOk = true;
			var $flr = $cr.find('.fileReq');
			if ($flr.length) {
				fileOk = $flr.find('.fileCrd.on').length > 0;
				if (fileOk) {
					$flr.children('small.error').remove();
				} else if (!$flr.children('small.error').length) {
					$flr.append('<small class="error">' + $flr.attr('data-msg') + '</small>');
				}
			}
			var mapOk = true;
			var $mpr = $cr.find('.mapReq');
			if ($mpr.length) {
				mapOk = $('#gmQ').attr('data-sel') === '1';
				if (mapOk) {
					$mpr.children('small.error').remove();
				} else if (!$mpr.children('small.error').length) {
					$mpr.append('<small class="error">' + $mpr.attr('data-msg') + '</small>');
				}
			}
			var endOk = true;
			var $enr = $cr.find('.endChk');
			if ($enr.length) {
				var theSd4 = $('#evStD').val();
				var theSt4 = $('#evStT').val();
				var theEd4 = $('#evEnD').val();
				var theEt4 = $('#evEnT').val();
				if ((theEd4 || theEt4) && theSd4 && theSt4) {
					var theS5 = new Date(theSd4 + 'T' + theSt4);
					var theE5 = new Date((theEd4 || theSd4) + 'T' + (theEt4 || '23:59'));
					endOk = theE5.getTime() > theS5.getTime();
				}
				if (endOk) {
					$enr.children('small.error').remove();
				} else if (!$enr.children('small.error').length) {
					$enr.append('<small class="error">' + $enr.attr('data-msg') + '</small>');
				}
			}
			if (!$bad.length && socOk && grpOk && imgOk && fileOk && mapOk && endOk) {
				if (typeof fireModal === 'function') {
					fireModal('modal_join.html');
				}
				return;
			}
			if (!$bad.length && !imgOk) {
				$cr.find('.imgReq .upl')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}
			if (!$bad.length && !fileOk) {
				$cr.find('.fileReq .upl')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}
			if (!$bad.length && !mapOk) {
				$('#gmQ')[0].focus({ preventScroll: true });
				$('#gmQ')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}
			if (!$bad.length && !endOk) {
				$('#evEnD')[0].focus({ preventScroll: true });
				$('#evEnD')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}
			if (!$bad.length && !socOk) {
				$cr.find('.socReq .socGrd')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}
			if (!$bad.length && !grpOk) {
				var theGrpIn = $cr.find('.grpReq .grpIn').first();
				crOpenAcc(theGrpIn.closest('.acc'));
				setTimeout(function() {
					theGrpIn[0].focus({ preventScroll: true });
					theGrpIn[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				}, 240);
				return;
			}
			var theFirst = $bad.first();
			crOpenAcc(theFirst.closest('.acc'));
			setTimeout(function() {
				theFirst[0].focus({ preventScroll: true });
				theFirst[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 240);
		});

		//keyboard: unstick the bottom nav so it never covers the active field
		$(document).on('focusin', '#mainCreate.createMob2 input, #mainCreate.createMob2 textarea', function() {
			$('body').addClass('crKb');
		}).on('focusout', '#mainCreate.createMob2 input, #mainCreate.createMob2 textarea', function() {
			setTimeout(function() {
				$('body').toggleClass('crKb', $(document.activeElement).is('input, textarea'));
			}, 80);
		});
	}

});