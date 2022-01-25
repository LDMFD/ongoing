package Commands

import (
	"cloud.google.com/go/storage"
	"io/ioutil"
	"time"
)

func GenerateSignedGetUrl(jsonPath, bucketName, objectName string) (url string) {
	var (
		err error
		key []byte
	)
	if key, err = ioutil.ReadFile(jsonPath); err != nil {
		panic(err)
	}

	if url, err := storage.SignedURL(bucketName, objectName, &storage.SignedURLOptions{
		GoogleAccessID:  "storage@ongoing-test.iam.gserviceaccount.com",
		PrivateKey:      key,
		Method:          "GET",
		Expires:         time.Now().Add(time.Second * 60),
	}); err != nil {
		panic(err)
	} else {
		return url
	}
}

// explicit reads credentials from the specified path.
func GenerateSignedPostPolicy(jsonPath, bucketName, objectName, filename string) (url string, fields map[string]string) {
	var (
		err error
		pv4 *storage.PostPolicyV4
	)
	var key []byte
	if key, err = ioutil.ReadFile(jsonPath); err != nil {
		panic(err)
	}

	if pv4, err = storage.GenerateSignedPostPolicyV4(bucketName, objectName, &storage.PostPolicyV4Options{
		GoogleAccessID: "storage@ongoing-test.iam.gserviceaccount.com",
		PrivateKey:     key,
		Expires:        time.Now().Add(time.Second * 60),
		Fields: &storage.PolicyV4Fields{
			CacheControl:           "no-cache,max-age=0",
			ContentDisposition:     "attachment; filename=" + filename,
		},
	}); err != nil {
		panic(err)
	}
	return pv4.URL, pv4.Fields
}
