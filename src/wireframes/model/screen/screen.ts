import {ImmutableList, MathHelper, Record} from "@app/core";

type UpdatedProps = {
    title: string;
    description: string;
}

export type ScreenProps = {
    id: string;
    title: string;
    description?: string;
    itemId: string;
    functions: ImmutableList<string>;
}

export type InitialScreenProps = {
    id: string;
    title: string;
    description?: string;
    itemId: string;
    functions: ImmutableList<string>;
}

export class Screen extends Record<ScreenProps> {

    public get id() {
        return this.get('id');
    }

    public get title() {
        return this.get('title');
    }

    public get description() {
        return this.get('description');
    }

    public get functions() {
        return this.get('functions');
    }

    public get itemId() {
        return this.get('itemId');
    }

    public clone() {
        return this.set('id', MathHelper.guid());
    }

    public update(data: UpdatedProps) {
        this.set('title', data.title);
        this.set('description', data.description);
    }

    public static create(setup: InitialScreenProps) {
        const {
            id,
            title,
            description,
            functions,
            itemId,
        } = setup;
        const props: ScreenProps = {
            id,
            title,
            description,
            functions,
            itemId,
        };
        return new Screen(props as any);
    }
}