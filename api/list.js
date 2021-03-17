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
    async function getNextPage(lastEvaluatedKey, newParams) {

        newParams.ExclusiveStartKey = lastEvaluatedKey;

        const resumes = await dynamoDb.query(params);

        items.push(...resumes.Items);

        if (resumes.LastEvaluatedKey) {
            getNextPage(resumes.LastEvaluatedKey, params);
        } else {
            return null;
        }
    };

    const resumes = await dynamoDb.query(params);
    items = resumes.Items;

    if (resumes.LastEvaluatedKey) {
        await getNextPage(resumes.LastEvaluatedKey, params);
        return items;
    } else {
        return items;
    }
});