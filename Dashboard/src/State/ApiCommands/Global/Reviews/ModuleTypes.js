// This list also found in 0.sql and ReviewModule.go
export const ModuleTypeIntroduction       = "introduction";

export const ModuleTypeProfile            = "profile";
export const ModuleTypeFactFind           = "profile:fact-find";
export const ModuleTypeRisk               = "profile:risk";
export const ModuleTypeObjectives         = "profile:objectives";

export const ModuleTypePolicyValuations   = "policy-valuations";
export const ModuleTypeValuation          = "policy-valuations:valuation";
export const ModuleTypeContributions      = "policy-valuations:contributions";

export const ModuleTypeFees               = "fees";
export const ModuleTypeAdviceFee          = "fees:advice-fee";
export const ModuleTypePolicyFees         = "fees:policy-fees";
export const ModuleTypeFundLevelFees      = "fees:fund-level";
export const ModuleTypePortfolioLevelFees = "fees:portfolio-level";
export const ModuleTypeDimFee             = "fees:dim";

export const ModuleTypeConclusions        = "conclusions";
export const ModuleTypeAdviceGiven        = "conclusions:advice-given";
export const ModuleTypeDueDiligence       = "conclusions:due-diligence";
export const ModuleTypeOngoingSuitability = "conclusions:ongoing-suitability";
export const ModuleTypeActionPoints       = "conclusions:action-points";

export const ModuleTypeSelectSpec = [
    { id: ModuleTypeIntroduction,       label: "Introduction" },
    { id: ModuleTypeProfile,            label: "Profile (Fact find, Risk profile & Objectives page)" },
    { id: ModuleTypeFactFind,           label: "Profile - Fact-Find" },
    { id: ModuleTypeRisk,               label: "Profile - Attitude To Risk Questionnaire" },
    { id: ModuleTypeObjectives,         label: "Profile - Objectives" },
    { id: ModuleTypePolicyValuations,   label: "Policy Valuations page" },
    { id: ModuleTypeValuation,          label: "Policy Valuations - Policy Valuation" },
    { id: ModuleTypeContributions,      label: "Policy Valuations - Policy Contributions" },
    { id: ModuleTypeFees,               label: "Fees page" },
    { id: ModuleTypeAdviceFee,          label: "Fees - Advice" },
    { id: ModuleTypePolicyFees,         label: "Fees - Policies" },
    { id: ModuleTypeFundLevelFees,      label: "Fees - Funds Level" },
    { id: ModuleTypePortfolioLevelFees, label: "Fees - Portfolio Level" },
    { id: ModuleTypeConclusions,        label: "Conclusions page" },
    { id: ModuleTypeAdviceGiven,        label: "Conclusions - Advice Given" },
    { id: ModuleTypeDueDiligence,       label: "Conclusions - Due Digilence" },
    { id: ModuleTypeOngoingSuitability, label: "Conclusions - Ongoing Suitability" },
    { id: ModuleTypeActionPoints,       label: "Conclusions - Action Points" },   
];
