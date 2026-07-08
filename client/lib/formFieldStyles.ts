// Shared styling for the respondent-facing form so every block type reads as
// one consistent, palette-aware family. The `--form-accent` CSS variable is
// set on the form root (FormSubmissionLayout) from the active palette, so focus
// and selected states pick up the theme automatically.

// Text-like fields (short text, number, URL, date, long text, address):
// a clean underline that highlights with the palette accent on focus.
export const formTextFieldClass =
  "block w-full border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-lg text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[var(--form-accent)] focus:ring-0";

// Selectable option cards (single / multi choice): border + subtle tint that
// switch to the palette accent on hover, focus, and when checked.
export const formOptionCardClass =
  "flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white/70 px-4 py-3 text-left text-gray-900 shadow-sm transition hover:border-[var(--form-accent)] focus-within:border-[var(--form-accent)] has-[:checked]:border-[var(--form-accent)] has-[:checked]:bg-white";

// Native dropdown, matched to the option-card look.
export const formSelectClass =
  "w-full max-w-md rounded-lg border border-gray-300 bg-white/70 px-4 py-3 text-left text-gray-900 shadow-sm outline-none transition focus:border-[var(--form-accent)] focus:ring-0";
