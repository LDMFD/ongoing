FROM golang:1.17-alpine AS deps

RUN apk add build-base

WORKDIR /go/src

ADD src/go.mod /go/src/go.mod
ADD src/go.sum /go/src/go.sum

RUN go mod download


FROM deps AS builder

WORKDIR /go/src

COPY --from=deps /go /go
ADD src /go/src
RUN go test -tags testing
