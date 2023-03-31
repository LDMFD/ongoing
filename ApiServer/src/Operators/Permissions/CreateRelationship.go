package Permissions

type Jobspec struct {
	Command     string `validate:"required"`
	ObjectType  string `validate:"required"`
	ObjectId    string `validate:"required"`
	Relation    string `validate:"required"`
	SubjectType string `validate:"required"`
	SubjectId   string `validate:"required"`
	NewRelation string `json:",omitempty"` // for mutate only - could be improved
}

func NewRelationshipCommand(command, objectType string, objectId string, relation string, subjectType string, subjectId string, newRelation *string) *Jobspec {
	js := &Jobspec{
		Command:     command,
		ObjectType:  objectType,
		ObjectId:    objectId,
		Relation:    relation,
		SubjectType: subjectType,
		SubjectId:   subjectId,
		NewRelation: "",
	}
	if newRelation != nil {
		js.NewRelation = *newRelation
	}
	return js
}
