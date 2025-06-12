
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Books Api',
        description: 'Books Api'
    },
    host: 'localhost:5000',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js']; // Changed to scan server.js instead of bookRoutes.js

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully!');
});