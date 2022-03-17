import { v4 as uuid } from "uuid"
import { connection } from "../database.js";

export async function shortenUrl(req, res) {
  const { url } = req.body
  const { user } = res.locals

  const shortUrl = uuid().split("-")[0]

  try {
    await connection.query(`
      INSERT INTO urls
        (url, "shortUrl", "userId")
      VALUES ($1, $2, $3)
    `, [url, shortUrl, user.id])

    res.status(201).send({ shortUrl })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}