---
name: ingest
description: Process a raw source into interconnected wiki pages. Use when user clips a new article or says "ingest [path]".
---

# Ingest Source

Process a source from `raw/clippings/` into the wiki knowledge graph.

## Input

User provides a filename or path within `raw/clippings/`:
- `ingest modal-infrastructure.md`
- `ingest ai stuff/some-article.md`
- `ingest` (then list recent files in `raw/clippings/` and ask which to process)

All sources live in `raw/clippings/` — never look elsewhere.

## Process

### Step 0: Normalize Filename

If the source filename is not lowercase-kebab-case:
1. Convert to lowercase-kebab-case (e.g., `My Article Title.md` → `my-article-title.md`)
2. Rename the file using `git mv` to preserve history
3. Continue with normalized path

### Step 1: Read & Extract

Read the source from `raw/clippings/` and identify:
- Main topic/subject
- Entities: tools, companies, people, projects mentioned
- Concepts: techniques, patterns, principles discussed
- 3-5 key takeaways

### Step 2: Find Connections & Propose

1. Read `wiki/index.md` — it catalogs all vault content
2. From the index, identify connections to courses, startups, or ongoing work
3. Only do targeted reads/searches if the index points to something specific

Present findings WITH proposed connections:

```
**Key insights from [Source Title]:**
- Insight 1
- Insight 2
- Insight 3

**Entities detected:** Tool A, Company B, Person C
**Concepts detected:** Pattern X, Technique Y

**Proposed connections:**
- Links to [[existing/page]] because [reason]
- Relevant to [course/project] — [specific connection]
- Updates [[wiki/entities/...]] with [new observation]

Approve these connections, or adjust?
```

**Wait for user approval before proceeding.**

### Step 3: Create/Update Wiki Pages

After user guidance, create or update:

**Topic page** at `wiki/topics/[topic-name].md`:
```markdown
---
source: [[raw/clippings/path/to/source]]
date: YYYY-MM-DD
tags: [relevant, tags]
---
# Topic Name

## Summary
2-3 paragraph synthesis focusing on what user asked to emphasize.

## Key Takeaways
- Bullet points

## Related
- [[wiki/entities/entity-name]]
- [[wiki/concepts/concept-name]]
```

**Entity pages** at `wiki/entities/[entity].md`:
- Create new entity pages for significant tools/companies/people
- Update existing entity pages with new observations
- Always add backlink to the topic page under Sources

**Concept pages** at `wiki/concepts/[concept].md`:
- Create new concept pages for techniques/patterns worth tracking
- Update existing concept pages with new applications
- Link related concepts together

### Step 4: Update Index

Add the topic to appropriate section in `wiki/index.md`.

### Step 5: Log It

Append to `wiki/log.md`:
```markdown
## [YYYY-MM-DD] ingest | Source Title
- Created: [[wiki/topics/topic-name]]
- Updated: [[wiki/entities/...]], [[wiki/concepts/...]]
- Key insight: one-sentence summary
```

### Step 6: Confirm

Tell the user what was created/updated and offer to adjust anything.

## Rules

- Sources are always in `raw/clippings/` — never look elsewhere
- Never edit raw source content — they are immutable (but rename files to normalize)
- Use lowercase-kebab-case for all filenames (source + wiki pages)
- Cross-link aggressively between pages
- Entity/concept pages are living documents — add to them, don't replace
- Proactively find connections by reading wiki/index.md and existing pages — don't ask open-ended questions
- Wait for user approval of proposed connections before writing files
