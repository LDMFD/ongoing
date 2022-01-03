Questionnaires
Id						int
... 						TODO

DiscretionaryInvestmentManagers
Id						int, primary key
Name						string  # e.g. Tatton, LGT Vestra, IBOSS
Fee						float

PolicyTypes
Id						int, primary key
Name						string  # SIPP (a pension), PP (personal pension), Equity ISA

PolicyProviders
Id						int, primary key
Name						string   e.g. Aviva
PricingStructure				text

#Funds
#Id
#Name						string
#Factsheet					string  # UUID -> document   # TODO needs to be list
#WeightedOCF					float
#ExAnteFee					float

Policies
Id						int, primary key
ClientId
ExternalId					string # foreign key to external system, AV1234-001
PolicyTypeId					int	
PolicyProviderId				int
PlatformDiscount				float
// Current					bool

#PolicyFunds
#FundId
#PolicyId

ModelPortfolioServices
Id						int, primary key
Name						string,   e.g. “IBOSS MPS PORTFOLIO 2
DiscretionaryInvestmentManagerId	int   # MPS is run by a DIM
WeightedOCF					float
ExAnteFee					float

#ModelPortfolioServiceFunds
#FundId
#ModelPortfolioServicesId

ModelPortfolioServiceFactsheets
Id
ModelPortfolioServiceId
Updated					datetime
Filename					string
Factsheet					string  # UUID -> document   # TODO needs to be list

Clients				  # TODO couple/families
Id						int, primary key
FirstNames					string
FamilyName					string
RiskScore					float
QuestionnaireID				int
Objectives					text  // rich text
SuitabilityReasons				text

# List of client policy portfolios - “join table”
ClientPortfolios
PolicyId
ModelPortfolioServiceId
Proportion					float  # or null

Joe Smith has two policies, a pension and an ISA, both with Aviva (policy provider).
    Client portfolio example 1: both are invested into the same MPS
        ClientPortfolios table:
            { PolicyId: 1, MpsId: 1 }
            { PolicyId: 2, MpsId: 1 }
    Client portfolio example 2: the ISA is invested into MPS #1, the pension into MPS #1 and #2 in a 30/70% split
        ClientPortfolios table:
            { PolicyId: 1, MpsId: 1 }
            { PolicyId: 2, MpsId: 1, Proportion: .30 }
            { PolicyId: 2, MpsId: 2, Proportion: .70 }
