const tilTimeZone = 'America/Edmonton';
const tilBirthday = Date.UTC(2010, 8, 24);
console.log(tilBirthday);

function setTilDate()
{
	const tilTime = document.getElementById('tilTime');

	const date = new Date(Date.now());

	let milisecondsElapsed = date.getUTCMilliseconds();

	if(tilTime != null)
	{
		tilTime.innerText = date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZone: tilTimeZone
		});
	}

	setTimeout(function() {
		setTilDate();
	}, 1000 - milisecondsElapsed);
}

function setTilAge()
{
	const tilAge = document.getElementById('tilAge');
	const tilBirthdayDocument = document.getElementById('tilBirthDate');

	const tilBirthDate = new Date(tilBirthday);

	if(tilBirthDate != null)
	{
		tilBirthdayDocument.innerText = tilBirthDate.toLocaleDateString('en-CA', {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "UTC"
		});
	}

	const timeSinceDate = new Date();
	timeSinceDate.setTime(Date.now() - tilBirthDate.getTime());

	if(tilAge != null)
	{
		tilAge.innerText = (timeSinceDate.getUTCFullYear() - 1970);
	}
}

window.addEventListener('load', () => {
	setTilDate();
	setTilAge();
});