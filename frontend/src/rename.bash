#!/bin/bash

for file in *.jsx
do
 mv "$file" "${file%.jsx}.js"
done
