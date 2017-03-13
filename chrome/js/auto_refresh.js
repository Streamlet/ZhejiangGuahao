$(function () {
	var stop_refresh = function () {
		chrome.storage.sync.remove('auto_refresh');
		$('.stop_refresh').remove();
	};

	var do_auto_refresh = function (refresh_id) {
		var refresh_info = refresh_id.split('-');
		var cell = null;
		$('td[data-type=per] form').each(function (i, e) {
			if ($(e).children('input[name=hosId]').val() === refresh_info[0]
				&& $(e).children('input[name=deptId]').val() === refresh_info[1]
				&& $(e).children('input[name=docId]').val() === refresh_info[2]
				&& $(e).children('input[name=orderDate]').val() === refresh_info[3]
				&& ($(e).children('input[name=resTimeSign]').val() || '') === refresh_info[4]
			) {
				cell = $(e);
			}
		});
		if (!cell || cell.length === 0) {
			return;
		}

		var continue_refresh = function () {
			cell.children('span.cz').css('padding', '7px 0');
			cell.children('input.btnyy').css('height', '30px');
			cell.append($('<button>').attr('class', 'stop_refresh').text('停止刷'));
			$('.stop_refresh').click(function () {
				cell.children('span.cz').css('padding', '17px 0');
				cell.children('input.btnyy').css('height', '50px');
				stop_refresh();
			});
			setTimeout(function () {
				window.location.reload(true);
			}, 1000);
		};
		if (cell.children('span').hasClass('ym')) {
			// 约满
			stop_refresh();
		} else if (cell.children('input[type=submit]').hasClass('btnyy')) {
			cell.children('input[type=submit]').trigger('click');
			//(function () {
			//	var self = arguments.callee;
			//	if ($('.ksorder_djgh_dr1 .ksorder_dr1_dl').length > 0) {
			//		chrome.storage.sync.get({
			//			'info': {}
			//		}, function(items) {
			//			var info = items['info'];
			//			var matched = [];
			//			$('.ksorder_djgh_dr1').each(function (i, e) {
			//				var this_matched = true;
			//				if (info['doctor-type']) {
			//					var doctor_type = $(e).find('.ksorder_dr1_dl dd h4').text();
			//					try {
			//						if (!new RegExp(info['doctor-type']).test(doctor_type)) {
			//							this_matched = false;
			//						}
			//					} catch (e) {
			//						if (doctor_type.indexOf(info['doctor-type']) >= 0) {
			//							this_matched = false;
			//						}
			//					}
			//				}
			//				if (info['doctor-desc']) {
			//					var doctor_desc = $(e).find('.ksorder_dr1_dl dd p').text();
			//					try {
			//						if (!new RegExp(info['doctor-desc']).test(doctor_desc)) {
			//							this_matched = false;
			//						}
			//					} catch (e) {
			//						if (doctor_desc.indexOf(info['doctor-desc']) >= 0) {
			//							this_matched = false;
			//						}
			//					}
			//				}
			//				if (this_matched) {
			//					matched.push(i);
			//				}
			//			});

			//			if (matched.length > 0) {
			//				stop_refresh();
			//				if (matched.length === 1 || info['auto-choose-doctor']) {
			//					window.location = $('.ksorder_djgh_dr1:nth-child(' + (matched[0] + 1) + ') .ksorder_dr1_p2 a.ksorder_dr1_syhy').attr('href');
			//				}
			//			} else {
			//				continue_refresh();
			//			}

			//		});

			//	} else {
			//		setTimeout(self, 100);
			//	}
			//})();
		} else {
			continue_refresh();
		}
	};

	var show_auto_refresh_buttons = function () {
		$('td[data-type=per] form').each(function (i, e) {
			if ($(e).children('span').hasClass('cz') || $(e).children('input').hasClass('btnyy')) {
				$(e).children('span.cz').css('padding', '7px 0');
				$(e).children('input.btnyy').css('height', '30px');
				var refresh_id = [
					$(e).children('input[name=hosId]').val(),		// 医院
					$(e).children('input[name=deptId]').val(),		// 科室
					$(e).children('input[name=docId]').val(),		// 医生
					$(e).children('input[name=orderDate]').val(),	// 日期
					$(e).children('input[name=resTimeSign]').val()	// 午别，0=上午，1=下午
				].join('-');
				$(e).append(
					$('<button>').attr('id', refresh_id).attr('class', 'auto_refresh').text('自动刷')
				);
			}
		});
		$('.auto_refresh').click(function (e) {
			var login_link_text = $($('.userhelp p b a')[1]).text();
			if (login_link_text != '用户中心') {
				alert('请先登录，以免刷到号后耽误填写速度。');
			} else {
				$('.auto_refresh').attr('disabled', 'disabled');
				var refresh_id = $(this).attr('id');
				chrome.storage.sync.set({
					'auto_refresh': refresh_id,
				}, function () {
					$('.auto_refresh').remove();
					do_auto_refresh(refresh_id);
				});
			}
		});
	}

	chrome.storage.sync.get({
		'auto_refresh': false
	}, function (items) {
		var refresh_id = items['auto_refresh'];
		if (refresh_id) {
			do_auto_refresh(refresh_id);
		} else {
			show_auto_refresh_buttons();
		}
	});

});