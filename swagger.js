const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load the YAML file
const swaggerSpec = YAML.load(path.join(__dirname, 'OpenAPI.yaml'));

module.exports = { swaggerUi, swaggerSpec };