package Commands

import (
	"io/ioutil"
	"os"
	"time"

	"cloud.google.com/go/storage"
)

func GenerateSignedGetUrl(objectName string) (url string) {
	var (
		err error
		key []byte
	)
	pemPath := os.Getenv("ONGOING_STORAGE_CREDENTIAL")
	serviceAccount := os.Getenv("ONGOING_STORAGE_SA")
	bucketName := os.Getenv("ONGOING_STORAGE_BUCKET")

	if key, err = ioutil.ReadFile(pemPath); err != nil {
		panic(err)
	}

	if url, err := storage.SignedURL(bucketName, objectName, &storage.SignedURLOptions{
		GoogleAccessID:  serviceAccount,
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
func GenerateSignedPostPolicy(objectName, filename string) (url string, fields map[string]string) {
	var (
		err error
		pv4 *storage.PostPolicyV4
	)
	pemPath := os.Getenv("ONGOING_STORAGE_CREDENTIAL")
	serviceAccount := os.Getenv("ONGOING_STORAGE_SA")
	bucketName := os.Getenv("ONGOING_STORAGE_BUCKET")

	var key []byte
	if key, err = ioutil.ReadFile(pemPath); err != nil {
		panic(err)
	}

	if pv4, err = storage.GenerateSignedPostPolicyV4(bucketName, objectName, &storage.PostPolicyV4Options{
		GoogleAccessID: serviceAccount,
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
