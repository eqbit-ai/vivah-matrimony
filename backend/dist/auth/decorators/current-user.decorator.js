"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiresSubscription = exports.Public = exports.Roles = exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
        return null;
    }
    return data ? user[data] : user;
});
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;
const Public = () => (0, common_1.SetMetadata)('isPublic', true);
exports.Public = Public;
const RequiresSubscription = () => (0, common_1.SetMetadata)('requiresSubscription', true);
exports.RequiresSubscription = RequiresSubscription;
//# sourceMappingURL=current-user.decorator.js.map