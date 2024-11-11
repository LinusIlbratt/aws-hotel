module.exports.hello = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello, welcome to the hotel booking API!",
      }),
    };
  };
  