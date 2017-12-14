  //detect events
  var hasTouch = 'ontouchstart' in window,
	startEvent = hasTouch ? 'touchstart' : 'mousedown',
	moveEvent = hasTouch ? 'touchmove' : 'mousemove',
	endEvent = hasTouch ? 'touchend' : 'mouseup',
	cancelEvent = hasTouch ? 'touchcancel' : 'mouseup';

	var proPlayer = {};
	proPlayer.id = '3dplayer';
	proPlayer.canvasIndex=1;
	proPlayer.debug = false;
	proPlayer.width=500;
	proPlayer.height=333;
	proPlayer.banner = '';
	proPlayer.load = function(){
		proPlayer.init_debug();
		//set banner
		var banner = '<div><img src="'+proPlayer.banner+'" alt=""></div>';
	    $('#'+proPlayer.id).before(banner);
	  	//set attr
	  	proPlayer.width = $('#'+proPlayer.id).attr('data-width');
	  	proPlayer.height = $('#'+proPlayer.id).attr('data-height');
	  	//24张图片路径
	  	proImg.path = $('#'+proPlayer.id).attr('data-path');
	  	// preload images
	  	proImg.preloadImages(function(index,isCompleted){
	      if(isCompleted){
	        showTip('yes')
	        proPlayer.init();
	      }else{
	        showTip(index);
	      }
	   	});
	}
	//player init on image loaded
	proPlayer.init = function(){
		proPlayer.createControlPanel();
		//detect mouse event
		controlPanel.setControlPanel();
		//create Images canvas
		proPlayer.createCanvas();
		//show first image
		$('#3dplayer_1').show();
	  proPlayer.rotate();
	}

	proPlayer.rotate = function(){
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
    
    //触摸事件层
	proPlayer.createControlPanel=function(){
		var panel = '<canvas id="d3player_0" width="'+proPlayer.width+'" height="'+proPlayer.height+'" style="z-index:99"></canvas>'
		$('#'+proPlayer.id).prepend(panel)
	}

	proPlayer.init_debug = function(){
		if(proPlayer.debug)
			$('#'+proPlayer.id).before("<div>3d player <em id='playerTip'></em></div>")
	}

	proPlayer.turn = function(turn){
	  var turn = turn;
	  //一开始proPlayer.canvasIndex == 1
	  var index = proPlayer.canvasIndex;
	  if(turn){
	  	index--;
	    if(index<1)
	    	index=23;
	  }else{
	  	index++;
	    if(index>23)
	    	index=1;
	  }
	  return index;
	}

	proPlayer.turnLeft=function(){
		var index = proPlayer.turn(false);
	  proPlayer.show(index);
	}

	proPlayer.turnRight=function(){
		var index = proPlayer.turn(true);
	  proPlayer.show(index);
	}

	proPlayer.show = function(index){
		var preIndex = proPlayer.canvasIndex;
	    var currIndex = index;
	    $('#3dplayer_'+currIndex).show();
	    $('#3dplayer_'+preIndex).hide();
	    proPlayer.canvasIndex = index;
	}

	proPlayer.createCanvas = function(){
		//create canvas from img
		for(var i=1;i<=proImg.count;i++){
	  	var canvas_id = "3dplayer_"+i
	  	var canvas_str = '<canvas id="'+canvas_id+'" style="display: none;" width="'+proPlayer.width+'" height="'+proPlayer.height+'"></canvas>';
	    $('#'+proPlayer.id).append(canvas_str);
	    var canvas = document.getElementById(canvas_id);
	    var context = canvas.getContext('2d');
	    var imageObj = proImg.list[i];
	    context.drawImage(imageObj, 0, 0,imageObj.width,imageObj.height,0,0,canvas.width,canvas.height);
	  }
	}

	function showTip(txt){
		if(proPlayer.debug)
		$('#playerTip').text(txt);
	}

	// product image controller
	var proImg = {};
	proImg.list = [];
	proImg.count = 23;
	proImg.completed = 0;
	proImg.path = '';
	proImg.preloadImages = function(callback){
	  for(var i=1; i <=proImg.count; i++){
	  	var url = proImg.path + i + '.jpg'
	    var img = new Image();
	    img.onload = function(){
	    	proImg.completed++;
	      if(proImg.completed == proImg.count)
	      	callback(this,1);
	      else
	      	callback(proImg.completed,0);
	    }
	    proImg.list[i]=img;
	    img.src = url;
	  }
	}

	var controlPanel = {};
	controlPanel.preX = 0;
	controlPanel.mousedown=false;
	controlPanel.speed = 15;
	controlPanel.setControlPanel=function(){
		var canvas = document.getElementById('d3player_0');

		document.addEventListener(startEvent, function(){
			controlPanel.mousedown = true;
	    	showTip('mousedown');
		},false)
	    document.addEventListener(endEvent, function(){
	   		controlPanel.mousedown = false;
	    	showTip('mouseup');
	    })	  
	   canvas.addEventListener(moveEvent, function (e) {
	  		if(controlPanel.mousedown){
	      		var x = e.clientX || e.touches[0].screenX;
	            var preX = controlPanel.preX;
	            showTip(preX+':'+x);
	            //大于5才移动
	          if(Math.abs(x-preX)>=controlPanel.speed){
	          	controlPanel.callPlayer(preX,x);
	          	controlPanel.preX = x;
	          }
	        }     
	    }, false);
	}

	controlPanel.callPlayer = function(preX,currX){
		if(preX > currX)
	  	proPlayer.turnLeft();
	  else
	  	proPlayer.turnRight();
	}
	//begin exec load
	proPlayer.load();