# Set context (writes to OS keychain):

zed context set local localhost:50051 spice --insecure

# Write schema:

zed schema write permissions.zed

zed schema read
zed relationship read organisation


# Validation:

zed validate permissions.yaml


# Notes:

$ zed relationship read organisation
organisation:c7d206039b9a4dc981b7c0f73c81dc8b owner user:98b4213a37c94043a79cf733fa3090b1
organisation:c7d206039b9a4dc981b7c0f73c81dc8b client user:8e28e606f84742299b28dd60af85ee4e


$ zed relationship read client
client:8e28e606f84742299b28dd60af85ee4e org organisation:c7d206039b9a4dc981b7c0f73c81dc8b
client:8e28e606f84742299b28dd60af85ee4e advisor user:98b4213a37c94043a79cf733fa3090b1
client:8e28e606f84742299b28dd60af85ee4e subject user:8e28e606f84742299b28dd60af85ee4e

zed permission check client:b4b4a3708f9b49adaa14a518dccb6d4e read user:b4b4a3708f9b49adaa14a518dccb6d4e
true

# client.org == organisation
zed permission lookup client org organisation:c7d206039b9a4dc981b7c0f73c81dc8b
b4b4a3708f9b49adaa14a518dccb6d4e

# clients that this user can read
zed permission lookup client read user:98b4213a37c94043a79cf733fa3090b1
b4b4a3708f9b49adaa14a518dccb6d4e

# Advisor can write to this org (client subject cannot)
zed permission lookup organisation write user:98b4213a37c94043a79cf733fa3090b1
c7d206039b9a4dc981b7c0f73c81dc8b

zed permission lookup client org organisation:c7d206039b9a4dc981b7c0f73c81dc8b
f64320553ecb430aa5c65b695e01ba0e

# Lookup the organisations a client can access
zed permission lookup organisation client user:f64320553ecb430aa5c65b695e01ba0e
c7d206039b9a4dc981b7c0f73c81dc8b

# Why can this user read this file?
zed permission check file:d84acb84bc564063a40b13ca51a5ff3c read user:81350a4b633f457e9f6e1af89e189fa8 --explain
