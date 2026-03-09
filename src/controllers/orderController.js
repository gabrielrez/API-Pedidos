const orderService = require('../services/orderService');

async function createOrder(req, res) {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || valorTotal === undefined || !dataCriacao || !items) {
      return res.status(400).json({ error: 'numeroPedido, valorTotal, dataCriacao e items são obrigatórios.' });
    }

    const order = await orderService.create(req.body);
    return res.status(201).json(order);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Pedido já existe.' });
    }
    return res.status(500).json({ error: 'Erro interno ao criar pedido.' });
  }
}

async function getOrder(req, res) {
  try {
    const order = await orderService.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao buscar pedido.' });
  }
}

async function listOrders(req, res) {
  try {
    const orders = await orderService.findAll();
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao listar pedidos.' });
  }
}

async function updateOrder(req, res) {
  try {
    const existing = await orderService.findById(req.params.orderId);
    if (!existing) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const order = await orderService.update(req.params.orderId, req.body);
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao atualizar pedido.' });
  }
}

async function deleteOrder(req, res) {
  try {
    const deleted = await orderService.remove(req.params.orderId);
    if (!deleted) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao deletar pedido.' });
  }
}

module.exports = { createOrder, getOrder, listOrders, updateOrder, deleteOrder };
