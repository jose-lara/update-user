const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const handlerFunction = async (event, context) => {
  const { userName, userSurname, role } = event;
  const { userId } = event.pathParameters;

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
    await docClient.update(options).promise();
    return context.done(null);
  } catch (e) {
    return context.fail(e);
  }
};
exports.handler = handlerFunction;
