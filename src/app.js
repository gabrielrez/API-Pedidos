require('dotenv').config();
const express = require('express');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const auth = require('./middleware/auth');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API de Pedidos rodando.' });
});

app.use('/auth', authRoutes);
app.use('/order', auth, orderRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
