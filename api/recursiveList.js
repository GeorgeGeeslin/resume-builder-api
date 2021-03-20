import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
    let params = {
        TableName: process.env.tableName,
        // 'KeyConditionExpression' defines the condition for the query
        // - 'userId = :userId': only return items with matching 'userId'
        //   partition key
        KeyConditionExpression: "userId = :userId and begins_with(resumeId, :resumeId)",
        // 'ExpressionAttributeValues' defines the value in the condition
        // - ':userId': defines 'userId' to be the id of the author
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId,
            ":resumeId": "RESUME-"
        }
    };

    let items = [];

    //Recursive function to accumulate all items if response is greater than 1MB limit.
    async function getNextPage(params, lastEvaluatedKey) {
        let requestParams = { ...params };
        if (lastEvaluatedKey) requestParams.ExclusiveStartKey = lastEvaluatedKey;

        const { LastEvaluatedKey, Items } = await dynamoDb.query(requestParams);

        items.push(...Items);

        if (LastEvaluatedKey) {
            await getNextPage(params, LastEvaluatedKey);
        } else {
            return null;
        }
    };

    async function getResumeItems(params) {
        const { LastEvaluatedKey, Items } = await dynamoDb.query(params);
        items.push(...Items);

        if (LastEvaluatedKey) {
            await getNextPage(params, LastEvaluatedKey);
        } else {
            return null;
        }
    }

    await getResumeItems(params);

    return items;
});