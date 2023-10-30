"use strict";
const dynamo = require("./dynamo");

module.exports.getCountOfSold = async (event) => {
  console.log(`Event: ${event}`);
  const result = await dynamo.getCountOfSold();
  console.log(`Result: ${JSON.stringify(result)}`);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        number: result,
      },
      null,
      2
    ),
  };
};

module.exports.updateVehicleSales = async (event) => {
  console.log(`Event: ${JSON.stringify(event)}`);
  await dynamo.updateVehicleSales(event["detail-type"]);
};
