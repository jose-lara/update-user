const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const handlerFunction = async (event, context, callback) => {
  const { userName, userSurname, role } = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  const { userId } = event.pathParameters;
  console.info({ event });

  try {
    const options = {
      TableName: 'User',
      Key: { userId },
      UpdateExpression: 'set userName = :userName, userSurname = :userSurname, #role = :role',
      ExpressionAttributeValues: {
        ':userName': userName,
        ':userSurname': userSurname,
        ':role': role
      },
      ExpressionAttributeNames: {
        '#role': 'role'
      },
      ReturnValues: 'UPDATED_NEW'
    };
    const response = await docClient.update(options).promise();
    console.info({ response });
    const result = {
      statusCode: 200,
      body: response.Item,
      headers: { 'content-type': 'application/json' }
    };
    callback(null, result);
  } catch (e) {
    return context.fail(e);
  }
};
exports.handler = handlerFunction;
