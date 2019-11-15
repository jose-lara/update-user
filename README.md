# Aws lambda talk how to update an user in dynamo

Añadir un timestamp de fecha de ultima modificación del usuario y activar usuario (cambiar flag `active` a true)

Añadir la llamada al layer donde se hacen las llamadas a AWS. El codigo del modulo del layer es el siguiente

```js
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const getAllUsers = async () => {
  const options = {
    TableName: 'User',
    FilterExpression: '#active = :active',
    ExpressionAttributeValues: {
      ':active': true
    },
    ExpressionAttributeNames: {
      '#active': 'active'
    }
  };
  const user = await docClient.scan(options).promise();
  return user.Items;
};

const getUserById = async ({ userId }) => {
  const options = {
    TableName: 'User',
    Key: { userId }
  };
  const user = await docClient.get(options).promise();
  return user.Item;
};

const updateUser = async options => await docClient.update(options).promise();

const createUser = async options => await docClient.put(options).promise();

const dynamoRequest = (method, options) => {
  switch (method) {
    case 'getUserById':
      return getUserById(options);
    case 'deleteUser':
    case 'updateUser':
      return updateUser(options);
    case 'createUser':
      return createUser(options);
    case 'getAll':
    default:
      return getAllUsers();
  }
};

module.exports = {
  dynamoRequest
};
```
