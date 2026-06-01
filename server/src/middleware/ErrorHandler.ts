import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";
import { Context } from "koa";

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next?: (err?: any) => any) {
    const ctx = request as Context;

    console.error("Error:", error);

    ctx.status = error.httpCode || error.status || 500;
    ctx.body = {
      error: {
        message: error.message || "Internal Server Error",
        status: ctx.status,
      },
    };

    next?.();
  }
}
