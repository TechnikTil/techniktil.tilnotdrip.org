import type { Dispatch, SetStateAction } from "react";

export const ENDPOINTS = [
	"/api/data/greetings",
	"/api/data/timezone",
	"/api/data/socials",
	"/api/data/projects",
] as const;

export type ApiCacheEndpoint = (typeof ENDPOINTS)[number];

class ApiCache
{
	private readonly registry: Map<ApiCacheEndpoint, unknown>;
	private promiseList: Set<ApiCacheEndpoint>;

	constructor()
	{
		this.registry = new Map<ApiCacheEndpoint, unknown>();
		this.promiseList = new Set<ApiCacheEndpoint>();

		for (const endpoint of ENDPOINTS)
		{
			const promise: Promise<unknown> = fetch(endpoint).then(v => v.json());

			this.registry.set(endpoint, promise);
			this.promiseList.add(endpoint);

			promise.then(value =>
			{
				this.registry.set(endpoint, value);
				this.promiseList.delete(endpoint);
			}, () =>
			{
				this.registry.delete(endpoint);
				this.promiseList.delete(endpoint);

				console.log(`${endpoint} failed!`);
			});
		}
	}

	async get(key: ApiCacheEndpoint): Promise<unknown>
	{
		if (this.promiseList.has(key))
		{
			const promise: Promise<unknown> = this.registry.get(key) as Promise<unknown>;
			return (await promise);
		}

		return this.registry.get(key);
	}

	getReact<T>(key: ApiCacheEndpoint, setValue: Dispatch<SetStateAction<T | null>>): void
	{
		this.get(key).then((value: unknown) =>
		{
			setValue(value as T);
		}, () =>
		{
			setValue(null);
		});
	}
}

const instance: ApiCache = new ApiCache();
export default instance;
