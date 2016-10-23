(function () {
	"use strict";

	seekIfNeeded();
	displayTimeURL();

	function seekIfNeeded () {
		let q = window.location.search;

		if (q.indexOf('t=') > -1) {
			let timeString = q.split('=')[1],

			media = document.getElementById('media'),
			seekedFromURL = false;
	
			media.addEventListener('canplay', function () {
				if (!seekedFromURL) {
		  			media.currentTime = secondsFromTimeParts(partsFromTimeString(timeString));
		  			seekedFromURL = true;
				}
	  		});

			media.play();
		}
	}

	function partsFromTimeString (str) {
		let parts = {h: 0, m: 0, s: 0};

		try {
	  		str.match(/[0-9]+[hms]+/g).forEach(function (val) {
				let part = val.match(/[hms]+|[0-9]+/g);

				parts[part[1]] = parseInt(part[0], 10);
	  		});
		} catch (e) {}

		return parts;
	}

	function timeStringFromParts (parts) {
		let str = '';

		for (let key in parts) {
	  		if (parts[key] > 0) {
				str += parts[key] + key;
	  		}
		}

		return str;
	}

	function timePartsFromSeconds (seconds) {
		let parts = {};
	  	let secondsInt = Math.floor(seconds);

		parts.h = Math.floor((secondsInt / 3600) % 24);
		parts.m = Math.floor(secondsInt / 60);
		parts.s = secondsInt % 60;
		
		return parts;
	}

	function secondsFromTimeParts (parts) {
		let seconds = 0;

		seconds += parts.s;
		seconds += parts.m * 60;
		seconds += parts.h * 3600;

		return seconds;
  	}

	function displayTimeURL() {
		let loc = window.location;
	 	let timeDisplay = document.querySelector('.current-url');
	  	let media = document.getElementById('media');
	  	let coolTime = '';

		media.addEventListener('timeupdate', function () {
	  		let newCoolTime = timeStringFromParts(timePartsFromSeconds(media.currentTime));

	  		if (coolTime != newCoolTime) {
				coolTime = newCoolTime;
				
				let url = loc.origin + loc.pathname + '?t=' + coolTime;

				if (timeDisplay != document.activeElement) {
		 			timeDisplay.setAttribute('value', url);
				}
	  		}
		});
  	}
}());