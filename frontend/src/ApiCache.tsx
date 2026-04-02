export const ENDPOINTS = [
	"/api/data/greetings",
	"/api/data/timezone",
	"/api/data/socials",
	"/api/data/projects",
] as const;

export type ApiCacheEndpoint = (typeof ENDPOINTS)[number];

class ApiCache implements ReadonlyMap<ApiCacheEndpoint, unknown>
{
	private readonly registry: Map<ApiCacheEndpoint, unknown> = new Map<ApiCacheEndpoint, unknown>();

	async load(): Promise<void>
	{
		const promises: Promise<void>[] = ENDPOINTS.map(v => this.loadEndpoint(v));
		await Promise.all(promises);
	}

	async loadEndpoint(endpoint: ApiCacheEndpoint)
	{
		const response: Response = await fetch(endpoint as string);
		this.registry.set(endpoint, await response.json());
	}

	forEach(
		callbackfn: (value: unknown, key: ApiCacheEndpoint, map: ReadonlyMap<ApiCacheEndpoint, unknown>) => void,
		thisArg?: never,
	): void
	{
		this.registry.forEach(callbackfn, thisArg);
	}

	get(key: ApiCacheEndpoint): unknown
	{
		return this.registry.get(key);
	}

	has(key: ApiCacheEndpoint): boolean
	{
		return this.registry.has(key);
	}

	get size(): number
	{
		return this.registry.size;
	}

	entries(): MapIterator<[ApiCacheEndpoint, unknown]>
	{
		return this.registry.entries();
	}

	keys(): MapIterator<ApiCacheEndpoint>
	{
		return this.registry.keys();
	}

	values(): MapIterator<unknown>
	{
		return this.registry.values();
	}

	[Symbol.iterator](): MapIterator<[ApiCacheEndpoint, unknown]>
	{
		return this.registry.entries();
	}
}

const instance: ApiCache = new ApiCache();
export default instance;
