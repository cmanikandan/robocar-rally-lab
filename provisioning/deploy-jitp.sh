#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

CA_CERT_ID=$(aws iot list-ca-certificates | jq -r '.certificates[0].certificateId')
CA_ROLE_NAME=IotRegistrationRole

# Deploy infrastructure
aws cloudformation deploy \
    --template-file $DIR/jitr-common.yaml \
    --stack-name JITR-Infrastructure \
    --parameter-overrides RoleName=$CA_ROLE_NAME \
    --capabilities CAPABILITY_NAMED_IAM

OUTPUTS=$(aws cloudformation describe-stacks --stack-name JITR-Infrastructure --query Stacks[0].Outputs)
REG_ROLE_ARN=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey | contains("RegistrationRoleArn")) | .OutputValue')
POLICY_NAME=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey | contains("PolicyName")) | .OutputValue')
POLICY_ARN=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey | contains("PolicyArn")) | .OutputValue')
THING_TYPE_NAME=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey | contains("ThingTypeName")) | .OutputValue')
THING_GROUP_NAME=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey | contains("ThingGroupName")) | .OutputValue')
# Create ThingType and ThingGroup (not supported by CF yet)
THING_TYPE_ARN=$(aws iot create-thing-type --thing-type-name ${THING_TYPE_NAME} --query thingTypeArn --output text)
THING_GROUP_ARN=$(aws iot list-thing-groups --query 'thingGroups[?groupName==`'"${THING_GROUP_NAME}"'`].groupArn' --output text)
if [ -z "${THING_GROUP_ARN// }" ]; then
    THING_GROUP_ARN=$(aws iot create-thing-group --thing-group-name ${THING_GROUP_NAME} --query thingGroupArn --output text)
fi

# Attach policy to group
aws iot attach-policy --policy-name $POLICY_NAME --target $THING_GROUP_ARN

# Deploy JITR lambda
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
    --parameter-overrides CaCertificateId=$CA_CERT_ID \
                          PolicyName=$POLICY_NAME \
                          PolicyArn=$POLICY_ARN \
                          ThingTypeName=$THING_TYPE_NAME \
                          ThingTypeArn=$THING_TYPE_ARN \
                          ThingGroupName=$THING_GROUP_NAME \
                          ThingGroupArn=$THING_GROUP_ARN \
    --capabilities CAPABILITY_IAM

rm $DIR/packaged-template.json

# Register registration-config
REG_CONFIG=$(node -p "JSON.stringify( { templateBody: JSON.stringify(require('${DIR}/jitp-template')), roleArn: '${REG_ROLE_ARN}' })")
aws iot update-ca-certificate --certificate-id $CA_CERT_ID --new-auto-registration-status ENABLE --registration-config $REG_CONFIG

# Print info
echo $CA_CERT_ID
echo $CA_ROLE_NAME
echo $POLICY_NAME
echo $POLICY_ARN
echo $THING_TYPE_NAME
echo $THING_TYPE_ARN
echo $THING_GROUP_NAME
echo $THING_GROUP_ARN
echo "----"
echo $REG_CONFIG
aws iot describe-ca-certificate --certificate-id $CA_CERT_ID