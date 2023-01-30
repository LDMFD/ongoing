import { CanonicalNow } from "Utils/DateTime";

export const DefaultRiskAssessment = {
    RiskProviderId: null,
    RiskLevelId: null,
    File: null,
    Completed: CanonicalNow(),
};
