const randomGreetings = [
	"HEY EVERY !",
	"Ello!",
	"Oh, hi!",
	"Salutations.",
	"Hello!",
	"Hello Everyone!",
	"Hi!",
	"Hello Person!"
];

function getRandomGreeting()
{
	const randomGreeting = randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
	return randomGreeting;
}

window.addEventListener('load', () => {
	var greeting = getRandomGreeting();
	console.log(greeting);
	const randomGreeting = document.getElementById('randomGreeting');
	if(randomGreeting != null)
		randomGreeting.innerText = greeting;

	const stuffAlright = document.getElementById('stuffAlright');
	if(Math.random() <= 0.1 && stuffAlright != null)
		stuffAlright.innerText = 'Shit'; // hehehe im so funny hehehehe
});