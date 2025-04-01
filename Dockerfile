# Imagen oficial de Maven con Java 17
FROM maven:3.9.4-eclipse-temurin-17 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todo el contenido del proyecto al contenedor
COPY . .

# Construye el proyecto con Maven
RUN mvn clean package -DskipTests

# Segunda etapa: Imagen final más liviana
FROM eclipse-temurin:17

WORKDIR /app

# Copia el JAR desde la imagen de build
COPY --from=build /app/target/productos-api-0.0.1-SNAPSHOT.jar app.jar

# Expón el puerto que usa tu app
EXPOSE 8080

# Comando para arrancar la app
CMD ["java", "-jar", "app.jar"]
