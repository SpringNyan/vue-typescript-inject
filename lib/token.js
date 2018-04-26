var InjectionToken = /** @class */ (function () {
    function InjectionToken(desc) {
        this._desc = desc;
    }
    InjectionToken.prototype.toString = function () {
        return "InjectionToken " + (this._desc != null ? this._desc : "?");
    };
    return InjectionToken;
}());
export { InjectionToken };
