const { json, request, response } = require("express");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

//Middleware
//Next define se ele vai pra frente ou se ele vai intercptar.
// Request na api -> middleware -> minha requisição
const verifyIfExistsAccountCPF = (request, response, next) => {
  const { cpf } = request.body || request.params;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "invalid cpf" });
  }

  //Como passar esse customer pra frente?
  //Assim:
  request.customer = customer;

  return next();
};

//Dados que nossa conta deve ter
/**
 * cpf - string
 * name -string
 * id - uuid
 * statement []  - Extrato de cŕeditos e débitos/ Lançamentos da nossa conta.
 */
app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  customerAlreadyExists = customers.some((customers) => customers.cpf === cpf);

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" });
  }

  const customer = { id: uuidv4(), name, cpf, statement: [] };

  customers.push(customer);

  return response.status(201).json(customer);
});

app.get("/account", (request, response) => {
  return response.status(200).json(customers);
});

app.get("/statement/:cpf", verifyIfExistsAccountCPF, (request, response) => {
  return response.status(200).json(customer.statement);
});

app.post("/withdraw", (request, response) => {
  const { cpf, value } = request.body;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "invalid cpf" });
  }

  const totalDeposited = customers.reduce(
    (acc, customer) => customer.statement.value + acc
  );

  return response.status(200).json({ totalInAccount: totalDeposited });
});

app.get("/statament/date", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { date } = request.params;

  const dateFormat = new Data(date + "00:00");

  const statement = customer.statement.fillter(
    ({ created_at }) =>
      created_at.toDateString() === new Date(dateFormat).toDateString()
  );

  return response.json(statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { description, amount } = request.body;

  customer.statement.push({ created_at: new Date(), amount, description });

  customers.push(customer);

  return response
    .status(201)
    .json({ messagem: `${amount} was added into ${customer.cpf}` });
});

app.listen(3333);
