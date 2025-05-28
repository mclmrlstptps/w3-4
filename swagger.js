const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Books Api',
        description: 'Books Api'
    },
    host: 'localhost: 5000',
    schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/bookRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);