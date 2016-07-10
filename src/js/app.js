$(function() {
	var $galleryContainer = $('.gallery-container'),
		$gallery = $galleryContainer.find('.gallery'),
		$frame = $galleryContainer.find('.frame'),
		$slidee = $frame.children('ul').eq(0),
		$wrap = $frame.parent();

	$slidee.find('li').each(function() {
		var $frameItem = $(this);

		$frameItem.find('img').on('load', function() {
			setTimeout(function() {
				$frameItem.addClass('loaded');

				setTimeout(function() {
					$frameItem.find('.loading-balls').remove();
				}, 400);
			}, 500);
		});
	});

	$frame.sly({
		horizontal: 1,
		itemNav: 'basic',
		itemSelector: 'li',
		smart: 1,
		activateOn: 'click',
		mouseDragging: 1,
		touchDragging: 1,
		releaseSwing: 1,
		startAt: 0,
		scrollBar: $wrap.find('.scrollbar'),
		scrollBy: 0,
		pagesBar: $galleryContainer.next('.gallery-pages'),
		activatePageOn: 'click',
		speed: 300,
		elasticBounds: 1,
		easing: 'easeOutExpo',
		dragHandle: 1,
		dynamicHandle: 1,
		clickBar: 1,
		prevPage: $wrap.find('.prev'),
		nextPage: $wrap.find('.next')
	});

	var resizeItems = function() {
		var $items = $frame.find('ul li');
		var width = $galleryContainer.width();
		var height = (width / 4) * 3;

		$items.css('width', width);
		$items.add($frame, $galleryContainer).css('height', height);

		$frame.sly('reload');
	};

	resizeItems();

	var resizeTimeout;

	$(window).on('resize', function() {
		clearTimeout(resizeTimeout);

		resizeTimeout = setTimeout(function() {
			resizeItems();
		}, 25);
	});
});
