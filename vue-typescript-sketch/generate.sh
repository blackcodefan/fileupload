#!/bin/bash

#apollo client:download-schema .schema/graphql.json --endpoint=http://localhost:8080/query
#apollo client:codegen src/types/api.d.ts --localSchemaFile=.schema/graphql.json --includes=src/**/*.vue --addTypename --target=typescript --outputFlat
npx graphql-codegen --config codegen.yml