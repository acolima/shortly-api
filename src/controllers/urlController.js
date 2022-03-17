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

export async function deleteUrl(req, res) {
  const { id } = req.params
  const { user } = res.locals

  try {
    const result = await connection.query(`
      SELECT id FROM urls
      WHERE id=$1 AND "userId"=$2
    `, [id, user.id])

    if (result.rowCount === 0) return res.sendStatus(401)

    await connection.query(`
      DELETE FROM urls
      WHERE id=$1
    `, [id])

    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}