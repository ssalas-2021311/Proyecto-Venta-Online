
Renombrar el archivo example.env a .env, esto es con la intención de tener las variables de entorno
configuradas en le proyecto, se estara agregando más en el futuro.

Para instalar los modulos de node ejecutar el comando
```
npm install
```
Para ejecutar el proyecto
```
npm run dev
```


*antes de ejecutar se debe agregar previamente desde la base de datos (mongoDb) los roles (ADMIN_ROLE, CLIENT_ROLE).
*antes de ejecutar se debe agregar un usuario admin quitando la validacion "esAdminRole" luego ponerla nuevamente para que funcione bien.
-Las peticiones se encuentran en las carpetas, se llama: "Venta-Online-peticiones.postman_collection.json" pero son peticiones generelaes
 hay que cambiar el final de las URL es decir el nombre de los metodos. 
