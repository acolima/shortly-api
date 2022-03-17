import { Router } from "express"
import { deleteUrl, getShortUrl, shortenUrl } from "../controllers/urlController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRouter = Router()

urlRouter.post('/urls/shorten', validateSchemaMiddleware(urlSchema), validateTokenMiddleware, shortenUrl)
urlRouter.get('/urls/:shortUrl', getShortUrl)
urlRouter.delete('/urls/:id', validateTokenMiddleware, deleteUrl)

export default urlRouter;