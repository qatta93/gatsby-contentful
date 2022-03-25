import { Handler } from "@netlify/functions";
import postgres from 'postgres';
require('dotenv').config();

const handler: Handler = async (event, context) => {
  try {
    const { id } = JSON.parse(event.body);
    const sql = postgres(process.env.DB_URL);
    const data = await sql`SELECT quantity FROM products WHERE id = ${ id }`;
    await sql.end();
    return {
      statusCode: 200,
      body: JSON.stringify(data[0]),
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
