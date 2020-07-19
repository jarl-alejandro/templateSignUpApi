const User = require("../models/User");
const jwt = require("jsonwebtoken");
const userHelper = require("../helpers/user.helpers");
console.log(userHelper);

const usersCtrl = {};

//eliminar este metodo

usersCtrl.getUser = async (req, res) => {
  const user = await User.findById(req.params.id, { email: 1, credit: 1 });
  const adverts = await Advert.find({ owner: req.params.id });
  res.json({ ok: true, message: "usuario", user, adverts });
};

usersCtrl.getSingIn = (req, res) => {
  res.send("Sing in ");
};

usersCtrl.signIn = async (req, res) => {
  const { email, password } = req.body;

  //verificando email
  const user = await User.findOne(
    { email },
    { credit: 1, email: 1, password: 1 }
  );
  if (!user) return res.json({ ok: false, message: "el usuario no existe" });

  //validando password
  const isPaswordMatch = await user.matchPassword(password);
  if (!isPaswordMatch)
    return res.json({
      ok: false,
      message: "el password es incorrecto",
      recoverPasswordUrl: "http://" + req.headers.host + "/api/users/reset/",
    });

  //respondiendo usuario y token
  const payload = {
    id: user._id,
    email: user.email,
  };
  const token = await jwt.sign(payload, process.env.JWT_SECRET_TEXT, {
    expiresIn: 60 * 60 * 24,
  });

  res.json({ ok: true, message: "bienvendio", user, token });
};

usersCtrl.getCreateUser = (req, res) => {
  res.send("sign up ");
};


usersCtrl.createUser2 = async (req, res) => {
  const { email } = req.body;

  //comprobando usuario
  const user = await User.findOne({ email }, { email: 1 });
  if (user)
    return res.json({
      ok: false,
      message: "Este mail ya esta registrado",
      signInUrl: "http://" + req.headers.host + "/api/users/signin/",
    });
  const token = await jwt.sign({ email }, process.env.JWT_SECRET_TEXT, {
    expiresIn: 1000,
  });

  //----contenido de email

  const subject = ` Raul Zarza 👻 <${process.env.GEMAIL_SENDER}>`;
  const content = `
    Para continuar con tu registro, por favor sigue éste enlace :\n\n
    http://${req.headers.host}/api/users/signup/${token}\n\n
    Recibiste este correo para registrarte en nadamas.com.mx. Si no hiciste esta petición o no estas seguro puedes visitarnos <a href='http:// nadamas.com.mx'> nadamas.com.mx/información </a> .\n,
    `;

  await userHelper.sendEmail(email, subject, content);

  const link = `http:// ${req.headers.host}/api/users/signup/${token}`;
  res.json({ ok: true, message: "email enviado correctamente" });
};

usersCtrl.getTokenSignup = async (req, res) => {
  const { token } = req.params;
  console.log(token);
  jwt.verify(token, process.env.JWT_SECRET_TEXT, function (err, token) {
    if (err) {
      console.log(err);
      res.send(
        "Parece que hubo un error. Trata de nuevo http://" +
          req.headers.host +
          "/api/users/signup/"
      );
    } else {
      console.log("token", token);
      res.send("Exito, ahora introce tu contraseña");
    }
  });
};

usersCtrl.tokenSignup = async (req, res) => {
  const { token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET_TEXT, async function (err, info) {
    if (err) {
      console.log(err);
      res.json({
        ok: false,
        message:
          "Parece que hubo un error. Trata de nuevo http://" +
          req.headers.host +
          "/api/users/signup/",
      });
    } else {
      console.log("token", info);
      const user = await User.findOne({ email: info.email }, { email: 1 });
      if (user)
        return res.json({
          ok: false,
          message: "este mail ya esta registrado",
          recoverPasswordUrl:
            "http://" + req.headers.host + "/api/users/reset/",
        });

      const newUser = new User({
        email: info.email,
      });
      newUser.password = await newUser.encryptPassword(req.body.password);
      const payload = {
        id: newUser._id,
        email: newUser.email,
      };
      const token = await jwt.sign(payload, process.env.JWT_SECRET_TEXT, {
        expiresIn: 100,
      });
      newUser.save();
      res.json({
        ok: true,
        message: "Usuario creado con exito",
        newUser,
        token,
      });
    }
  });
};

usersCtrl.resetPass = async (req, res) => {
  const { email } = req.body;

  const subject = ` Raul Zarza 👻 <${process.env.GEMAIL_SENDER}>`;
  const content = `
  Recibiste este correo por que intentas recuperar tu contraseña. Si no has sido tu, por favor ignora este mensaje.\n\n
  Para reestablecer tu password da sigue éste enlace :\n\n"
    http://${req.headers.host}/api/users/reset/${token}\n\n
    Recibiste este correo desde nadamas.com.mx . Si no hiciste esta petición o no estas seguro puedes visitarnos <a href='http:// nadamas.com.mx'> nadamas.com.mx/información </a> .\n,
    `;

  await userHelper.sendEmail(email, subject, content);

  const link = `http:// ${req.headers.host}/api/users/signup/${token}`;
  res.json({ ok: true, message: "email enviado correctamente" });

};

usersCtrl.getResetPass = (req, res) => {
  res.json({
    ok: true,
    message: "Get reset password",
  });
};
usersCtrl.getResetForm = async (req, res) => {
    res.json({
        ok: true,
        message: "Get reset Form",
      });
};

usersCtrl.resetForm = (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.JWT_SECRET_TEXT, async function (err, info) {
    if (err) {
      console.log(err);
      res.json({
        ok: false,
        message:
          "Parece que hubo un error. Trata de nuevo http://" +
          req.headers.host +
          "/api/users/signup/",
      });
    } else {
      const userExist = await User.findOne({ email: info.email });
      if (userExist) {
        const result = await User.findOneAndUpdate(
          { email: info.email },
          { password }
        );

        result.password = await result.encryptPassword(req.body.password);
        const payload = {
          id: result._id,
          email: result.email,
        };
        const token = await jwt.sign(payload, process.env.JWT_SECRET_TEXT, {
          expiresIn: 100,
        });
        result.save();
        res.json({
          ok: true,
          message: "Password actualizado con exito",
          result,
          token,
        });
      }
    }
  });
};
usersCtrl.deleteUser = async (req, res) => {
  const userDeleted = await User.findByIdAndDelete(req.params.id);
  if (!userDeleted) return res.json({ message: "este usuario no existe" });
  if (userDeleted)
    return res.json({ ok : true , message: "eliminando a " + userDeleted.email });
};

usersCtrl.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user.email);
};

module.exports = usersCtrl;
