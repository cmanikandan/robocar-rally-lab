#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/jitr-lambda
npm install
cd $DIR

aws cloudformation package \
    --s3-bucket robocar-rally-lab \
    --s3-prefix robocar \
    --template-file $DIR/jitr-lambda-template.yaml \
    --output-template-file $DIR/packaged-template.json

aws cloudformation deploy \
    --template-file $DIR/packaged-template.json \
    --stack-name JITR-Lambda \
    --capabilities CAPABILITY_IAM

rm $DIR/packaged-template.json