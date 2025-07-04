const tilTimeZone = -6;

function setTilDate()
{
	const date = new Date(Date.now());
	date.setUTCHours(date.getUTCHours() + tilTimeZone);

	let milisecondsElapsed = date.getUTCMilliseconds();

	const tilTime = document.getElementById('tilTime');
	if(tilTime != null)
		tilTime.innerText = formatTime(date);
	setTimeout(function() {
		setTilDate();
	}, 1000 - milisecondsElapsed);
}

window.addEventListener('load', () => {
	setTilDate();
});

function formatTime(date)
{
	// formatting
	let formattedTime = "";
	let isPM = false;

	if(date.getUTCHours() > 12)
		isPM = true;

	if(isPM)
		formattedTime += date.getUTCHours() - 12;
	else
		formattedTime += date.getUTCHours();

	formattedTime += ":";

	let formattedMinutes = String(date.getUTCMinutes());

	while(formattedMinutes.length < 2)
	{
		formattedMinutes = "0" + formattedMinutes;
	}

	formattedTime += formattedMinutes;

	formattedTime += ":";

	let formattedSeconds = String(date.getUTCSeconds());

	while(formattedSeconds.length < 2)
	{
		formattedSeconds = "0" + formattedSeconds;
	}

	formattedTime += formattedSeconds;

	if(isPM)
		formattedTime += " PM";

	return formattedTime;
}