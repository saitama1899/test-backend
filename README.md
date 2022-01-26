> ### Dependencias
>
> #### Desarrollo
>
> - *eslint* para el formateo automatico de js en base a standard
>
> - *jest* para el testing
>
> - *heroku* para hacer deploy a heroku
>
> - *nodemon* para actualizar los cambios sin reiniciar el servidor en local
>
> - *supertest* para tests relacionados con conexiones y peticiones
>
> #### Producción
>
> - *mongoose* para la conexion y manejo de la BD con mongodb cloud
>
> - *express* para la creacion de la api rest
>
> - *cors* para filtrar desde que origen se pueden hacer peticiones a la api
>
> - *cross-env* para configurar los distintos entornos y hacerlo funcional en windows y linux
>
> - *dotenv* para poder utilizar variables de entorno desde el archivo .env
>
> - *bcrypt* para encriptar información sensible
>
> - *mongoose-unique-validator* para definir valores que deben ser unicos en los modelos
>
> - *jsonwebtoken* para la autenticación de usuarios
>
>

Para el deploy a producción con heroku y mongodb atlas:
- Crear un Procfile y ejecutar un heroku create
- Push a github y despues al git de heroku con: git push heroku rama
- Indicar en el package los distintos entornos
- Indicar a heroku variables de entorno -> heroku config:set MONGO_DB_URI=blabla
- Indicar en la ip whitelist de mongodb atlas la ip de heroku (solo se puede indicando anywhere: 0.0.0.0/0)