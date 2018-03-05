
### IGNORE - NOT WORKING as of now - Set up Just-In-Time-Provisioning

Launch the CF templates with JIPT resources:
```bash
aws cloudformation deploy --template-file <repository root>/provisioning/jitp-registration-role-template.yaml --stack-name iot-reg-role --capabilities CAPABILITY_NAMED_IAM
aws cloudformation deploy --template-file <repository root>/provisioning/jitp-thing-policy-template.yaml --stack-name iot-policy
```

Register the JITP template:
```bash
ROLE_ARN=$(aws cloudformation describe-stacks --stack-name iot-reg-role --query 'Stacks[0].Outputs[?OutputKey==`RegistrationRoleArn`].OutputValue' --output text)
P_TEMPL=$(cat <repository root>/provisioning/jitp-provisioning-template.json)
ESCAPED_P_TEMPL=$(echo "${P_TEMPL//\"/\\\"}" | tr -d '\n')
REG_CONFIG="{ \"templateBody\": \"${ESCAPED_P_TEMPL}\", \"roleArn\": \"${ROLE_ARN}\" }"
CERT_ID=$(aws iot list-ca-certificates | jq -r '.certificates[0].certificateId')
aws iot update-ca-certificate --certificate-id $CERT_ID --new-auto-registration-status ENABLE --registration-config "$REG_CONFIG"
```