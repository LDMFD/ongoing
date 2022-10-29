package TestSuite

import (
	"github.com/gavv/httpexpect/v2"
	"net/http"
	"ongoing/ApiServer/Advisor/Clients/Commands/FactFinds"
	"ongoing/ApiServer/Advisor/Clients/Commands/RiskAssessments"
	"ongoing/Entities"
	"testing"
)

func TestCreateDocuments(t *testing.T, e *httpexpect.Expect) {
	CreateRiskAssessment(t, e)
	CreateFactFind(t, e)
	CreateFeesReport(t, e)
	CreateForecast(t, e)
}

func CreateRiskAssessment(t *testing.T, e *httpexpect.Expect) {
	assessmentFileId = TestUpload(t, e, ORG1_ADVISOR, "assessment-c.png")

	request := RiskAssessments.CreateOrUpdateRiskAssessmentRequestBody{
		RiskProviderId: riskProviderId,
		RiskLevelId:    riskLevelId,
		Completed:      "2006-01-02T15:04:05Z",
		Questionnaire: &Entities.RequestFile{
			Uid:      assessmentFileId,
			Filename: "assessment-b.png",
		},
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/risk-assessments").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	assessmentId = resp.JSON().Object().Value("Id").String().Raw()

	TestDownload(t, e, ORG1_OWNER, assessmentFileId, true)
	TestDownload(t, e, ORG1_ADMIN, assessmentFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, assessmentFileId, true)
	TestDownload(t, e, ORG2_OWNER, assessmentFileId, false)
	TestDownload(t, e, ORG1_CLIENT, assessmentFileId, true)

	// Update the file
	fileId2 := TestUpload(t, e, ORG1_ADVISOR, "sample.png")
	request.Questionnaire = &Entities.RequestFile{
		Uid:      fileId2,
		Filename: "sample.png",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/risk-assessments/"+assessmentId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Test old file no longer available
	TestDownload(t, e, ORG1_OWNER, assessmentFileId, false)
	TestDownload(t, e, ORG1_ADMIN, assessmentFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, assessmentFileId, false)
	TestDownload(t, e, ORG1_CLIENT, assessmentFileId, false)

	// Delete it
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/risk-assessments/"+assessmentId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, fileId2, false)
	TestDownload(t, e, ORG1_ADMIN, fileId2, false)
	TestDownload(t, e, ORG1_ADVISOR, fileId2, false)
	TestDownload(t, e, ORG1_CLIENT, fileId2, false)

	// Recreate it again
	assessmentFileId = TestUpload(t, e, ORG1_ADVISOR, "assessment-c.png")
	request.Questionnaire = &Entities.RequestFile{
		Uid:      assessmentFileId,
		Filename: "assessment-c.png",
	}
	resp = e.POST("/api/advisor/clients/"+org1ClientId+"/risk-assessments").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	assessmentId = resp.JSON().Object().Value("Id").String().Raw()

	TestDownload(t, e, ORG1_OWNER, assessmentFileId, true)
	TestDownload(t, e, ORG1_ADMIN, assessmentFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, assessmentFileId, true)
	TestDownload(t, e, ORG2_OWNER, assessmentFileId, false)
	TestDownload(t, e, ORG1_CLIENT, assessmentFileId, true)
}

func CreateFactFind(t *testing.T, e *httpexpect.Expect) {
	factFindFileId = TestUpload(t, e, ORG1_ADVISOR, "fact-find.png")

	request := FactFinds.CreateOrUpdateFactFindRequestBody{
		File: &Entities.RequestFile{
			Uid:      factFindFileId,
			Filename: "fact-find.png",
		},
		Submitted: "2006-01-02T15:04:05Z",
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/fact-finds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	factFindId = resp.JSON().Object().Value("Id").String().Raw()

	TestDownload(t, e, ORG1_OWNER, factFindFileId, true)
	TestDownload(t, e, ORG1_ADMIN, factFindFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, factFindFileId, true)
	TestDownload(t, e, ORG2_OWNER, factFindFileId, false)
	TestDownload(t, e, ORG1_CLIENT, factFindFileId, true)

	// Update the file
	fileId2 := TestUpload(t, e, ORG1_ADVISOR, "fact-find-b.png")
	request.File = &Entities.RequestFile{
		Uid:      fileId2,
		Filename: "fact-bind-b.png",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/fact-finds/"+factFindId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Test old file no longer available
	TestDownload(t, e, ORG1_OWNER, factFindFileId, false)
	TestDownload(t, e, ORG1_ADMIN, factFindFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, factFindFileId, false)
	TestDownload(t, e, ORG1_CLIENT, factFindFileId, false)

	// Delete it
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/fact-finds/"+factFindId).
		WithHeader("Authentication", ORG1_ADVISOR).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, fileId2, false)
	TestDownload(t, e, ORG1_ADMIN, fileId2, false)
	TestDownload(t, e, ORG1_ADVISOR, fileId2, false)
	TestDownload(t, e, ORG1_CLIENT, fileId2, false)

	// Recreate it again
	factFindFileId = TestUpload(t, e, ORG1_ADVISOR, "fact-find-c.png")
	request.File = &Entities.RequestFile{
		Uid:      factFindFileId,
		Filename: "fact-find-c.png",
	}
	resp = e.POST("/api/advisor/clients/"+org1ClientId+"/fact-finds").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	factFindId = resp.JSON().Object().Value("Id").String().Raw()

	TestDownload(t, e, ORG1_OWNER, factFindFileId, true)
	TestDownload(t, e, ORG1_ADMIN, factFindFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, factFindFileId, true)
	TestDownload(t, e, ORG2_OWNER, factFindFileId, false)
	TestDownload(t, e, ORG1_CLIENT, factFindFileId, true)
}

func CreateFeesReport(t *testing.T, e *httpexpect.Expect) {
	feesReportFileId = TestUpload(t, e, ORG1_ADVISOR, "sample.png")

	request := FactFinds.CreateOrUpdateFactFindRequestBody{
		File: &Entities.RequestFile{
			Uid:      feesReportFileId,
			Filename: "sample.png",
		},
		Submitted: "2006-01-02T15:04:05Z",
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/fees-reports").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	feesReportId = resp.JSON().Object().Value("Id").String().Raw()

	TestDownload(t, e, ORG1_OWNER, feesReportFileId, true)
	TestDownload(t, e, ORG1_ADMIN, feesReportFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, feesReportFileId, true)
	TestDownload(t, e, ORG2_OWNER, feesReportFileId, false)
	TestDownload(t, e, ORG1_CLIENT, feesReportFileId, true)

	// Update the file
	fileId2 := TestUpload(t, e, ORG1_ADVISOR, "sample.png")
	request.File = &Entities.RequestFile{
		Uid:      fileId2,
		Filename: "sample.png",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/fees-reports/"+feesReportId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Test old file no longer available
	TestDownload(t, e, ORG1_OWNER, feesReportFileId, false)
	TestDownload(t, e, ORG1_ADMIN, feesReportFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, feesReportFileId, false)
	TestDownload(t, e, ORG1_CLIENT, feesReportFileId, false)

	// Delete it
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/fees-reports/"+feesReportId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, fileId2, false)
	TestDownload(t, e, ORG1_ADMIN, fileId2, false)
	TestDownload(t, e, ORG1_ADVISOR, fileId2, false)
	TestDownload(t, e, ORG1_CLIENT, fileId2, false)

	// Recreate it again
	feesReportFileId = TestUpload(t, e, ORG1_ADVISOR, "sample.png")
	request.File = &Entities.RequestFile{
		Uid:      feesReportFileId,
		Filename: "sample.png",
	}
	resp = e.POST("/api/advisor/clients/"+org1ClientId+"/fees-reports").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	feesReportId = resp.JSON().Object().Value("Id").String().Raw()

	TestDownload(t, e, ORG1_OWNER, feesReportFileId, true)
	TestDownload(t, e, ORG1_ADMIN, feesReportFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, feesReportFileId, true)
	TestDownload(t, e, ORG2_OWNER, feesReportFileId, false)
	TestDownload(t, e, ORG1_CLIENT, feesReportFileId, true)
}

func CreateForecast(t *testing.T, e *httpexpect.Expect) {
	forecastFileId = TestUpload(t, e, ORG1_ADVISOR, "sample.png")

	request := FactFinds.CreateOrUpdateFactFindRequestBody{
		File: &Entities.RequestFile{
			Uid:      forecastFileId,
			Filename: "sample.png",
		},
		Submitted: "2006-01-02T15:04:05Z",
	}
	resp := e.POST("/api/advisor/clients/"+org1ClientId+"/forecasts").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	forecastId = resp.JSON().Object().Value("Id").String().Raw()

	TestDownload(t, e, ORG1_OWNER, forecastFileId, true)
	TestDownload(t, e, ORG1_ADMIN, forecastFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, forecastFileId, true)
	TestDownload(t, e, ORG2_OWNER, forecastFileId, false)
	TestDownload(t, e, ORG1_CLIENT, forecastFileId, true)

	// Update the file
	fileId2 := TestUpload(t, e, ORG1_ADVISOR, "sample.png")
	request.File = &Entities.RequestFile{
		Uid:      fileId2,
		Filename: "sample.png",
	}
	e.PUT("/api/advisor/clients/"+org1ClientId+"/forecasts/"+forecastId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	// Test old file no longer available
	TestDownload(t, e, ORG1_OWNER, forecastFileId, false)
	TestDownload(t, e, ORG1_ADMIN, forecastFileId, false)
	TestDownload(t, e, ORG1_ADVISOR, forecastFileId, false)
	TestDownload(t, e, ORG1_CLIENT, forecastFileId, false)

	// Delete it
	e.DELETE("/api/advisor/clients/"+org1ClientId+"/forecasts/"+forecastId).
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)

	TestDownload(t, e, ORG1_OWNER, fileId2, false)
	TestDownload(t, e, ORG1_ADMIN, fileId2, false)
	TestDownload(t, e, ORG1_ADVISOR, fileId2, false)
	TestDownload(t, e, ORG1_CLIENT, fileId2, false)

	// Recreate it again
	forecastFileId = TestUpload(t, e, ORG1_ADVISOR, "sample.png")
	request.File = &Entities.RequestFile{
		Uid:      forecastFileId,
		Filename: "sample.png",
	}
	resp = e.POST("/api/advisor/clients/"+org1ClientId+"/forecasts").
		WithHeader("Authentication", ORG1_ADVISOR).
		WithJSON(request).
		Expect().Status(http.StatusOK)
	forecastId = resp.JSON().Object().Value("Id").String().Raw()

	TestDownload(t, e, ORG1_OWNER, forecastFileId, true)
	TestDownload(t, e, ORG1_ADMIN, forecastFileId, true)
	TestDownload(t, e, ORG1_ADVISOR, forecastFileId, true)
	TestDownload(t, e, ORG2_OWNER, forecastFileId, false)
	TestDownload(t, e, ORG1_CLIENT, forecastFileId, true)
}
