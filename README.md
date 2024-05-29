<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

Documentación de endpoints: https://documenter.getpostman.com/view/17832534/2sA3QterTN

# School Backend

1. Clonar el proyecto
2. Ejecutar ```npm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar variables de entorno
5. Levantar la base de datos
```
docker-compose up -d
```
6. (opcional) En caso de no contar con docker y no poder hacer el punto anterior, es necesario levantar la base de datos localmente
7. Ejecutar ```npm run start:dev```
8. Ejecutar el seed. hacer una petición get a ```http://localhost:3000/api/seed``` 