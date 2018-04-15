export class InjectionToken<T> {
  private readonly _desc: string | undefined;

  constructor(desc?: string) {
    this._desc = desc;
  }

  public toString(): string {
    return `InjectionToken ${this._desc != null ? this._desc : "?"}`;
  }
}
