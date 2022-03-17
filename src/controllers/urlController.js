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

export async function getShortUrl(req, res) {
  const { shortUrl } = req.params

  try {
    const { rows: urls } = await connection.query(`
      SELECT id, "shortUrl", url FROM urls
      WHERE "shortUrl"=$1
    `, [shortUrl])

    if (urls.length === 0) return res.sendStatus(404)

    res.status(200).send(urls[0])
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}