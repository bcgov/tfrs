#!/bin/bash

# Comment out the tech stack for which you are generating
# NOTE: if you want to generate both the front and backend, you might want to
# setup two runs of the generator - the backend and frontend, with different tech stacks
TARGET_STACK="fuse"
TARGET_STACK="javascript-closure-angular"
TARGET_STACK="aspnetmvc"
TARGET_STACK="django"

# Adjust these lines to set the names and locations of the code generator jars
executable="swagger-codegen-extension-1.0.1-jar-with-dependencies.jar;swagger-codegen-cli.jar"

# Set the code elements to be generate
GEN_OPTIONS="-DapiTests=true -DmodelTests=true"

# Set the output path
OUTPUT="gen/"

# Set the Config File
CONFIG_FILE="swagger-codegen-config.json"

# Set the swagger file
SWAGGER_FILE="TFRSswagger.yaml"

# TODO - Convert this to bash
# Process required command line options to override defaults
# IF "%1."=="." GOTO :USAGE
# SWAGGER_FILE=%1
# SHIFT

# Process optional arguments
# :loop
# IF NOT "%1"=="" (
#     IF "%1"=="-output" (
#         SET OUTPUT=%2
#         SHIFT
#     )
#     IF "%1"=="-config" (
#         SET CONFIG_FILE=%2
#         SHIFT
#     )
#     IF "%1"=="-stack" (
#         SET TARGET_STACK=%2
#         SHIFT
#     )
#     IF "%1"=="-jars" (
#         SET executable=%2
#         SHIFT
#     )
#     SHIFT
#     GOTO :loop
# )
# 
# :RUN

# Check if the jars list was set on the command line
# if NOT "%executable%."=="." GOTO :GO

# Adjust the JARs based on the tech stack chosen - possibly from the command line
# Adjust these lines to set the names and locations of the code generator jars
# executable=swagger-codegen-extension-1.0.1-jar-with-dependencies.jar;swagger-codegen-cli.jar

# :GO
JAVA_OPTS="-Dfile.encoding=UTF-8 $GEN_OPTIONS -Xmx1024M"
args="generate -i $SWAGGER_FILE -l $TARGET_STACK -c $CONFIG_FILE -o $OUTPUT"

echo Command to be run: java $JAVA_OPTS -cp $executable io.swagger.codegen.SwaggerCodegen $args
java $JAVA_OPTS -cp $executable io.swagger.codegen.SwaggerCodegen $args

# GOTO End1

# :USAGE
# echo ERROR: Arguments required for this script
# echo USAGE: %0 ^<Swagger file^> ^[-stack ^<aspnetmvc^|django^|fuse^|javascript-closure-angular^> -config ^<config file^> -output ^<output folder^> -jars ^<jar^;jar^>]
# echo The jars must support the tech stack selected.
# echo Default arguments:
# echo ^ ^ Target Stack: %TARGET_STACK%
# echo ^ ^ Code to Generate: %GEN_OPTIONS%
# echo ^ ^ Config File: %CONFIG_FILE%
# echo ^ ^ Output Location: %OUTPUT%

# :End1
