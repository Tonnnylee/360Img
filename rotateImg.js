function Img3dEvent (vm) {
	return new Promise(function (resolve, reject) {
		var hasTouch = 'ontouchstart' in window,
		  startEvent = hasTouch ? 'touchstart' : 'mousedown',
		  moveEvent = hasTouch ? 'touchmove' : 'mousemove',
		  endEvent = hasTouch ? 'touchend' : 'mouseup';

		var proPlayer = {};
		proPlayer.id = '3dplayer';
		proPlayer.canvasIndex = 1;
		proPlayer.debug = false;
		proPlayer.width = 500;
		proPlayer.height = 333;
		proPlayer.banner = '';
		proPlayer.load = function () {
			proPlayer.init_debug();
			//set banner
			var banner = '<div><img src="' + proPlayer.banner + '" alt=""></div>';
			$('#' + proPlayer.id).before(banner);
			//set attr
			var screenWidth = $(document).width();
			proPlayer.width = $('#' + proPlayer.id).attr('data-width');
			proPlayer.height = $('#' + proPlayer.id).attr('data-height');
			proImg.path = $('#' + proPlayer.id).attr('data-path');
			if (screenWidth > 992) {
				proPlayer.width = 400;
				proPlayer.height = 400;
				$(".d3_img").css("top","450px").css("left","50px")
			}else{
				$(".d3_img").css("top","350px").css("left","0px")
			}
			// preload images
			proImg.preloadImages(function (index, isCompleted) {
				if (isCompleted) {
					showTip('yes')
					proPlayer.init();
				} else {
					showTip(index);
				}
			});
		}
		//player init on image loaded
		proPlayer.init = function () {
			proPlayer.createControlPanel();
			controlPanel.setControlPanel();
			proPlayer.createCanvas().then((resolve) => {
				vm.isLoad = false;
				vm.ifD3img = true;
			});
				$('#3dplayer_1').show();
			}

			proPlayer.rotate = function () {
				var i = 1;
				var rotate = setInterval(function(){
					if(i=== 23){
						$("#3dplayer_1").show();
						$("#d3player_0").show();
						clearInterval(rotate);
					}
					$("#3dplayer canvas").hide();
					$("#3dplayer_"+i).show();
					$("#d3player_0").show();
					i++;
				},50)
			}
		proPlayer.createControlPanel = function () {
			var panel = '<canvas id="3dplayer_0" width="' + proPlayer.width + '" height="' + proPlayer.height + '" style="position: absolute;top:0;left:0;z-index:99;cursor:pointer"></canvas>'
			$('#' + proPlayer.id).prepend(panel)
		}

		proPlayer.init_debug = function () {
			if (proPlayer.debug)
				$('#' + proPlayer.id).before("<div>3d player <em id='playerTip'></em></div>")
		}

		proPlayer.turn = function (turnLeft) {
			turnLeft = turnLeft;
			var index = proPlayer.canvasIndex;
			if (turnLeft) {
				index--;
				if (index < 1)
					index = 23;
			} else {
				index++;
				if (index > 23)
					index = 1;
			}
			return index;
		}

		proPlayer.turnLeft = function () {
			var index = proPlayer.turn(false);
			proPlayer.show(index);
		}

		proPlayer.turnRight = function () {
			var index = proPlayer.turn(true);
			proPlayer.show(index);
		}

		proPlayer.show = function (index) {
			var preIndex = proPlayer.canvasIndex;
			var currIndex = index;
			$('#3dplayer_' + currIndex).show();
			$('#3dplayer_' + preIndex).hide();
			proPlayer.canvasIndex = index;
		}

		proPlayer.createCanvas = function () {
			//create canvas from img
			return new Promise((resolve,reject) => {
				for (var i = 1; i <= proImg.count + 1; i++) {
				 var canvas_id = "3dplayer_" + i
				 var canvas_str = '<canvas id="' + canvas_id + '" style="display: none;position: absolute;top:0;left:0;z-index:98;" width="' + proPlayer.width + '" height="' + proPlayer.height + '"></canvas>';
				 $('#' + proPlayer.id).append(canvas_str);
				 var canvas = document.getElementById(canvas_id);
				 var context = canvas.getContext('2d');
				 var imageObj = proImg.list[i];
				 context.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height, 0, 0, canvas.width, canvas.height);
				 if(i == proImg.count){
				   vm.isLoad = false;
				   resolve();
				 }
				}
			})
		}
		function showTip(txt) {
			if (proPlayer.debug)
				$('#playerTip').text(txt);
		}
		// product image controller
		var proImg = {};
		proImg.list = [];
		proImg.count = 23;
		proImg.completed = 0;
		proImg.path = '';
		proImg.preloadImages = function (callback) {
			for (var i = 1; i <= proImg.count; i++) {
				var url = proImg.path + i + '.jpg'
				var img = new Image();
				img.onload = function () {
					proImg.completed++;
					if (proImg.completed == proImg.count)
						callback(this, 1);
					else
						callback(proImg.completed, 0);
				}
				proImg.list[i] = img;
				img.src = url;
			}
		}

		var controlPanel = {};
		controlPanel.preX = 0;
		controlPanel.mousedown = false;
		controlPanel.speed = 15;
		controlPanel.setControlPanel = function () {
			var canvas = document.getElementById('3dplayer_0');
			document.addEventListener(startEvent, function () {
				controlPanel.mousedown = true;
				showTip('mousedown');
			}, false)
			document.addEventListener(endEvent, function () {
				controlPanel.mousedown = false;
				showTip('mouseup');
			})
			canvas.addEventListener(moveEvent, function (e) {
				if (controlPanel.mousedown) {
					vm.ifD3img = false;
					var x = e.clientX || e.touches[0].screenX;
					var preX = controlPanel.preX;
					showTip(preX + ':' + x);
					if (Math.abs(x - preX) >= controlPanel.speed) {
						controlPanel.callPlayer(preX, x);
						controlPanel.preX = x;
					}
				}
			}, false);
		}
		controlPanel.callPlayer = function (preX, currX) {
			if (preX > currX)
				proPlayer.turnLeft();
			else
				proPlayer.turnRight();
		}
		//begin exec load
		proPlayer.load();
		resolve();
	  })
}

export Img3dEvent;