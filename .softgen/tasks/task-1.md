---
title: Voice Style Selector & Progress Bar
status: in_progress
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
- [ ] Create voice style selector with 6-8 preset options (Male Warm, Female Soft, etc.)
- [ ] Add visual progress bar component with time estimate
- [ ] Update Suno API call to include voice style tags
- [ ] Add loading state with animated progress during generation
- [ ] Test with real API to verify timing accuracy

## Acceptance
- User can select voice style before generating song
- Progress bar shows during 30-60 second generation
- Selected voice style influences Suno output