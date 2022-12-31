package Http

import (
	"github.com/pkg/errors"
	"io/ioutil"
	"net/http"
	"time"
)

func Fetch(url string) ([]byte, error) {
	timeout := time.Duration(5 * time.Second)
	client := http.Client{
		Timeout: timeout,
	}

	request, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	//var dump []byte
	//dump, err = httputil.DumpRequest(request, true)
	//var hash = fmt.Sprintf("%x", md5.Sum(dump))

	response, err := client.Do(request)
	if err != nil {
		return nil, errors.WithStack(err)
	}
	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	if response.StatusCode != http.StatusOK {
		return nil, errors.WithStack(errors.Errorf("Was expecting response code 200 but received %d: %s", response.StatusCode, url))
	}

	return responseBody, nil
}
