export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    readonly baseUrl: string;
    protected options: RequestInit;

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {})
            }
        };
    }

    protected handleResponse(res: Response): Promise<object> {
        if (res.ok) {
          return res.json();
        } else {
          return res
            .json()
            .then((data) => {
              console.error("Ошибка ответа сервера:", data);
              return Promise.reject(data.error ?? res.statusText);
            })
            .catch(() => {
              console.error("Ошибка парсинга ответа:", res.statusText);
              return Promise.reject(res.statusText);
            });
        }
      }


    get(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET'
        }).then(this.handleResponse);
    }

    post(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data)
        }).then(this.handleResponse);
    }
}