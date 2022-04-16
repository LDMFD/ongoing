firebase-create-key:
	gcloud iam service-accounts keys create key-file \
		--iam-account=firebase-adminsdk-8yz3m@ongoing-test.iam.gserviceaccount.com

# https://stackoverflow.com/a/65637663
firebase-enable-logging:
	curl -d "{'monitoring':{'requestLogging':{'enabled':true}}}" \
		-H 'Authorization: Bearer ya29.A0ARrdaM8TEkqv6mH1x252Qec3oSdBTomG7NDu537MVtU5rRbyyWE8DZEqX_W_pGh7RpTpvq-T-AXH9cupSzrO89yVjT-vLg_a_QK38KKHXxLaL7ZrFbCdrusPBGRB__w7yJqvdOWPvfuHtHFw59bXvQHAsFvQ' \
		-X PATCH -H 'Content-Type: application/json' \
		https://identitytoolkit.googleapis.com/admin/v2/projects/ongoing-test/config?updateMask=monitoring.requestLogging.enabled
