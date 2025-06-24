async function getRandomGreeting()
{
	const randomGreetingsResponse = await fetch('./assets/data/randomGreeting.txt');
	const randomGreetingsFile = await randomGreetingsResponse.text();
	const randomGreetings = randomGreetingsFile.split('\n');
	var randomGreeting = randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
	return randomGreeting;
}

getRandomGreeting().then(value => {
	// gonna do most stuff here, because here is when most html stuff is initialized
	console.log(value);
	const randomGreeting = document.getElementById('randomGreeting');
	if(randomGreeting != null)
		randomGreeting.innerText = value;

	const stuffAlright = document.getElementById('stuffAlright');
	if(Math.random() <= 0.1 && stuffAlright != null)
		stuffAlright.innerText = 'Shit'; // hehehe im so funny hehehehe
});