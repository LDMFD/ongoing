Using root AWS account, create user with following policy:

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "iam:CreateRole",
                "iam:AttachRolePolicy"
            ],
            "Resource": "*"
        }
    ]
}

Run `make create-function`

Then visit https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/ongoing-gateway?tab=configure

Add Trigger...
ongoing2, ongoing-prod, Open
