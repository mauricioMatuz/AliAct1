//CONEXION A BASE DE DATOS.
const { error } = require("console");
const { Pool } = require("pg");

const config = {
  host: "localhost",
  user: "mauricio",
  password: "1234",
  database: "redes",
};

const pool = new Pool(config);
//SENTENCIAS DE POSTGRESQL
// Necesitamos agregar un puerto de entrada "Acceso"
const PORT = process.env.PORT || 8000;
// Aquí agregaremos las librerias a utilizar "las invocamos"
const express = require("express"); // la palabra require lo unico que hace es requerir la libreria
// como la variable express es una libreria la creo como una clase para poder utlizar sus metodos y funciones
const app = express();
// path nos ayudara a saber donde sera la ruta de guardado
const path = require("path");

//Nos ayudara a conexion de otro servidor
var cors = require("cors");




//
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));/* ESTA PARTE ES DONDE LE DAMOS AUTORIZACION A TODOS LOS CRUDS CON CORS */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
/**INICIA LOS CRUD PARA DE LA BASE DE DATOS PARA LOS EMPLEADOS */
/**INICIO DE GET */
app.get("/api/usuarios", cors(), async (req, res) => {
  try {
    console.log("SI ENTRO A GET");
    const users = await pool.query("select * from Usuario");
    return res.send(users.rows);
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
});
/**FINAL DE GET */
/**INICIO DE GET para logear */
const tk =  require('jsonwebtoken');
const key = 'secretKey'
app.post("/apis/login", cors(), verificationToken ,async (req, res) => {
  console.log("ENTRO AL LOGIN EN POST");
  var username = req.body.usuario
  var password = req.body.password
  var user ={
    'usuario':username,
    'password':password
  }
  var toke = tk.sing(user,key)
  if(!req.header.authorization){
    return req.send("TOKEN INVALIO")
  }
   const tokens = req.header.authorization.split(' ')[1];
    if (tokens == null) {
        return res.status(401).send('TOKEN INVALIO')
    }
    const verificar = tk.verify(tokens,key)
    console.log(verificar)

  });

  function verificationToken(req, res, next){
   /* if(!req.header.authorization){
        return res.status(401).send('TOKEN INVALIO')
          "tokens": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDczMjY2NDJ9._R6HYV5ltDPucpDj7kscmA6rg5CIj3sNb9SGUO8Hr0A"
    }*/
   
}
  /**FINAL DE GET  para logear*/
/**INICIO DE POST */

app.post("/api/registrar",cors(),async (req, res, next) => {
    console.log("SI ENTRO A POST")
    try {
      const users = await pool.query(
        "INSERT INTO Usuario(usuario,password,email) VALUES('" +
          req.body.usuario +
          "','" +
          req.body.password +
          "','" +
          req.body.email +
          "')"
      );
      const tokens = tk.sign({_id: req.params.id},key)
      res.json({tokens})
      console.log("EXITO :D")
      return res.send(users.rows);
      //token de chester eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDczMjU3NDl9.tgvIXw4FFg7FHU5T_sS1WU4sPFV7yYNbQJAKpgdeuTg
    } catch (error) {
      console.log("AQUI ESTA EL ERROR ")
      console.log(error)
      console.log("ARRIBA DE ESTO ESTA EL ERROR ")
    }
   
  }
);
/**FIN DE POST */
/**INICIO DE BUSQUEDA */
app.get("/api/empleado/:id", cors(), async (req, res) => {
  const id = req.params.id;
  console.log(id + " ESOT ES MI ID");
  const empeladoss = await pool.query("select * from Usuario where id = $1 ", [id,]);
  console.log(empeladoss);
});
/**FIN DE BUSQUEDA */
/**INICIO DE ACTUALIZAR */
app.put("/api/usuario/:usuario/:password/:email",cors(),async (req, res, next) => {
    console.log("ENTRO A PUT");
    const id = req.params.id;
    try {
      console.log(id + " ESTO ES EL ID :D");
      const users = await pool.query(
        "UPDATE Usuario SET nombre ='" +
          req.params.usuario +
          "',apellido ='" +
          req.params.password +
          "',telefono ='" +
          req.params.email +
          "WHERE id = '" +
          id +
          "'"
      );
      return res.send(users.rows);
    } catch (error) {
      console.log("ESTE ERROR ES EN CATCH");
      console.log(error);
      console.log("ESTE ERROR ES EN CATCH");
      return res.send("ERROR :D");
    }
  }
);
/**FIN DE ACTUALIZAR */
/**INICIO DE BORRAR */
app.delete("/api/usuario/:id",cors(),async (req, res, next) => {
    console.log("ENTRE A DELETE");
    const id = req.params.id;
    const eliminar = await pool.query("DELETE FROM Usuario WHERE id = $1", [
      id,
    ]);
    res.json({ message: "EL EMPLEADO SE A ELIMINADO" + eliminar.rows });
  }
);
/**FIN DE ACTUALIZAR */
/**INICIO DE LA API */

/**ESTE EJECUTA TODO EL INDEX CON EL PUERTO DEL INICIO */
app.listen(PORT, () => console.log("servidor activo: " + PORT));
