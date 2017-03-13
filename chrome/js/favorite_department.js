$(function() {
	var title = $('.left_box_1_con .p4').text() + '-' + $('.left_box_1_con .p2').text();
	var url = window.location.href.split('?')[0];
	chrome.storage.sync.get({
		'favorites': {}
	}, function(items) {
		if (items['favorites'][url]) {
			$('.left_box_1_con .p2').append(
				$('<span>').html('&nbsp;')
			).append(
				$('<button>').text('已收藏到浙江挂号助手').attr('disabled', true)
			);
		} else {
			$('.left_box_1_con .p2').append(
				$('<span>').html('&nbsp;')
			).append(
				$('<button>').text('收藏到浙江挂号助手').click(function () {
					add_favorite(url, title);
					$(this).text('已收藏到浙江挂号助手').attr('disabled', true);
				})
			);
		}
	});
});
