---
title: Voice Style Selector & Progress Bar
status: done
priority: urgent
type: feature
tags: [song-generation, ux]
created_by: agent
created_at: 2026-06-23T13:04:48Z
position: 1
---

## Notes
Add voice customization options and visual progress feedback for song generation to help users create the perfect baby welcome song.

User needs:
- Voice style options to guide Suno toward different vocal characteristics
- Progress bar showing generation status (30-60 second estimate)
- Better user feedback during the 30-60 second wait time

## Checklist
- [x] Create voice style selector with 8 preset options (Male Warm, Female Soft, Child Voice, etc.)
- [x] Add visual progress bar component with time estimate
- [x] Update Suno API call to include voice style tags
- [x] Add loading state with animated progress during generation
- [x] Integrate voice style into form UI with icons and descriptions

## Acceptance
- User can select voice style before generating song
- Progress bar shows during 30-60 second generation with percentage
- Selected voice style influences Suno output through tags