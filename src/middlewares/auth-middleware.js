import ApiError from "../exceptions/api-error.js";
import tokenService from "../services/token-service.js";


const authMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError(`No authorization header`));
        }

        const [tokenScheme, accessToken] = authorizationHeader.split(' ');
        if ( tokenScheme !== 'Bearer' || !accessToken) {
            return next(ApiError.UnauthorizedError(`Incorrect authorization header`));
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError(`Invalid access token`));
        }

        req.user = userData;
        next();

    } catch (err) {
        return next(ApiError.UnauthorizedError());
    }
}

export default authMiddleware;
