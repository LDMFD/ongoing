package Database

import (
	"context"
	"github.com/uptrace/bun"
)

type Relationship struct {
	ForeignTableName string `bun:"foreign_table_name"`
	TableName        string `bun:"table_name"`
	ColumnName       string `bun:"column_name"`
}

var relationships []Relationship

func GetRelationships(db *bun.DB) {
	sql := `
		select distinct
			y.table_name as foreign_table_name,
				x.table_name,
				x.column_name
			from information_schema.referential_constraints c
				join information_schema.key_column_usage x
					on x.constraint_name = c.constraint_name
				join information_schema.key_column_usage y
					on y.ordinal_position = x.position_in_unique_constraint
					and y.constraint_name = c.unique_constraint_name
		order by foreign_table_name,
		         table_name;`

	rows, err := db.Query(sql)
	if err != nil {
		panic(err)
	}

	err = db.ScanRows(context.TODO(), rows, &relationships)
	if err != nil {
		panic(err)
	}
}

// HasRelationships returns true if the given table is depended on by another table
func HasRelationships(db *bun.DB, tableName string, columnName string, columnValue int64) bool {
	if len(relationships) == 0 {
		GetRelationships(db)
	}

	for _, relationship := range relationships {
		if relationship.ForeignTableName == tableName && relationship.ColumnName == columnName {
			sql := `select * from ` + relationship.TableName + ` where ` + columnName + ` = ?`
			var count int

			rows, err := db.Query(sql, columnValue)
			if err != nil {
				panic(err)
			}
			var values []interface{} = make([]interface{}, 1)
			err = db.ScanRows(context.TODO(), rows, &values)
			if err != nil {
				panic(err)
			}

			if count > 0 {
				return true
			}
		}
	}

	return false
}
