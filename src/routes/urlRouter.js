import { Router } from "express"
import { shortenUrl } from "../controllers/urlController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRouter = Router()

urlRouter.post('/urls/shorten', validateSchemaMiddleware(urlSchema), validateTokenMiddleware, shortenUrl)

export default urlRouter;