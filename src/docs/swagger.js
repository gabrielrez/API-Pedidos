const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Pedidos',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        OrderItem: {
          type: 'object',
          required: ['produto', 'quantidade', 'precoUnitario'],
          properties: {
            produto: { type: 'string', example: 'Camiseta' },
            quantidade: { type: 'integer', example: 2 },
            precoUnitario: { type: 'number', example: 49.9 },
          },
        },
        OrderInput: {
          type: 'object',
          required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
          properties: {
            numeroPedido: { type: 'string', example: 'PED-001' },
            valorTotal: { type: 'number', example: 99.8 },
            dataCriacao: { type: 'string', format: 'date', example: '2026-03-09' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
          },
        },
        Order: {
          allOf: [
            { $ref: '#/components/schemas/OrderInput' },
            {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
              },
            },
          ],
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/auth/token': {
        post: {
          tags: ['Auth'],
          summary: 'Gerar token JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username'],
                  properties: {
                    username: { type: 'string', example: 'gabriel' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Token gerado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'username é obrigatório',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/order': {
        post: {
          tags: ['Orders'],
          summary: 'Criar pedido',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderInput' },
              },
            },
          },
          responses: {
            201: {
              description: 'Pedido criado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Order' },
                },
              },
            },
            400: { description: 'Campos obrigatórios ausentes', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Token não fornecido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            409: { description: 'Pedido já existe', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/order/list': {
        get: {
          tags: ['Orders'],
          summary: 'Listar todos os pedidos',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de pedidos',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
            401: { description: 'Token não fornecido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/order/{orderId}': {
        get: {
          tags: ['Orders'],
          summary: 'Buscar pedido por ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Pedido encontrado',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } },
            },
            401: { description: 'Token não fornecido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Pedido não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        put: {
          tags: ['Orders'],
          summary: 'Atualizar pedido',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/OrderInput' },
              },
            },
          },
          responses: {
            200: {
              description: 'Pedido atualizado',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } },
            },
            401: { description: 'Token não fornecido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Pedido não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        delete: {
          tags: ['Orders'],
          summary: 'Deletar pedido',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'orderId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            204: { description: 'Pedido deletado' },
            401: { description: 'Token não fornecido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Pedido não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
