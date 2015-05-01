$.fn.scrollFaker = function() {
	var $container = $(this);
	var $content = $container.find('.scroll-content');
	var $scrollGutter = $('<div class="scroll-gutter">');
	var $scrollSlider = $('<div class="scroll-slider">');
	var model, data = {};
	//初始化
	function init() {
		$scrollGutter.append($scrollSlider);
		$container.append($scrollGutter);
		computedModel();

		if(model.contentH > model.containerInnerH) {
			$scrollSlider.height(model.scrollSliderH);
			bindEvents();
		} else {
			$scrollGutter.hide();
		}
	}
	//计算模型
	function computedModel() {
		var containerH = $container.outerHeight();
		var containerInnerH = $container.height();
		var contentH = $content.outerHeight();
		var scrollGutterH = $scrollGutter.outerHeight();
		var scrollSliderH = containerInnerH / contentH * scrollGutterH;
		var scale = contentH / containerH;

		model = {
			containerH: containerH,
			containerInnerH: containerInnerH,
			contentH: contentH,
			scrollGutterH: scrollGutterH,
			scrollSliderH: scrollSliderH,
			scale: scale
		};
	}
	//绑定事件
	function bindEvents() {
		$container.mousewheel(function(e) {
			getSliderState();
			move(e.deltaY);
		});

		$container.mousedown(function() {
			if(data.isDown) {
				return false;
			}
		})

		$scrollSlider.mousedown(function(e) {
			data.isDown = true;
			data.mouseBegin = {
				x: e.pageX,
				y: e.pageY
			};
			getSliderState();

			$(document).on('mousemove', mouseMove);
		});

		$(document).mouseup(function() {
			$(document).off('mousemove', mouseMove);
			data.isDown = false;
		});

		function mouseMove(e) {
			data.mouseEnd = {
				x: e.pageX,
				y: e.pageY
			};
			var disY = data.mouseEnd.y - data.mouseBegin.y;

			move(disY);
		}

		function getSliderState() {
			data.scrollBegin = {
				x: $scrollSlider.offset().left,
				y: $scrollSlider.offset().top
			};
			data.threshold = {
				back: -data.scrollBegin.y,
				forward: model.scrollGutterH - model.scrollSliderH - data.scrollBegin.y
			};
		}
	}

	function move(sliderDis) {
		if(sliderDis > data.threshold.forward) {
			sliderDis = data.threshold.forward;
		} else if(sliderDis < data.threshold.back) {
			sliderDis = data.threshold.back;
		}

		var goPos = data.scrollBegin.y + sliderDis;

		$scrollSlider.css({'marginTop': goPos});
		$content.css({'marginTop': -goPos * model.scale});
	}

	init();
}