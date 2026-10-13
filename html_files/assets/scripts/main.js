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
		function crSetImg(theSrc) {
			$cr.find('img.pvwImg').each(function() {
				$(this).attr('src', theSrc || $(this).data('def'));
			});
		}
		$cr.on('change', '.upl input[type=file]:not([multiple])', function() {
			var theFile = this.files && this.files[0];
			var $bd = $(this).closest('.bd');
			if (!theFile || !window.FileReader) return;
			var theReader = new FileReader();
			theReader.onload = function(ev) {
				$bd.find('.uplPrv').addClass('on').find('img').attr('src', ev.target.result);
				crSetImg(ev.target.result);
			};
			theReader.readAsDataURL(theFile);
		});
		$cr.on('click', '.uplPrv .rmv', function(e) {
			e.preventDefault();
			var $bd = $(this).closest('.bd');
			$bd.find('.uplPrv').removeClass('on').find('img').removeAttr('src');
			$bd.find('input[type=file]').val('');
			crSetImg(null);
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
						$dts.append($('<i>').css('background', crSocColors[theCols[i]]));
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
						$lnks.append('<div class="lrow">' + crLnkSvg + '<span class="tx">' + crEsc(theRows[i]) + '</span>' + crChvSvg + '</div>');
					}
				} else {
					$lnks.html(crMlLnksDef);
				}
				var theSel2 = crSocSel();
				var $socs = $cr.find('.pvwMl .socs');
				if (theSel2.length) {
					$socs.empty();
					for (var j = 0; j < theSel2.length; j++) {
						$socs.append('<div class="lrow"><i class="dot" style="background:' + crSocColors[theSel2[j]] + ';"></i><span class="tx">' + crSocNames[theSel2[j]] + '</span>' + crChvSvg + '</div>');
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
		$cr.on('input', '#siteUrl, #vcFirst, #vcLast, #vcRole, #vcSummary, #mlTitle, #mlDesc, #smHeadline, #smDesc, #mnTitle, #mnCat, #wfSsid, #imTitle, #waMsg, .lnkNme, .mnPrc, .mnDsc', crPreview);

		//whatsapp: suggest the visitor's country code
		if ($('#waCc').length) {
			var theReg = ((navigator.language || '').split('-')[1] || '').toUpperCase();
			var $theOpt = $('#waCc option[data-reg="' + theReg + '"]').first();
			if ($theOpt.length) {
				$('#waCc').val($theOpt.attr('value'));
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
				crGalIx = (crGalIx + ($(this).hasClass('nxt') ? 1 : theN - 1)) % theN;
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
				if (theVal && theVal !== 'https://' && crUrlOk(theVal)) {
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
			if (!$bad.length && socOk && grpOk && imgOk) {
				if (typeof fireModal === 'function') {
					fireModal('modal_join.html');
				}
				return;
			}
			if (!$bad.length && !imgOk) {
				$cr.find('.imgReq .upl')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}
			if (!$bad.length && !socOk) {
				$cr.find('.socReq .socGrd')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}
			if (!$bad.length && !grpOk) {
				var theGrpIn = $cr.find('.grpReq .grpIn').first();
				theGrpIn[0].focus({ preventScroll: true });
				theGrpIn[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
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