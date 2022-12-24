import { Report } from "./Client";
import { OrgResources } from "./OrgResources";

export interface State {
    Resources: OrgResources,
    Report: Report,
}

export interface Org {
    Resources: OrgResources,
}

export interface File {
    Uid: string,
    Filename: string,
    Size: number,
}
