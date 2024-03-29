const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const handlerFunction = async (event, context, callback) => {
  const { userName, userSurname, role } = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  const { userId } = event.pathParameters;
  console.info({ event });
  const timestamp = Date.now()
  try {
    const options = {
      TableName: 'User',
      Key: { userId },
      UpdateExpression: 'set userName = :userName, userSurname = :userSurname, #role = :role, #timestamp = :timestamp, active = :active',
      ExpressionAttributeValues: {
        ':userName': userName,
        ':userSurname': userSurname,
        ':role': role,
        ':timestamp': timestamp,
        ':active': true
      },
      ExpressionAttributeNames: {
        '#role': 'role',
        '#timestamp': 'timestamp'
      },
      ReturnValues: 'UPDATED_NEW'
    };
    await docClient.update(options).promise();
    const responseBody = {
      userId,
      userName,
      userSurname,
      role,
      timestamp,
      active: true
    };

    const result = {
      statusCode: 200,
      body: JSON.stringify(responseBody),
      headers: { 'content-type': 'application/json' },
      isBase64Encoded: false
    };
    callback(null, result);
  } catch (e) {
    return context.fail(e);
  }
};
exports.handler = handlerFunction;
