//CONEXION A BASE DE DATOS.
const { error } = require("console");
const { Pool } = require("pg");

const config = {
  //host: "44.203.195.203",
  host: "ec2-34-226-10-158.compute-1.amazonaws.com",
  user: "mauricio",
  password: "1234",
  port: 5432,
  database: "soa",
};

const pool = new Pool(config);
//SENTENCIAS DE POSTGRESQL
// Necesitamos agregar un puerto de entrada "Acceso"
const PORT = process.env.PORT || 8080;
// Aquí agregaremos las librerias a utilizar "las invocamos"
const express = require("express"); // la palabra require lo unico que hace es requerir la libreria
// como la variable express es una libreria la creo como una clase para poder utlizar sus metodos y funciones
const app = express();
// path nos ayudara a saber donde sera la ruta de guardado
const path = require("path");
// Nos ayudara a gestionar los ficheros seleccionados
const multer = require("multer");
//Nos ayudara a conexion de otro servidor
var cors = require("cors");
// Lo que se esta haciendo aquí es decir donde estara nuestro storage de alamacenamiento de archivos
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload");
  },
  // Aqui es que cada vez que se suba algo , este le asigne un nombre y recuerden que no tiene que repetir
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
// storage es la variable que contiene las propiedades y lo que hacemos aquí es asignarla a multer
// para que ella trabaja en los ficheros
const subir = multer({ storage });
app.use("/upload", express.static(path.join(__dirname, "/upload")));

//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* ESTA PARTE ES DONDE LE DAMOS AUTORIZACION A TODOS LOS CRUDS CON CORS */
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
app.get("/api/empleado", cors(), async (req, res) => {
  try {
    console.log("SI ENTRO A GET");
    const users = await pool.query("select * from empleados");
    return res.send(users.rows);
  } catch (error) {
    console.log("ERROR");
    console.log(error);
  }
});
/**FINAL DE GET */
/**INICIO DE POST */
app.post(
  "/api/empleado/:nombre/:apellido/:telefono",
  subir.single("imagen"),
  cors(),
  async (req, res, next) => {
    const file = req.file;
    if (!file) {
      var imagenes =
        "http://ec2-18-234-162-185.compute-1.amazonaws.com:8080/upload/noImage.png";
    } else {
      console.log("si hay datos");
      var imagenes = "http://ec2-18-234-162-185.compute-1.amazonaws.com:8080/";
      imagenes += file.path.replace("\\", "/");
    }
    try {
      console.log(imagenes);
      const users = await pool.query(
        "INSERT INTO empleados(nombre,apellido,telefono,imagen) VALUES('" +
          req.params.nombre +
          "','" +
          req.params.apellido +
          "','" +
          req.params.telefono +
          "','" +
          imagenes +
          "');"
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
/**FIN DE POST */
/**INICIO DE BUSQUEDA */
app.get("/api/empleado/:id", cors(), async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id + " ESOT ES MI ID");
    const empeladoss = await pool.query(
      "select * from empleados where id = $1 ",
      [id]
    );
    res.json({ message: empeladoss.rows });
    console.log(empeladoss);
  } catch (error) {
    console.log("ERROR", error);
  }
});
/**FIN DE BUSQUEDA */
/**INICIO DE ACTUALIZAR */
app.put(
  "/api/empleado/:id/:nombre/:apellido/:telefono",
  cors(),
  subir.single("imagen"),
  async (req, res, next) => {
    console.log("ENTRO A PUT");
    const id = req.params.id;
    const file = req.file;
    if (!file) {
      var imagenes =
        "http://ec2-18-234-162-185.compute-1.amazonaws.com:8080/upload/noImage.png";
    } else {
      console.log("si hay datos");
      var imagenes = "http://ec2-18-234-162-185.compute-1.amazonaws.com:8080/";
      imagenes += file.path.replace("\\", "/");
    }
    try {
      console.log(imagenes);
      console.log(id + " ESTO ES EL ID :D");
      const users = await pool.query(
        "UPDATE empleados SET nombre ='" +
          req.params.nombre +
          "',apellido ='" +
          req.params.apellido +
          "',telefono ='" +
          req.params.telefono +
          "',imagen ='" +
          imagenes +
          "'" +
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
app.delete(
  "/api/empleado/:id",
  subir.single("imagen"),
  cors(),
  async (req, res, next) => {
    try {
      console.log("ENTRE A DELETE");
      const id = req.params.id;
      const eliminar = await pool.query("DELETE FROM empleados WHERE id = $1", [
        id,
      ]);
      res.json({ message: "EL EMPLEADO SE A ELIMINADO" + eliminar.rows });
    } catch (error) {
      console.log("ERROR ", error);
    }
  }
);
/**FIN DE ACTUALIZAR */
// /**INICIO DE LA API */
// /**INICIO DE LOGIN */
// app.get("/appi/login/:usuario/:password", async (req, res, next) => {
//   try {
//     console.log("EENTOR A GET DE LOGIN");
//     const usuario = req.params.usuario;
//     const password = req.params.password;
//     console.log("ESTO TRAE LOS PARAS " + usuario + "  " + password);
//     const user = await pool.query(
//       "select id,usuario FROM usuario WHERE usuario = '" +
//         usuario +
//         "' and password = '" +
//         password +
//         "'"
//     );
//     if (user.rows[0] == null) {
//       console.log("NO EXISTE EL USUARIOS");
//       return res.send(null);
//     } else {
//       return res.send(user.rows);
//     }
//   } catch (error) {
//     console.log("ERROR: " + error);
//   }
// });
// /**FIN DE LOGIN */
// /**INICIO DEL REGISTRO */
// app.post("/appi/registro", async (req, res) => {
//   try {
//     const { usuario, password, email } = req.body;
//     console.log(usuario, password, email);
//     const users = await pool.query(
//       "INSERT INTO usuario (usuario,password,email) VALUES ($1,$2,$3)",
//       [usuario, password, email]
//     );
//     return res.send(users.rows);
//   } catch (error) {
//     console.log("ERROR ", error);
//   }
// });
// /**FIN DEL REGISTRO */
// app.get("/", async (req, res) => {
//   try {
//     const users = await pool.query("SELECT * FROM usuario");
//     res.json(users.rows);
//   } catch (error) {
//     console.log("ERROR ", error);
//   }
// });
/**ESTE EJECUTA TODO EL INDEX CON EL PUERTO DEL INICIO */

app.listen(PORT, () => console.log("servidor activo: " + PORT));
