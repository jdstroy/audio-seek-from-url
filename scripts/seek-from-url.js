function seekIfNeeded() {
	var q = window.location.search;

	if (q.indexOf("t=") > -1) {
		var timeString = q.split("=")[1];
		var media = document.getElementById("media");
		var seekedFromURL = false;

		media.addEventListener("canplay", function () {
			if (!seekedFromURL) {
				media.currentTime = secondsFromTimeParts(partsFromTimeString(timeString));
				seekedFromURL = true;
			}
		});

		media.play();
	}
}

function partsFromTimeString(str) {
	var parts = { 
		h: 0, 
		m: 0, 
		s: 0 
	};

	try {
		str.match(/[0-9]+[hms]+/g).forEach(function (val) {
			var part = val.match(/[hms]+|[0-9]+/g);

			parts[part[1]] = parseInt(part[0], 10);
		});
	} catch (e) { }

	return parts;
}

function timeStringFromParts(parts) {
	var str = "";

	for (var key in parts) {
		if (parts[key] > 0) {
			str += parts[key] + key;
		}
	}

	return str;
}

function timePartsFromSeconds(seconds) {
	var parts = {};
	var secondsInt = Math.floor(seconds);

	parts.h = Math.floor((secondsInt / 3600) % 24);
	parts.m = Math.floor(secondsInt / 60);
	parts.s = secondsInt % 60;

	return parts;
}

function secondsFromTimeParts(parts) {
	var seconds = 0;

	seconds += parts.s;
	seconds += parts.m * 60;
	seconds += parts.h * 3600;

	return seconds;
}

function displayTimeURL() {
	var loc = window.location;
	var timeDisplay = document.querySelector(".current-url");
	var media = document.getElementById("media");
	var coolTime = "";

	media.addEventListener("timeupdate", function () {
		let newCoolTime = timeStringFromParts(timePartsFromSeconds(media.currentTime));

		if (coolTime != newCoolTime) {
			coolTime = newCoolTime;

			let url = loc.origin + loc.pathname + "?t=" + coolTime;

			if (timeDisplay != document.activeElement) {
				timeDisplay.setAttribute("value", url);
			}
		}
	});
}

window.onload = function () {
	seekIfNeeded();
	displayTimeURL();
};