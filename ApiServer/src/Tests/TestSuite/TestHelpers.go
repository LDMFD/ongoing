package TestSuite

import (
	"bytes"
	"fmt"
	"github.com/gavv/httpexpect/v2"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"net/textproto"
	StorageCommands "ongoing/ApiServer/Advisor/Storage/Commands"
	"os"
	"testing"
)

func TestUpload(t *testing.T, e *httpexpect.Expect, userType string, filename string) string {
	createFileRequest := StorageCommands.RequestUploadRequestBody{Filename: "sample.png"}
	resp := e.POST("/api/storage/files").
		WithHeader("Authentication", userType).
		WithJSON(createFileRequest).
		Expect().Status(http.StatusOK).JSON().Object()
	url := resp.Value("Url").String()
	url.NotEmpty()
	fields := resp.Value("Fields").Object()

	client := &http.Client{}
	data, err := os.Open("Tests/TestSuite/TestData/sample.png")
	if err != nil {
		log.Fatal(err)
	}

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	var part io.Writer

	// Instead of writer.CreateFormFile() which hardcodes the mimetype to octet-stream
	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition",
		fmt.Sprintf(`form-data; name="%s"; filename="%s"`, "file", filename))
	h.Set("Content-Type", "image/png")

	if part, err = writer.CreatePart(h); err != nil {
		log.Fatal(err)
	}
	io.Copy(part, data)

	var uid string
	for _, k := range fields.Keys().Iter() {
		key := k.String().Raw()
		value := fields.Value(key).String().Raw()
		writer.WriteField(key, value)

		if key == "key" {
			uid = value
		}
	}
	writer.Close()

	if os.Getenv("OFFLINE_TESTS") != "true" {
		req, err := http.NewRequest("POST", url.Raw(), body)
		if err != nil {
			log.Fatal(err)
		}
		req.Header.Set("Content-Type", writer.FormDataContentType())

		var postResp *http.Response
		if postResp, err = client.Do(req); err != nil {
			panic(err.Error())
		}

		if _, err = ioutil.ReadAll(postResp.Body); err != nil {
			panic(err.Error())
		}

		if postResp.StatusCode != 204 { // 204 No Content
			t.Fail()
		}
	}

	var info os.FileInfo
	if info, err = data.Stat(); err != nil {
		panic(err)
	}

	// Signal upload complete
	signalUploadRequest := StorageCommands.SignalUploadRequest{
		Uid:      uid,
		Filename: filename,
		Size:     info.Size(),
	}
	e.POST("/api/storage/signal").
		WithHeader("Authentication", userType).
		WithJSON(signalUploadRequest).
		Expect().Status(http.StatusOK).JSON().Object()

	return uid
}

func TestDownload(t *testing.T, e *httpexpect.Expect, userId string, fileId string, expectedPass bool) {
	resp := e.GET("/api/storage/files").
		WithQuery("Uid", fileId).
		WithHeader("Authentication", userId).
		Expect()
	if expectedPass {
		resp.Status(http.StatusOK)
	} else {
		resp.Status(http.StatusForbidden)
		return
	}
	url := resp.JSON().Object().Value("Url").String()
	url.NotEmpty()
	urlStr := url.Raw()

	if os.Getenv("OFFLINE_TESTS") != "true" {
		resp2, err := http.Head(urlStr)
		if err != nil {
			t.Fail()
		}
		if resp2.StatusCode != http.StatusOK {
			t.Fail()
		}
	}
}
