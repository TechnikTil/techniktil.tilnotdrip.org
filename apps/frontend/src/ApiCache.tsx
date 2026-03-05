import yaml from "yaml";

export default class ApiCache
{
	static greetingList: string[] = [];
	static timeZoneData: any = undefined;
	static socialsData: any[] = [];

	static async load(): Promise<void>
	{
		const endpoints: string[] = ["/data/greetings.txt", "data/socials.yaml", "/api/timezone"];
		const [greetingResponse, socialsResponse, timezoneResponse] = await Promise.all(
			endpoints.map((val: string) => fetch(val)),
		);

		const [greetingText, socialContent, timeZoneData] = await Promise.all([
			await greetingResponse.text(),
			await socialsResponse.text(),
			await timezoneResponse.json(),
		]);

		ApiCache.greetingList = greetingText.trim().split("\n");
		ApiCache.socialsData = (yaml.parse(socialContent)?.socials ?? []) as any[];
		ApiCache.timeZoneData = timeZoneData;
	}
}
