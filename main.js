async function getRandomGreeting()
{
	const randomGreetingsResponse = await fetch('./assets/randomGreeting.txt');
	const randomGreetingsFile = await randomGreetingsResponse.text();
	const randomGreetings = randomGreetingsFile.split('\n');
	randomGreetings.pop();
	var randomGreeting = randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
	randomGreeting = randomGreeting.substring(0, randomGreeting.length - 1);
	return randomGreeting;
}

getRandomGreeting().then(value => {
	// gonna do most stuff here, because here is when most html stuff is initialized
	console.log(value);
	document.getElementById('randomGreeting').innerText = value;

	if(Math.random() <= 0.1)
		document.getElementById('stuffAlright').innerText = 'Shit'; // hehehe im so funny hehehehe
});