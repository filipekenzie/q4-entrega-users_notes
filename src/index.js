let express = require("express");
let { v4: uuidv4 } = require("uuid");

let app = express();
app.use(express.json());

let users = [];

//Middleware para verificar usuário
let verifyIfExistsUserCPF = (request, response, next) => {
  let { cpf } = request.params;

  let user = users.find((user) => user.cpf == cpf);

  if (!user) {
    return response
      .status(400)
      .json({ error: "invalid cpf - user is not registered" });
  }

  request.user = user;

  return next();
};

//CRUD - USER
//CREATE - Cadastra usuário
app.post("/users", (request, response) => {
  let { cpf, name } = request.body;

  userAlreadyExists = users.some((users) => users.cpf === cpf);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "user already exists!" });
  }

  let user = { id: uuidv4(), name, cpf, notes: [] };

  users.push(user);

  return response.status(201).json(user);
});

//READ - Lista todos os usuários e suas notas
app.get("/users", (request, response) => {
  return response.status(200).json(users);
});

//UPDATE - Edita um determinado usuário por cpf
app.patch("/users/:cpf", verifyIfExistsUserCPF, (request, response) => {
  let { user } = request;
  let { cpf, name } = request.body;

  let usersUpdated = users.filter(
    (userToBeUpdated) => userToBeUpdated.cpf !== user.cpf
  );
  let userUpdated = { ...user, cpf, name };

  usersUpdated.push(userUpdated);
  users = usersUpdated;

  return response.status(201).json({ messagem: "User is updated", users });
});

//DELETE - Deleta um determinado usuário por cpf
app.delete("/users/:cpf", verifyIfExistsUserCPF, (request, response) => {
  let { user } = request;
  let usersUpdated = users.filter(
    (userToBeUpdated) => userToBeUpdated.cpf !== user.cpf
  );
  users = usersUpdated;

  return response.status(201).json({ messagem: "User is deleted", users });
});

// ------------  CRUD - NOTES ----------------
//CREATE - Cadastra nota de um usuário poe cpf
app.post("/users/:cpf/notes", verifyIfExistsUserCPF, (request, response) => {
  let { user } = request;
  let { title, content } = request.body;

  user.notes.push({id: uuidv4(), created_at: new Date(), title, content });

  return response
    .status(201)
    .json({ messagem: `${title} was added into ${user.name}'s notes` });
});

//READ - Lista as notas de um usuário por cpf
app.get("/users/:cpf/notes", verifyIfExistsUserCPF, (request, response) => {
  let { user } = request;
  return response.status(200).json(user.notes);
});

//UPDATE - Altera nota de um usuário
app.patch(
  "/user/:cpf/notes/:id",
  verifyIfExistsUserCPF,
  (request, response) => {
    let { user } = request;
    let { id } = request.params;
    let { title, content } = request.body;

    let note = user.notes.find((note) => note.id === id);
    let noteUpdated = { ...note, title, content, updated_at: new Date() };
    
    let notesUpdated = user.notes.filter(note => note.id !== id);
    notesUpdated.push(noteUpdated);

    user.notes = notesUpdated;

    return response.status(200).json(user.notes);
  }
);

//DELETE - Exclui uma determinada nota de um usuário por cpf e id
app.delete(
  "/usera/:cpf/notes/:id",
  verifyIfExistsUserCPF,
  (request, response) => {
    let { user } = request;
    let { id } = request.params;
    
    let notesUpdated = user.notes.filter(note => note.id !== id);

    user.notes = notesUpdated;

    return response.status(200).json(user.notes);
  }
);
app.listen(3333);
