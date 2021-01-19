import * as uuid from "uuid";
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
    const data = JSON.parse(event.body);

    const ts = Date.now();

    const params = {
        TableName: process.env.tableName,
        Item: {
            // The attributes of the item to be created
            userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
            resumeId: "RESUME#" + uuid.v1(), // A unique uuid
            // content: data.content, // Parsed from request body
            // thumbnail: data.thumbnail, // Parsed from request body
            // pdf: data.pdf, // Parsed from request body

            resumeName: data.resumeName,
            appState: data.appState,
            createdAt: ts,
            modified: ts
        },
    };

    await dynamoDb.put(params);

    return params.Item;
});