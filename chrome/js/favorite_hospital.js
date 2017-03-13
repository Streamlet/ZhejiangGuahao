$(function() {
	var title = $('.m_c .m_right h3').text();
	var url = window.location.href.split('?')[0];
	chrome.storage.sync.get({
		'favorites': {}
	}, function(items) {
		if (items['favorites'][url]) {
			$('.m_c .m_right h3').append(
				$('<span>').html('&nbsp;')
			).append(
				$('<button>').text('已收藏到浙江挂号助手').attr('disabled', true)
			);
		} else {
			$('.m_c .m_right h3').append(
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
