#create-role:
#	aws iam create-role \
#		--role-name lambda-ex \
#		--assume-role-policy-document file://trust-policy.json
#
#delete-role:
#	aws iam delete-role --role-name lambda-ex
#
#attach-policy:
#	aws iam attach-role-policy \
#		--role-name lambda-ex \
#		--policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
#
#detach-policy:
#	aws iam detach-role-policy \
#		--role-name lambda-ex \
#		--policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

create-function:
	zip function.zip index.js
	aws lambda create-function \
		--function-name ongoing-gateway \
		--zip-file fileb://function.zip \
		--handler index.handler \
		--runtime nodejs12.x \
		--timeout 10 \
		--role arn:aws:iam::283814941159:role/lambda-ex

delete-function:
	aws lambda delete-function \
		--function-name ongoing-gateway \

cycle:
	touch response.json
	rm response.json
	make delete-function
	make create-function
	make invoke
	cat response.json

# 3.9.144.222
invoke:
	aws lambda invoke \
		--function-name ongoing-gateway \
		--payload '{ "options": { "hostname": "20.90.255.64", "port": 8080, "path": "/", "method": "POST", "headers": { "Content-Type": "multipart/form-data", "X-Ongoing-Account": "zoho_paul1886", "X-Ongoing-App": "ongoing-suitability", "X-Ongoing-Secret": "4502a7a2fbcb11eb9d54df6f79480ef2" }}, "postData": "report=All_Clients" }' \
		response.json
