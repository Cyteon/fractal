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
        subscribed: boolean;
    }[],

    currentOrg: {
        id: string;
        name: string;
        slug: string;
        role: string;
        subscribed: boolean;
    } | null;

    finishedLoading: boolean;
}

const state: IState = $state({
    user: null,
    orgs: [],
    currentOrg: null,
    finishedLoading: false,
});

export default state;