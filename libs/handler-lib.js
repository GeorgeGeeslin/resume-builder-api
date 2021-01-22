export default function handler(lambda) {
    return async function (event, context) {
      let body, statusCode;

      try {
        // Run the Lambda
        body = await lambda(event, context);
        statusCode = 200;
      } catch (e) {
        body = { error: e.message };

        // Set statusCode
        switch (e.message) {
          case "Item not found.":
            statusCode = 404;
            break;
          default:
            statusCode = 500;
        }
      }

      // Return HTTP response
      return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        }
      };
    };
  }