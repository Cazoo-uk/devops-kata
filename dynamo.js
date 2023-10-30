const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

var client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const getParams = {
  TableName: process.env.DYNAMODB_TABLE,
  Key: {
    COUNTER: "OrderEvents"
  }
};

const saleParams = name => ({
  TableName: process.env.DYNAMODB_TABLE,
  Key: {
    COUNTER: "OrderEvents"
  },
  ExpressionAttributeNames: {
    "#name": name
  },
  ExpressionAttributeValues: {
    ":val": 1,
  },
  ReturnValues: "UPDATED_NEW",
  UpdateExpression: "SET EVENTS.#name = EVENTS.#name + :val",
});

const getCountOfSold = async () => {
  const command = new GetCommand(getParams);
  const response = await docClient.send(command);
  const placed = read("vehicleSold", response);
  const cancelled = read("vehicleSaleCancelled", response);
  return placed-cancelled;
};

const read = (name, item) => {
  try {
    const val = item.Item.EVENTS[name];
    return parseInt(val);
  } catch (e) {
    console.log(e);
    return 0;
  }
};

const updateVehicleSales = async eventName => {
  try {
    const command = new UpdateCommand(saleParams(eventName));
    const result = await docClient.send(command);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getCountOfSold,
  updateVehicleSales
};
