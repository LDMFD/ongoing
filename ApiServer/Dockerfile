FROM golang:1.17-alpine AS deps

WORKDIR /go/src

ADD src/go.mod /go/src/go.mod
ADD src/go.sum /go/src/go.sum

RUN go mod download

# --

FROM deps AS builder

WORKDIR /go/src

COPY --from=deps /go /go
ADD src /go/src

ARG RELEASE

RUN go build -ldflags="-X main.release=$RELEASE"

# --

FROM alpine:3.15 AS runtime
COPY --from=builder /go/src/ongoing /go/bin/ongoing

ENV GIN_MODE=release

CMD /go/bin/ongoing
