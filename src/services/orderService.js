const pool = require('../config/database');

function mapToDb(body) {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: (body.items || []).map((item) => ({
      productId: parseInt(item.idItem, 10),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  };
}

async function create(body) {
  const { orderId, value, creationDate, items } = mapToDb(body);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      'INSERT INTO `Order` (orderId, value, creationDate) VALUES (?, ?, ?)',
      [orderId, value, creationDate]
    );

    for (const item of items) {
      await conn.execute(
        'INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await conn.commit();
    return findById(orderId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function findById(orderId) {
  const [orders] = await pool.execute(
    'SELECT * FROM `Order` WHERE orderId = ?',
    [orderId]
  );

  if (orders.length === 0) return null;

  const [items] = await pool.execute(
    'SELECT productId, quantity, price FROM Items WHERE orderId = ?',
    [orderId]
  );

  return { ...orders[0], items };
}

async function findAll() {
  const [orders] = await pool.execute('SELECT * FROM `Order`');

  const results = await Promise.all(
    orders.map(async (order) => {
      const [items] = await pool.execute(
        'SELECT productId, quantity, price FROM Items WHERE orderId = ?',
        [order.orderId]
      );
      return { ...order, items };
    })
  );

  return results;
}

async function update(orderId, body) {
  const { value, creationDate, items } = mapToDb({ ...body, numeroPedido: orderId });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      'UPDATE `Order` SET value = ?, creationDate = ? WHERE orderId = ?',
      [value, creationDate, orderId]
    );

    await conn.execute('DELETE FROM Items WHERE orderId = ?', [orderId]);

    for (const item of items) {
      await conn.execute(
        'INSERT INTO Items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await conn.commit();
    return findById(orderId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function remove(orderId) {
  const [result] = await pool.execute(
    'DELETE FROM `Order` WHERE orderId = ?',
    [orderId]
  );
  return result.affectedRows > 0;
}

module.exports = { create, findById, findAll, update, remove };
