import { enums } from "@innobridge/llmclient";
// export enum Role {
//     User = 0,
//     Bot = 1
// }

export interface Message {
    role: enums.Role;
    content: string;
    imageUrl?: string;
    prompt?: string;
}

export interface Chat {
    id: number;
    title: string;
}