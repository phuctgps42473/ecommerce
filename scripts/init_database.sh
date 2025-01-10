#!/bin/bash

# Set environment variables for database credentials
DB_NAME="ecommerce"
DB_USER="postgres"
DB_PASSWORD="password"
DB_CONTAINER_NAME="postgres-ecommerce"


# Run the PostgreSQL container with the specified credentials
docker run --name $DB_CONTAINER_NAME -e POSTGRES_DB=$DB_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASSWORD -p 5432:5432 -d postgres


# Output the details
echo "PostgresSQL container '$DB_CONTAINER_NAME' is running with database '$DB_NAME'."
echo "Username: $DB_USER"
echo "Password: $DB_PASSWORD"
