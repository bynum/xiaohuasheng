(function () {

	L.Text = L.Icon.extend({
		options: L.extend({}, new L.Icon.Default().options),

		initialize: function (options) {
			L.setOptions(this, options);
		},
		createIcon: function () {
			var r1hDiv = document.createElement('div');
			r1hDiv.className = 'icon-text-r1h';
			r1hDiv.innerHTML = this.options.r1h || '';
			r1hDiv.style.display=this.options.loginData.r1h?'block':'none';
			var rain1h=parseFloat(this.options.r1h);
			var color='rgba(0,255,0,0.7)';
			if(rain1h>0&&rain1h<10){
				
			}else if(rain1h>=10&&rain1h<25){
				color='rgba(0,128,0,0.8)';
			}else if(rain1h>=25&&rain1h<50){
				color='rgba(99,184,249,0.9)';
			}else if(rain1h>=50&&rain1h<100){
				color='rgba(0,0,254,1)';
			}else if(rain1h>=100&&rain1h<200){
				color='rgba(243,5,238,1)';
			}else if(rain1h>=200&&rain1h<9000){
				color='rgba(129,0,64,1)';
			}
			r1hDiv.style.color=color;
			var idDiv = document.createElement('div');
			idDiv.className = 'icon-text-id2';
			idDiv.innerHTML = this.options.id || '';
			idDiv.style.display=this.options.loginData.id2?'block':'none';
			
			var nameDiv = document.createElement('div');
			nameDiv.className = 'icon-text-name2';
			nameDiv.innerHTML = this.options.name || '';
			nameDiv.style.display=this.options.loginData.name2?'block':'none';
			
			var textDiv = document.createElement('div');
			textDiv.appendChild(r1hDiv);
			textDiv.appendChild(idDiv);
			textDiv.appendChild(nameDiv);
			var div = document.createElement('div');
			div.appendChild(textDiv);

			this._setIconStyles(div, 'icon');
			this._textDiv = textDiv;
			return div;
		},
		changeStatus: function (loginData) {
			this._textDiv.children[0].style.display=loginData.r1h?'block':'none';
			this._textDiv.children[1].style.display=loginData.id2?'block':'none';
			this._textDiv.children[2].style.display=loginData.name2?'block':'none';
		}
	});

} ());
