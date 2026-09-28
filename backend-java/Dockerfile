# Build stage - compile the Java application
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven configuration and source code
COPY pom.xml .
COPY src ./src

# Build the application (skip tests for faster builds)
RUN mvn clean package -DskipTests

# Runtime stage - run the compiled application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8082 for Spring Boot
EXPOSE 8082

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
