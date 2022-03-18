import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(`
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `, [user.name, user.email, passwordHash])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { user } = res.locals;

  try {
    const { rows: users } = await connection.query(`
      SELECT id, name, email FROM users
    `)
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUserById(req, res) {
  const { id } = req.params

  try {
    const { rows: user } = await connection.query(`
      SELECT users.id, users.name, COUNT(urls."visitCount") AS "visitCount"
        FROM users
        LEFT JOIN urls ON urls."userId"=users.id
      WHERE users.id=$1
      GROUP BY users.id
    `, [id])

    if (user.length === 0) return res.sendStatus(404)

    const { rows: usersUrls } = await connection.query(`
      SELECT *
      FROM urls
      WHERE "userId"=$1
    `, [id])

    const response = {
      id: user[0].id,
      name: user[0].name,
      visitCount: user[0].visitCount,
      shortenedUrls: usersUrls.map(item => {
        const url = {
          id: item.id,
          shortUrl: item.shortUrl,
          url: item.url,
          visitCount: item.visitCount
        }
        return url
      })
    }

    res.send(response)

  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
} 