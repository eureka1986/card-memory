export type MasteryLevel = 'unseen' | 'learning' | 'familiar' | 'mastered';
export interface ActionPrompt {
    id: string;
    prompt: string;
}
export interface TriggerPrompt {
    id: string;
    description: string;
}
export interface ReflectionNote {
    id: string;
    createdAt: string;
    content: string;
}
export interface Card {
    id: string;
    statement: string;
    keywords: string[];
    summary: string;
    source?: string;
    categoryId: string;
    tagIds: string[];
    examples: string[];
    actions: ActionPrompt[];
    triggers: TriggerPrompt[];
    reflections: ReflectionNote[];
    priority: number;
    mastery: MasteryLevel;
    createdAt: string;
    nextReviewAt: string;
    lastReviewedAt?: string;
}
export interface CardDraft {
    statement: string;
    keywords: string[];
    summary: string;
    source?: string;
    categoryId: string;
    tagIds: string[];
    examples: string[];
    actions: ActionPrompt[];
    triggers: TriggerPrompt[];
    priority: number;
}
export interface Category {
    id: string;
    name: string;
    color?: string;
}
export interface Tag {
    id: string;
    name: string;
}
