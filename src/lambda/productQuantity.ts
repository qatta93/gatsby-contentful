import { Handler } from "@netlify/functions";
import pgPromise from 'pg-promise';
require('dotenv').config();

const pgp = pgPromise();
const db = pgp(process.env.DB_URL as string);

const handler: Handler = async (event, context) => {
  try {
    const data = await db.one('SELECT * FROM products')
    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };

  } catch(err) {
    const error = err instanceof Error ? err.message : 'an error happened';
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    }
  }
};

export { handler };
