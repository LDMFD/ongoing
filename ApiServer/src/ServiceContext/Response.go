package ServiceContext

import "github.com/gin-gonic/gin"

type Response struct {
	FrameworkContext *gin.Context

	// Error code
	Error *string `json:"error"`

	// Dependent resources for IntegrityViolation
	Resources *[]string `json:"resources"`

	// Trace for InternalError
	Trace *string `json:"trace"`
}

func (response *Response) AddResource(resource string) {
	if response.Resources == nil {
		response.Resources = &[]string{}
	}
	for _, r := range *response.Resources {
		if r == resource {
			return
		}
	}
	*response.Resources = append(*response.Resources, resource)
}

func (response *Response) HasResource(resource string) bool {
	if response.Resources == nil {
		return false
	}
	for _, r := range *response.Resources {
		if r == resource {
			return true
		}
	}
	return false
}

func (response *Response) CheckIntegrity() {
	if response.Resources != nil && len(*response.Resources) > 0 {
		response.IntegrityViolation()
	} else {
		response.ReturnOK()
	}
}

func (response *Response) ReturnID(id *string) {
	var obj interface{}
	if id != nil {
		obj = gin.H{"Id": id}
	}
	response.FrameworkContext.JSON(200, obj)
}

func (response *Response) ReturnOK() {
	response.FrameworkContext.JSON(200, nil)
}
