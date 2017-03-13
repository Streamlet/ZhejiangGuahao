var init_buttonset = function (parent) {
	parent.find('button[class!=delete]').button().click(function (event) {
		event.preventDefault();
	});
	parent.find('button[class=delete]').button({
		text: false,
		icons: {
			primary: "ui-icon-close"
		}
	}).click(function (event) {
		event.preventDefault();
	}).parent().buttonset();
};

var init_links = function (parent) {
	parent.find('.opentab').click(function () {
		chrome.tabs.create({ url: $(this).attr('href') });
	});

};

var init_ui = function () {
	$('div.tabs').tabs();

	init_links($(document));
	init_buttonset($(document));
};

var add_favorite = function (url, title) {
	chrome.storage.sync.get({
		'favorites': {}
	}, function(items) {
		if (!items['favorites']) {
			items['favorites'] = {};
		}
		items['favorites'][url] = title;
		chrome.storage.sync.set({
			'favorites': items['favorites']
		}, function () {

		});
	});
};
