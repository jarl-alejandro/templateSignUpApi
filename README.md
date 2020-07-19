# Introduccción

Sistema de autenticacion REST de dos pasos.
Una pequeña variante a los sistemas mas populares creado desde cero.

1. Escribe un email
2. Confirma tu email
3. Link para crear ingresar contraseña
4. Listo.

SignIn, SignUp and Reset Password Template API node-nodemailer-jwt

# Sobre el Template

Sientete libre de hacer un fork o pull requests con mejoras de seguridad, de codigo y mejores practicas. Toda ayuda sera bien recibida.

Dependencias

```
 "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.8.7",
    "morgan": "^1.10.0",
    "nodemailer": "^6.4.10"
  },
```

nodemailer esta configurado para usar gmail. Puede ver la documentación de https://nodemailer.com/usage/using-gmail/ para mas información.

## Variables de entorno

Usted debería considerar estas variables

```
MONGO_NDB=mongodb+srv://<user>:<password>@cluster0-npffd.mongodb.net/<database>?
JWT_SECRET_TEXT=secret
GEMAIL_SENDER=example@gmail.com
GEMAIL_PASSWORD=password gmail
```

Hay metodos sin usar que son una guia para desarrolladores nuevos. Ademas de algunos ovbios comentarios.

# Rutas

api/users/signup
Formulario email

```
{ "email": "example@mail.com" }
```

api/user/signup/:token
Formulario password

```
{"password": "12345"}
```

api/users/signin
Formulario email y contraseña

```
 { "email": "example@mail.com" , "password":"12345"}
```

api/user/reset/
Formulario email

```
 {
     "email": "example@mail.com"
 }
```

api/user/reset/:token
Formulario newpassword

```
{
    "password":"123456"
}
```

# Licencia

# Error Codes

No parece haber ningun herror grave pero falta mucho testear y no es muy seguro ya que permite cualquier entrada como contraseña e email.

# Suport

Si esto te ha sido de utilidad. concidera donar \$1 USD
https://www.paypal.me/suportSignUpApi
