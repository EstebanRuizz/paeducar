const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

////////////////////////////////////////////////////
passport.use('local.signin', new LocalStrategy({
  usernameField: 'correo_usuario',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, correo_usuario, password, done) => {
  
  console.log(req.body,' <<< FROM passport.js >>');
  console.log(correo_usuario,' <<< FROM passport.js >>');
  console.log(password,' <<< FROM passport.js >>');

   const rows = await pool.query('SELECT * FROM usuario WHERE correo_usuario = ?', [correo_usuario]);
    if (rows.length > 0) 
    {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(password, user.password)

  
      if (validPassword) 
      {
        done(null, user, req.flash('success', 'Welcome ' + user.nombres));
      }
      else
      {
        done(null, false, req.flash('message', 'Incorrect Password'));
      }
    } 
    else
    {
      return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
}));

passport.use('local.signup', new LocalStrategy({
  id_usuarioField: 'id_usuario',
  correo_usuarioField: 'correo_usuario',
  nombresField: 'nombres',
  apellidosField: 'apellidos',
  telefonoField: 'telefono',
  passwordField: 'passport',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { package } = req.body;
  console.log(package);
  let newUser = {
    id_usuario,
    correo_usuario,
    nombres,
    apellidos,
    telefono,
    password,
  };
  newUser.password = await helpers.encryptPassword(password);
  // Saving in the Database
  try{
    const result = await pool.query('INSERT INTO usuario SET ? ', newUser);
  }catch{
   
  }
 
  //newUser.id = result.insertId;
  console.log(result,' <<< FROM passport.js >>');
  return done(null, newUser);
}));


passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

passport.deserializeUser(async (id_usuario, done) => {
  const rows = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);
  done(null, rows[0]);
}); 
