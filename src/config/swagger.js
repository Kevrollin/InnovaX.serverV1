const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FundHub API',
      version: '1.0.0',
      description: 'FundHub Express.js Backend API Documentation - Professional migration from FastAPI',
      contact: {
        name: 'FundHub API Support',
        email: 'support@fundhub.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            role: { type: 'string', enum: ['GUEST', 'BASE_USER', 'STUDENT', 'ADMIN', 'INSTITUTION', 'SPONSOR'] },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            authorId: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string' },
            mediaUrl: { type: 'array', items: { type: 'string' } },
            postType: { 
              type: 'string',
              enum: ['insights', 'achievements', 'trends', 'announcements']
            },
            isFundable: { type: 'boolean' },
            likesCount: { type: 'integer' },
            commentsCount: { type: 'integer' },
            sharesCount: { type: 'integer' },
            viewsCount: { type: 'integer' },
            isPublic: { type: 'boolean' },
            status: {
              type: 'string',
              enum: ['draft', 'published', 'archived']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            ownerId: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            shortDescription: { type: 'string' },
            fundingGoal: { type: 'number' },
            fundingRaised: { type: 'number' },
            currency: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'pending_review', 'published', 'fundable', 'funded', 'completed', 'archived'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Donation: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            donorId: { type: 'integer' },
            recipientId: { type: 'integer' },
            projectId: { type: 'integer' },
            postId: { type: 'integer' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            paymentMethod: { type: 'string', enum: ['STELLAR_XLM', 'STELLAR_USDC', 'STRIPE_CARD', 'MPESA', 'BANK_TRANSFER'] },
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Campaign: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            fundingGoal: { type: 'number' },
            fundingRaised: { type: 'number' },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      tags: [
        { name: 'Authentication', description: 'User authentication endpoints' },
        { name: 'Posts', description: 'Social media posts management' },
        { name: 'Projects', description: 'Student projects management' },
        { name: 'Donations', description: 'Donation and funding endpoints' },
        { name: 'Students', description: 'Student verification and management' },
        { name: 'Campaigns', description: 'Campaign management' },
        { name: 'Wallets', description: 'Stellar wallet management' },
        { name: 'Admin', description: 'Admin operations' },
        { name: 'Analytics', description: 'Platform analytics' },
      ],
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
