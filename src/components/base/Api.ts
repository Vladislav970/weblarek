type HttpMethod = "POST" | "PUT" | "DELETE";

export class Api {
  private readonly baseUrl: string;
  private readonly options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string> | undefined) ?? {}),
      },
    };
  }

  get<T extends object>(path: string): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      ...this.options,
      method: "GET",
    }).then(this.parseResponse<T>);
  }

  post<T extends object>(
    path: string,
    payload: object,
    method: HttpMethod = "POST"
  ): Promise<T> {
    return fetch(`${this.baseUrl}${path}`, {
      ...this.options,
      method,
      body: JSON.stringify(payload),
    }).then(this.parseResponse<T>);
  }

  private parseResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      return response.json() as Promise<T>;
    }

    return response
      .json()
      .catch(() => ({ error: response.statusText }))
      .then((data) => Promise.reject(data.error ?? response.statusText));
  }
}
