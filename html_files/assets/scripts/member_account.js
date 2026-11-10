$(document).ready(function() {

	/* Member Account (member_myaccount.html + member_billing.html)
	--------------------------------------------------------------*/
	var $acc = $('#mainApp.accApp');
	if (!$acc.length) {
		return;
	}

	/* Tabs - jump to the matching card
	--------------------------------------------------------------*/
	var hlTimer;
	function accShowTab($tab, scroll) {
		var $crd = $($tab.attr('href'));
		if (!$crd.length) {
			return;
		}
		$acc.find('.accTabs a').removeClass('cur').removeAttr('aria-current');
		$tab.addClass('cur').attr('aria-current', 'true');
		if (scroll) {
			$crd[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
			$acc.find('.accCrd').removeClass('hl');
			$crd.addClass('hl');
			clearTimeout(hlTimer);
			hlTimer = setTimeout(function() {
				$crd.removeClass('hl');
			}, 1400);
		}
	}
	$acc.find('.accTabs a').on('click', function(e) {
		e.preventDefault();
		accShowTab($(this), true);
	});
	if (window.location.hash) {
		var $hashTab = $acc.find('.accTabs a').filter(function() {
			return $(this).attr('href') === window.location.hash;
		});
		if ($hashTab.length) {
			accShowTab($hashTab.first(), false);
		}
	}

	/* Confirm panels - delete account / cancel subscription
	   First click only opens the panel, the panel's own form does the action
	--------------------------------------------------------------*/
	function accCnfToggle($crd, open) {
		var $cnf = $crd.find('.accCnf');
		var $word = $cnf.find('[data-match]');
		$crd.toggleClass('cnfOn', open);
		$crd.find('[data-cnf="open"]').attr('aria-expanded', open ? 'true' : 'false');
		if ($word.length) {
			$word.val('');
			$cnf.find('[type="submit"]').prop('disabled', true);
		}
		if (open) {
			$cnf[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			if ($word.length) {
				$word.trigger('focus');
			} else {
				$cnf.find('[data-cnf="close"]').trigger('focus');
			}
		} else {
			$crd.find('[data-cnf="open"]').trigger('focus');
		}
	}
	$acc.on('click', '[data-cnf]', function(e) {
		e.preventDefault();
		accCnfToggle($(this).closest('.accCrd'), $(this).attr('data-cnf') === 'open');
	});
	$acc.on('keydown', '.accCnf', function(e) {
		if (e.key === 'Escape') {
			accCnfToggle($(this).closest('.accCrd'), false);
		}
	});
	//typed word unlocks the delete button
	$acc.on('input', '.accCnf [data-match]', function() {
		var match = $.trim($(this).val()).toUpperCase() === $(this).attr('data-match');
		$(this).closest('.accCnf').find('[type="submit"]').prop('disabled', !match);
	});
	//enter in the word field must not submit while the button is locked
	$acc.on('submit', '.accCnf', function(e) {
		if ($(this).find('[type="submit"]').prop('disabled')) {
			e.preventDefault();
		}
	});

	/* Profile form - validation + save feedback
	--------------------------------------------------------------*/
	var $frm = $acc.find('.accFrm');
	if ($frm.length && $.fn.validate) {
		$frm.validate({
			errorClass: 'error',
			errorElement: 'small',
			errorPlacement: function(error, element) {
				error.insertAfter(element);
			},
			rules: {
				firstName: { required: true },
				lastName: { required: true },
				email: { required: true, email: true },
				country: { required: true }
			},
			messages: {
				firstName: 'Please enter your first name.',
				lastName: 'Please enter your last name.',
				email: 'Please enter a valid email address.',
				country: 'Please select your country.'
			},
			submitHandler: function(form) {
				var $btn = $(form).find('[type="submit"]');
				$(form).find('.accMsg').removeClass('show');
				$btn.addClass('busy');
				//placeholder: replace this timeout with the account update request,
				//then show .accMsg.ok or .accMsg.err from its response
				setTimeout(function() {
					$btn.removeClass('busy');
					$(form).find('.accMsg.ok').addClass('show');
				}, 700);
				return false;
			}
		});
		$frm.on('input change', 'input, select', function() {
			$frm.find('.accMsg').removeClass('show');
		});
	}

});
