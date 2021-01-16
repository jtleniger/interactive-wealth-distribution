exports.handler = async function(event, context) {
  console.log(`Event: ${JSON.stringify(event)}`);
  console.log(`Context: ${JSON.stringify(context)}`);

  return {
      statusCode: 200
  };
}