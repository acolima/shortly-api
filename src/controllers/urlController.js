import { v4 as uuid } from "uuid"
import { connection } from "../database.js";

export async function shortenUrl(req, res) {
  const { link } = req.body
  const { user } = res.locals

  const shortUrl = uuid().split("-")[0]

  try {
    await connection.query(`
      INSERT INTO urls
        (url, "shortUrl", "userId")
      VALUES ($1, $2, $3)
    `, [link, shortUrl, user.id])

    res.status(201).send({ shortUrl })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function getUrls(req, res) {
  try {
    const { rows: urls } = await connection.query(`
      SELECT * FROM urls
    `)
    res.status(200).send(urls)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

export async function getShortUrl(req, res) {
  const { shortUrl } = req.params

  try {
    const { rows: url } = await connection.query(`
      SELECT * FROM urls
      WHERE "shortUrl"=$1
    `, [shortUrl])

    await connection.query(`
      UPDATE urls SET "visitCount"=${url[0].visitCount + 1}
      WHERE id=${url[0].id}
    `)

    if (url.length === 0) return res.sendStatus(404)

    res.status(200).send(url[0])
    //res.redirect(url[0].url)

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