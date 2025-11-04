import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardsStore } from '../../store/useCardsStore';
import { safeId } from '../../lib/utils';
export function NewCardPage() {
    const navigate = useNavigate();
    const categories = useCardsStore((state) => state.categories);
    const tags = useCardsStore((state) => state.tags);
    const createCard = useCardsStore((state) => state.createCard);
    const createCategory = useCardsStore((state) => state.createCategory);
    const createTag = useCardsStore((state) => state.createTag);
    const [statement, setStatement] = useState('');
    const [summary, setSummary] = useState('');
    const [keywords, setKeywords] = useState('');
    const [source, setSource] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [examples, setExamples] = useState('');
    const [actions, setActions] = useState('');
    const [triggers, setTriggers] = useState('');
    const [priority, setPriority] = useState(3);
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!statement || !summary || !categoryName)
            return;
        setSubmitting(true);
        let categoryId = categories.find((item) => item.name === categoryName)?.id;
        if (!categoryId) {
            const category = await createCategory(categoryName);
            categoryId = category.id;
        }
        const tagNames = tagsInput
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean);
        const tagIds = [];
        for (const name of tagNames) {
            const existing = tags.find((tag) => tag.name === name);
            if (existing) {
                tagIds.push(existing.id);
            }
            else {
                const created = await createTag(name);
                tagIds.push(created.id);
            }
        }
        const draft = {
            statement,
            summary,
            keywords: keywords.split('、').map((kw) => kw.trim()).filter(Boolean),
            source,
            categoryId,
            tagIds,
            examples: examples
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
            actions: actions
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .map((prompt) => ({ id: safeId('act'), prompt })),
            triggers: triggers
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .map((description) => ({ id: safeId('trigger'), description })),
            priority
        };
        const card = await createCard(draft);
        setSubmitting(false);
        navigate(`/cards/${card.id}`);
    };
    return (_jsxs("form", { className: "space-y-4 pb-24", onSubmit: handleSubmit, children: [_jsxs("div", { className: "rounded-2xl border border-slate-100 bg-white p-4 shadow-sm", children: [_jsx("label", { className: "text-sm font-semibold text-slate-700", children: "\u4E00\u53E5\u8BDD\u89C2\u70B9" }), _jsx("textarea", { className: "mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", rows: 2, placeholder: "\u7528\u4E00\u53E5\u8BDD\u6982\u62EC\u6838\u5FC3\u89C2\u70B9", value: statement, onChange: (event) => setStatement(event.target.value) })] }), _jsxs("div", { className: "rounded-2xl border border-slate-100 bg-white p-4 shadow-sm", children: [_jsx("label", { className: "text-sm font-semibold text-slate-700", children: "\u5E94\u7528\u573A\u666F / \u8BE6\u8FF0" }), _jsx("textarea", { className: "mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", rows: 4, placeholder: "\u89E3\u91CA\u4E3A\u4EC0\u4E48\u3001\u5982\u4F55\u4F7F\u7528\u3001\u6709\u54EA\u4E9B\u4F8B\u5B50", value: summary, onChange: (event) => setSummary(event.target.value) })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsx(Field, { label: "\u5173\u952E\u8BCD\uFF08\u7528\u987F\u53F7\u5206\u9694\uFF09", children: _jsx("input", { className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", placeholder: "\u62BD\u8C61\u601D\u7EF4\u3001\u53CD\u5411\u5047\u8BBE", value: keywords, onChange: (event) => setKeywords(event.target.value) }) }), _jsx(Field, { label: "\u6765\u6E90 / \u4E66\u7C4D", children: _jsx("input", { className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", placeholder: "\u4E66\u540D\u3001\u7AE0\u8282\u6216\u8BB2\u5EA7", value: source, onChange: (event) => setSource(event.target.value) }) })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs(Field, { label: "\u5206\u7C7B", children: [_jsx("input", { className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", placeholder: "\u5982\uFF1A\u601D\u7EF4\u6A21\u578B\u3001\u521B\u4E1A\u6D1E\u5BDF", value: categoryName, onChange: (event) => setCategoryName(event.target.value), list: "category-options" }), _jsx("datalist", { id: "category-options", children: categories.map((category) => (_jsx("option", { value: category.name }, category.id))) })] }), _jsx(Field, { label: "\u6807\u7B7E\uFF08\u9017\u53F7\u5206\u9694\uFF09", children: _jsx("input", { className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", placeholder: "\u573A\u666F\u3001\u89E6\u53D1\u6761\u4EF6", value: tagsInput, onChange: (event) => setTagsInput(event.target.value) }) })] }), _jsx(Field, { label: "\u6848\u4F8B / \u4F8B\u5B50\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF09", children: _jsx("textarea", { className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", rows: 3, placeholder: "\u8BB0\u5F55\u4F60\u9047\u5230\u8FC7\u7684\u771F\u5B9E\u573A\u666F", value: examples, onChange: (event) => setExamples(event.target.value) }) }), _jsx(Field, { label: "\u884C\u52A8\u7EC3\u4E60\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF09", children: _jsx("textarea", { className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", rows: 3, placeholder: "\u5199\u4E0B\u89E6\u53D1\u540E\u8981\u505A\u7684\u52A8\u4F5C\u6216\u8981\u56DE\u7B54\u7684\u95EE\u9898", value: actions, onChange: (event) => setActions(event.target.value) }) }), _jsx(Field, { label: "\u89E6\u53D1\u573A\u666F\uFF08\u6BCF\u884C\u4E00\u4E2A\uFF09", children: _jsx("textarea", { className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", rows: 3, placeholder: "\u5728\u54EA\u4E9B\u60C5\u5883\u4E0B\u63D0\u9192\u81EA\u5DF1\u8C03\u7528", value: triggers, onChange: (event) => setTriggers(event.target.value) }) }), _jsx(Field, { label: `优先级：${priority}`, children: _jsx("input", { type: "range", min: 1, max: 5, value: priority, onChange: (event) => setPriority(Number(event.target.value)), className: "w-full" }) }), _jsx("button", { type: "submit", disabled: submitting, className: "w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-white disabled:opacity-60", children: submitting ? '创建中…' : '生成卡片并进入详情' })] }));
}
function Field({ label, children }) {
    return (_jsxs("label", { className: "space-y-2 text-sm font-semibold text-slate-700", children: [_jsx("span", { children: label }), children] }));
}
