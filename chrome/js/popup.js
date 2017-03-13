$(function() {
	var init_info = function (info) {
		console.log(info['time-prefer'] );
		$('#time-prefer-first').attr('checked', info['time-prefer'] === 'first');
		$('#time-prefer-last').attr('checked', info['time-prefer'] === 'last');
	};
	var init_favorites = function (favorites) {
		$('#favorites').empty();
		if (!$.isEmptyObject(favorites)) {
			for (var url in favorites) {
				$('#favorites').append(
					$('<span>').append(
						$('<button>').addClass('link').addClass('opentab').attr('href', url).text(favorites[url])
					).append(
						$('<button>').addClass('delete').text('删除').attr('data-url', url)
					)
				);
			}
		} else {
			$('#favorites').append(
				$('<p>').text('您还没有任何收藏')
			).append(
				$('<span>').text('请访问')
			).append(
				$('<a>').addClass('link').addClass('opentab').attr('href', 'http://www.zj12580.cn').text('浙江省预约挂号平台')
			).append(
				$('<span>').text('官方网站来查找适合您的医院和科室')
			);
		}
		init_links($('#favorites'));
		init_buttonset($('#favorites'));
		$('.delete').click(function() {
			var url = $(this).attr('data-url');
			chrome.storage.sync.get({
				'favorites': {}
			}, function(items) {
				delete items['favorites'][url];
				chrome.storage.sync.set({
					'favorites': items['favorites']
				}, function () {
					init_favorites(items['favorites']);
				});
			});
		});
	};
	chrome.storage.sync.get({
		'info': {},
		'favorites': {}
	}, function(items) {
		init_info(items['info']);
		init_favorites(items['favorites']);
	});

	$('#save').click(function() {
		chrome.storage.sync.set({
			'info' : {
				'time-prefer': $('.time-prefer:checked').val(),
			}
		}, function() {
			close();
		});
	});
	$('#delete').click(function() {
		chrome.storage.sync.remove('info', function() {
			close();
		})
	});
	$('#privacy').click(function() {
		alert($(this).attr('title'));
	});

	$('#stop').click(function () {
		chrome.storage.sync.remove('auto_refresh', function () {
			close();
		})
	});

	window.onload = function () {
		chrome.storage.sync.get({
			'tab': '#about',
		}, function (items) {
			$('div.tabs ul li a[href=' + items['tab'] +']').trigger('click');
		})
	};
	$('div.tabs ul li a').click(function () {
		chrome.storage.sync.set({
			'tab': $(this).attr('href'),
		}, function () {

		})
	});

	init_ui();
});