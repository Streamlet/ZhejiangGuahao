$(function () {
	var query_string = {};
	var params = window.location.search.split('?')[1].split('&');
	for (var i in params) {
		var kv = params[i].split('=');
		query_string[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
	}
	chrome.storage.sync.get({
		'auto_refresh': false
	}, function (items) {
		var refresh_id = items['auto_refresh'];
		if (!refresh_id) {
			return;
		}
		var refresh_info = refresh_id.split('-');
		if (query_string['hosId'] !== refresh_info[0]
			|| query_string['deptId'] !== refresh_info[1]
			|| query_string['docId'] !== refresh_info[2]
			|| query_string['orderDate'] !== refresh_info[3]
			|| query_string['resTimeSign'] !== refresh_info[4]
		) {
			return;
		}

		chrome.storage.sync.get({
			'info': {
				'time-prefer': 'first'
			}
		}, function (items) {
			var info = items['info'];

			if (info['time-prefer'] === 'first') {
				$('input[type=radio]:first').trigger('click');
			} else if (info['time-prefer'] === 'last') {
				$('input[type=radio]:last').trigger('click');
			}

			// $('input[type=button].btnNext').trigger('click');
			// $('input[type=button].btn_return[value=确认]').trigger('click');
			chrome.storage.sync.remove('auto_refresh');
		});
	});
});