import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
    const params = {
        TableName: process.env.tableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            resumeId: `META-${event.requestContext.identity.cognitoIdentityId}`
        }
    };

    await dynamoDb.delete(params);

    return { status: true};
});