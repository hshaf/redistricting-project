# Spring Server

Maven 3.5+

Use Oracle Java 17.0.8

MongoDB Community Server 7.0.2

MongoDB Compass 1.40.3

Make environment variable JAVA_HOME to the path of your java 17 folder

mvnw: The maven command for running the server

mvnw install : Builds the server

mvnw clean : Destroys current build of the server

mvnw spring-boot:run : Runs and builds the server on localhost:8080

# MongoDB Server

Open MongoDB Compass, connect to mongodb://localhost:27017, create a new database named "redistricting" with collections
named "state", "ensemble", "cluster", "boundary", and "district". Download updated "ensemble-data.json", place it in `../scripts`,
and run `python import-ensemble-data.py`.


## Controllers
When it comes to creating a grouping of similar commands, you will create a new controller.java file under
    data.connector.RedistrictConnector.Controllers, and within here you will design a parent endpoint for the class
    with functions containing child routes for querying different types of alike data.

## Services

The files that will be querying the database and performing operations

## Models

This holds the entities which are the equivalent of schema or tables.
