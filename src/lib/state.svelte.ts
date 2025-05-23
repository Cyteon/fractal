export interface IState {
    user: {
        id: string;
        email: string;
        admin: boolean;
        suspended: boolean;
    } | null;

    orgs: {
        id: string;
        name: string;
        slug: string;
        role: string;
    }[],

    currentOrg: {
        id: string;
        name: string;
        slug: string;
        role: string;
    } | null;
}

const state: IState = $state({
    user: null,
    orgs: [],
    currentOrg: null,
});

export default state;