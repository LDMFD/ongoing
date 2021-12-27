FROM golang:1.17 AS deps

WORKDIR /go/src

ADD src/go.mod /go/src/go.mod
ADD src/go.sum /go/src/go.sum

RUN go mod download


FROM deps AS builder

WORKDIR /go/src

COPY --from=deps /go /go
ADD src /go/src
RUN go build


FROM builder AS runtime
COPY --from=builder /go/src/ongoing /go/bin
CMD /go/bin/ongoing
