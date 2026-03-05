export default class ApiCache
{
	static greetingList: string[] = [];
	static timeZoneData: any = undefined;

	static async load(): Promise<void>
	{
		const endpoints: string[] = ["/data/greetings.txt", "/api/timezone"];
		const [greetingResponse, timezoneResponse] = await Promise.all(endpoints.map((val: string) => fetch(val)));

		const [greetingText, timeZoneData] = await Promise.all([
			await greetingResponse.text(),
			await timezoneResponse.json(),
		]);

		ApiCache.greetingList = greetingText.trim().split("\n");
		ApiCache.timeZoneData = timeZoneData;
	}
}
