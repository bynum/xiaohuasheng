(function () {

	L.TextIcon = L.Icon.extend({
		options: L.extend({}, new L.Icon.Default().options),

		initialize: function (options) {
			L.setOptions(this, options);
			var iconUrl = 'lib/leaflet/images/' + this.options.windNum + '.png'
			this._iconImg = this._createImg(iconUrl);
			this._iconImg.style.display = this.options.hourData7.wind ? 'block' : 'none';
			this._iconImg.style.webkitTransformOrigin = "center bottom";
			this._iconImg.style.webkitTransform = "rotate(" + this.options.windDirection + "deg)";
		},
		createIcon: function () {

			var temDiv = document.createElement('div');
			temDiv.className = 'icon-text-tem';
			temDiv.innerHTML = this.options.tem || '';
			temDiv.style.display = this.options.hourData7.tem ? 'block' : 'none';

			var idDiv = document.createElement('div');
			idDiv.className = 'icon-text-id';
			idDiv.innerHTML = this.options.id || '';
			idDiv.style.display = this.options.hourData7.id ? 'block' : 'none';

			var nameDiv = document.createElement('div');
			nameDiv.className = 'icon-text-name';
			nameDiv.innerHTML = this.options.name || '';
			nameDiv.style.display = this.options.hourData7.name ? 'block' : 'none';

			var prsDiv = document.createElement('div');
			prsDiv.className = 'icon-text-prs';
			prsDiv.innerHTML = this.options.prs || '';
			prsDiv.style.display = this.options.hourData7.prs ? 'block' : 'none';

			var dptDiv = document.createElement('div');
			dptDiv.className = 'icon-text-dpt';
			dptDiv.innerHTML = this.options.dpt || '';
			dptDiv.style.display = this.options.hourData7.dpt ? 'block' : 'none';

			var rHDiv = document.createElement('div');
			rHDiv.className = 'icon-text-rH';
			rHDiv.innerHTML = this.options.rH || '';
			rHDiv.style.display = this.options.hourData7.rh ? 'block' : 'none';
			function getColorByRain(rain) {
				var color = 'gray';
				if (rain >0&&rain<10) {
					color = 'rgba(0,200,0,1)';
				} else if (rain >= 10 && rain < 25) {
					color = 'rgba(0,128,0,1)';
				} else if (rain >= 25 && rain < 50) {
					color = 'rgba(99,184,249,1)';
				} else if (rain >= 50 && rain < 100) {
					color = 'rgba(0,0,254,1)';
				} else if (rain >= 100 && rain < 200) {
					color = 'rgba(243,5,238,1)';
				} else if (rain >= 200 && rain < 9000) {
					color = 'rgba(129,0,64,1)';
				}
				return color;
			}
			var pre1hDiv = document.createElement('div');
			pre1hDiv.className = 'icon-text-pre1h';
			pre1hDiv.innerHTML = this.options.pre1h || '';
			pre1hDiv.style.display = this.options.hourData7.pre1h ? 'block' : 'none';
			if (this.options.pre1h != null && this.options.pre1h != "") {
				pre1hDiv.style.color = getColorByRain(parseFloat(this.options.pre1h))
			}
			var gstDiv = document.createElement('div');
			gstDiv.className = 'icon-text-gst';
			gstDiv.innerHTML = this.options.gst || '';
			gstDiv.style.display = this.options.hourData7.gst ? 'block' : 'none';

			var visDiv = document.createElement('div');
			visDiv.className = 'icon-text-vis';
			visDiv.innerHTML = this.options.vis || '';
			visDiv.style.display = this.options.hourData7.vis ? 'block' : 'none';

			var prs24hDiv = document.createElement('div');
			prs24hDiv.className = 'icon-text-prs24h';
			prs24hDiv.innerHTML = this.options.prs24h || '';
			prs24hDiv.style.display = this.options.hourData7.prs24h ? 'block' : 'none';

			var prs3hDiv = document.createElement('div');
			prs3hDiv.className = 'icon-text-prs3h';
			prs3hDiv.innerHTML = this.options.prs3h || '';
			prs3hDiv.style.display = this.options.hourData7.prs3h ? 'block' : 'none';
			
			var tem24hDiv = document.createElement('div');
			tem24hDiv.className = 'icon-text-tem24h';
			tem24hDiv.innerHTML = this.options.tem24h || '';
			tem24hDiv.style.display = this.options.hourData7.tem24h ? 'block' : 'none';

			var temmax24hDiv = document.createElement('div');
			temmax24hDiv.className = 'icon-text-temmax24h';
			temmax24hDiv.innerHTML = this.options.temmax24h || '';
			temmax24hDiv.style.display = this.options.hourData7.temmax24h ? 'block' : 'none';

			var temmin24hDiv = document.createElement('div');
			temmin24hDiv.className = 'icon-text-temmin24h';
			temmin24hDiv.innerHTML = this.options.temmin24h || '';
			temmin24hDiv.style.display = this.options.hourData7.temmin24h ? 'block' : 'none';

			var pre24hDiv = document.createElement('div');
			pre24hDiv.className = 'icon-text-pre24h';
			pre24hDiv.innerHTML = this.options.pre24h || '';
			pre24hDiv.style.display = this.options.hourData7.pre24h ? 'block' : 'none';
            if (this.options.pre24h != null && this.options.pre24h != "") {
				pre24hDiv.style.color = getColorByRain(parseFloat(this.options.pre24h))
			}
			
			var pointDiv = document.createElement('div');
			pointDiv.className = 'icon-text-point';
			pointDiv.innerHTML = '。';
			pointDiv.style.display = this.options.hourData7.point ? 'block' : 'none';
			
			var textDiv = document.createElement('div');
			textDiv.appendChild(temDiv);
			textDiv.appendChild(idDiv);
			textDiv.appendChild(nameDiv);
			textDiv.appendChild(prsDiv);
			textDiv.appendChild(dptDiv);
			textDiv.appendChild(rHDiv);
			textDiv.appendChild(pre1hDiv);
			textDiv.appendChild(gstDiv);
			textDiv.appendChild(visDiv);
			textDiv.appendChild(prs24hDiv);
			textDiv.appendChild(prs3hDiv);
			textDiv.appendChild(tem24hDiv);
			textDiv.appendChild(temmax24hDiv);
			textDiv.appendChild(temmin24hDiv);
			textDiv.appendChild(pre24hDiv);
			textDiv.appendChild(pointDiv);
			var div = document.createElement('div');
			div.appendChild(this._iconImg);
			div.appendChild(textDiv);

			this._setIconStyles(div, 'icon');
			this._textDiv = textDiv;
			return div;
		},
		changeHourData7DisplayStatus: function (hourData7) {
			this._iconImg.style.display = hourData7.wind ? 'block' : 'none';
			this._textDiv.children[0].style.display = hourData7.tem ? 'block' : 'none';
			this._textDiv.children[1].style.display = hourData7.id ? 'block' : 'none';
			this._textDiv.children[2].style.display = hourData7.name ? 'block' : 'none';
			this._textDiv.children[3].style.display = hourData7.prs ? 'block' : 'none';
			this._textDiv.children[4].style.display = hourData7.dpt ? 'block' : 'none';
			this._textDiv.children[5].style.display = hourData7.rh ? 'block' : 'none';
			this._textDiv.children[6].style.display = hourData7.pre1h ? 'block' : 'none';
			this._textDiv.children[7].style.display = hourData7.gst ? 'block' : 'none';
			this._textDiv.children[8].style.display = hourData7.vis ? 'block' : 'none';
			this._textDiv.children[9].style.display = hourData7.prs24h ? 'block' : 'none';
			this._textDiv.children[10].style.display = hourData7.prs3h ? 'block' : 'none';
			this._textDiv.children[11].style.display = hourData7.tem24h ? 'block' : 'none';
			this._textDiv.children[12].style.display = hourData7.temmax24h ? 'block' : 'none';
			this._textDiv.children[13].style.display = hourData7.temmin24h ? 'block' : 'none';
			this._textDiv.children[14].style.display = hourData7.pre24h ? 'block' : 'none';
			this._textDiv.children[15].style.display = hourData7.point ? 'block' : 'none';
		}
	});

} ());
