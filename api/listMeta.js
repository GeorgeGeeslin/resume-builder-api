import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
    const params = {
        TableName: process.env.tableName,
        KeyConditionExpression: "userId = :userId and resumeId = :resumeId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId,
            ":resumeId": `META-${event.requestContext.identity.cognitoIdentityId}`
        }
    };

    const result = await dynamoDb.query(params);

    return result.Items;
});