export type EventKey = string | RegExp;
export type EventHandler<T = unknown> = (payload: T) => void;

type AnyHandler = EventHandler<unknown>;

interface EmitterEnvelope {
  eventName: string;
  data: unknown;
}

export interface IEvents {
  on<T = unknown>(event: EventKey, callback: EventHandler<T>): void;
  off(event: EventKey, callback: AnyHandler): void;
  emit<T = unknown>(event: string, data?: T): void;
  trigger<T = unknown>(event: string, context?: Partial<T>): (data?: T) => void;
}

export class EventEmitter implements IEvents {
  private listeners = new Map<EventKey, Set<AnyHandler>>();

  on<T = unknown>(event: EventKey, callback: EventHandler<T>): void {
    const bucket = this.listeners.get(event) ?? new Set<AnyHandler>();
    bucket.add(callback as AnyHandler);
    this.listeners.set(event, bucket);
  }

  off(event: EventKey, callback: AnyHandler): void {
    const bucket = this.listeners.get(event);
    if (!bucket) {
      return;
    }

    bucket.delete(callback);

    if (bucket.size === 0) {
      this.listeners.delete(event);
    }
  }

  emit<T = unknown>(event: string, data?: T): void {
    this.listeners.forEach((handlers, key) => {
      if (key === "*") {
        handlers.forEach((handler) =>
          handler({ eventName: event, data } as EmitterEnvelope)
        );
        return;
      }

      const matched =
        (key instanceof RegExp && key.test(event)) || key === event;

      if (!matched) {
        return;
      }

      handlers.forEach((handler) => handler(data));
    });
  }

  trigger<T = unknown>(
    event: string,
    context?: Partial<T>
  ): (data?: T) => void {
    return (data?: T) => {
      this.emit(event, { ...(data ?? {}), ...(context ?? {}) });
    };
  }
}
