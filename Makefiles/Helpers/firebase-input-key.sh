#!/bin/bash

echo "Enter secret value for $SECRET followed by enter and then ctrl-d":

VALUE=$(</dev/stdin)
echo "$VALUE" | gcloud secrets versions add $SECRET --data-file=-

