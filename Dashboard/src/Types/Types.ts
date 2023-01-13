import { ClientIdentity, Report } from "./ClientResources";
import { OrgResources } from "./OrgResources";

export interface State {
    // Clients
    // Draft
    Metadata: Metadata,
    Report: Report,
    Resources: OrgResources,
    // Reviews
    // Session
}

export interface Metadata {
    Id: string,
	UserId: string,
	Identity: ClientIdentity,
	Fee: number, // TODO refactor floats to ints?
	AdvisorId: string,

}

export interface Org {
    Resources: OrgResources,
}

export interface File {
    Uid: string,
    Filename: string,
    Size: number,
}
