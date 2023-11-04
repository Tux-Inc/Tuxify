export interface TodoNotification {
    subscriptionId: string;
    subscriptionExpirationDateTime: string;
    changeType: string;
    resource: string;
    resourceData: {
        "@odata.type": string;
        "@odata.id": string;
        "@odata.etag": string;
        id: string;
    };
    clientState: string;
    tenantId: string;
}
