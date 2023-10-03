import { Raw } from "@vue/reactivity";

export type INodeType = {
    icon: string;
    name: string;
    description: string;
    type: string;
    component: Raw<unknown>;
}