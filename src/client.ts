interface BaseRequestOptions {
    format?: "xml" | "json" | "jsonp",
    field_list?: string,
}

interface SearchOptions extends BaseRequestOptions {
    limit?: number,
    page?: number,
    query: string,
    resources?: string,
}

export default class GiantBombClient {
    private readonly apiKey: string
    private readonly baseUrl = "https://www.giantbomb.com/api/"

    // Giant Bomb API doesn't support CORS, and I didn't want to set up JSONP,
    // so let's use a free (and definitely insecure) reverse proxy that adds 
    // CORS headers to proxied requests
    private readonly corsProxyUrl = "https://thingproxy.freeboard.io/fetch/"

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private buildUrl(path: string, params: Record<string, any>): string {
        const url = new URL(this.baseUrl + path)

        for (const [k, v] of Object.entries(params)) {
            url.searchParams.append(k, v)
        }

        url.searchParams.append("api_key", this.apiKey);

        return this.corsProxyUrl + url.toString()
    }

    private executeRequestForJson<O extends BaseRequestOptions>(
        path: string,
        options?: O,
    ): Promise<any> {
        options = options ?? ({} as O)
        options.format = options.format ?? "json"
        const url = this.buildUrl(path, options)
        return fetch(url).then(resp => resp.json())
    }

    /**
     * Makes a `game` API call.
     * 
     * Documentation: https://www.giantbomb.com/api/documentation/#toc-0-16
     */
    getGame(guid: string, options?: BaseRequestOptions): Promise<any> {
        return this.executeRequestForJson(`game/${guid}`, options)
    }

    /**
     * Makes a `search` API call.
     * 
     * Documentation: https://www.giantbomb.com/api/documentation/#toc-0-41
     */
    search(options: SearchOptions): Promise<any> {
        options.resources = options.resources ?? "game"
        return this.executeRequestForJson("search", options)
    }
}