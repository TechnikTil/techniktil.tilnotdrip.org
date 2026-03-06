import yaml from "yaml";

export default class ApiCache
{
	static greetingList: string[] = [];
	static timeZoneData: any = undefined;
	static socialsData: any[] = [];

	static async load(): Promise<void>
	{
		const endpoints: string[] = ["/data/greetings.txt", "/data/socials.yaml", "/api/timezone"];
		const responses: PromiseSettledResult<Response>[] = await Promise.allSettled(endpoints.map(val => fetch(val)));

		const getRes: (i: number) => Response | null = (i: number) =>
		{
			const res = responses[i];
			return res.status === "fulfilled" && res.value.ok ? res.value : null;
		};

		const [greetingText, socialContent, timeZoneData] = await Promise.all([
			await getRes(0)?.text() ?? "",
			await getRes(1)?.text() ?? "",
			await getRes(2)?.json(),
		]);

		ApiCache.greetingList = greetingText.trim().split("\n");
		ApiCache.socialsData = (yaml.parse(socialContent)?.socials ?? []) as any[];
		ApiCache.timeZoneData = timeZoneData;
	}
}
