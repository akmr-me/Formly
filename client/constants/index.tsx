import { BlockType } from "@/types";
import { formBlocks } from "./blockTypes";
import { Button } from "@/components/ui/button";
import TextAlign from "@/components/molecules/editor/TextAlign";

export const ImageLayoutOptions = [
  {
    label: "Stack",
    value: "stack",
  },
  {
    label: "Split",
    value: "split",
  },
  {
    label: "Wallpaper",
    value: "wallpaper",
  },
];

export const CreateFormLabel = "Create Form";
export const CreateFormLoadingLabel = "Creating Form...";

export const DefaultDebounceTime = 1000;

export const BlockTypeMap = formBlocks.reduce<Record<string, BlockType>>(
  (acc, block) => {
    acc[block.type] = block;
    return acc;
  },
  {}
);

export const DeleteConfirmation = {
  title: "Are you sure you want to delete this block?",
  description: "This action is irreversible.",
  confirmText: "Yes! Delete it",
  confirmVariant: "destructive",
  cancelText: "Cancel",
};

export const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const ValidImageTypeError =
  "Please select a valid image file (JPEG, PNG, GIF, WebP)";
export const MaxSizeImageError = "File size must be less than 5MB";

export const SupportedQuillEditorFormats = ["bold", "italic", "link", "video"];

export const EmbedAddButtonHoverText = "Embed Loom, Vimeo, Pdf anything.";
export const EmbedInputPlaceholder = "E.g. https://www.loom.com/share/...";
export const AddNewBlockHoverText = "Add a new block";

export const DefaultBlockData = {
  statement: {
    title: "Hey there 😀",
    description: "Mind filling out this form?",
    button: "Let's start",
    displayTitle: "Welcome! Please take some time to fill up this form.",
    displayDescription: "This will only take 2 minutes.",
    displayButtonText: "Let's start ➡️",
  },
  "statement-new": {
    title: "",
    description: "",
    button: "Continue",
  },
  shortText: {
    question: "",
    displayQuestion: "Your question here...",
    description: "",
    placeholder: "Your answer here...",
    button: "Next",
    displayTitle: "What is your name?",
    displayDescription: "",
    displayButtonText: "Next ✔️",
    hasUrlParams: true,
    urlParamsPlaceholder: "e.g email",
    urlParamsTooltip:
      "For e.g if you set this value to 'email' and then append ?email=someone@email.com at the end of the form page URL then it will auto fill the field value with someone@email.com. Click to learn more.",
  },
  longText: {
    question: "",
    displayQuestion: "Your question here...",
    description: "",
    placeholder: "Your answer here...",
    button: "Next",
    textBoxSize: "small",
    minimumCharacters: 0,
    minimumCharactersPlaceholder: "e.g 30",
    minimumCharactersInfor: "Leave blank for no minimum limit.",
    maximumharacters: 0,
    maximumCharactersPlaceholder: "e.g 30",
    maximumCharactersInfor: "Leave blank for no minimum limit.",
    displayTitle: "Please give valuable feedback.",
    displayDescription: "",
    displayButtonText: "Next ✔️",
  },
  number: {
    question: "Please enter a number",
    description: "",
    button: "Next",
    placeholder: "",
    minumumNumber: null,
    maximumNumber: null,
    displayTitle: "Please enter a number.",
    displayDescription: "",
    displayPlaceholder: "between 10 to 100",
    displayButtonText: "Next ✔️",
    hasUrlParams: true,
    urlParamsPlaceholder: "e.g age",
    urlParamsTooltip:
      "For e.g if you set this value to 'age' and then append ?age=25 at the end of the form page URL then it will auto fill the field value with 25. Click to learn more.",
  },
  websiteUrl: {
    question: "Please enter a URL",
    description: "",
    button: "Next",
    placeholder: "https://",
    displayTitle: "Please enter a URL *",
    displayDescription: "",
    displayPlaceholder: "https://",
    displayButtonText: "Next ➡️",
    hasUrlParams: true,
    urlParamsPlaceholder: "e.g website",
    urlParamsTooltip:
      "For e.g if you set this value to 'website' and then append ?website=https://example.com at the end of the form page URL then it will auto fill the field value with https://example.com. Click to learn more.",
  },
  singleSelect: {
    type: "singleSelect",
    question: "Which do you prefer? 👇",
    description: "",
    options: ["Option 1", "Option 2"],
    selectCheckboxes: [
      {
        value: "Other option",
        tooltip:
          "Add other option at the end of list. User will be able to input their own answer.",
      },
      {
        value: "Randomize options",
        tooltip:
          "If checked options will be presented in random order. This help in reducing bias toward selection that are listed first.",
      },
      {
        value: "Horizontally align options",
      },
      {
        value: "Hide labels",
        tooltip:
          "If checked, option label will be hidden. Only works when options has images. Click to learn more.",
      },
    ],
    hasUrlParams: true,
    urlParamsPlaceholder: "e.g choice",
    urlParamsTooltip:
      "For e.g if you set this value to 'choice' and then append ?choice=option_id_123 at the end of the form page URL then it will auto fill the field with that option. Use option IDs from the chevron menu above. Click to learn more.",
  },
  multiSelect: {
    type: "multiSelect",
    question: "Please choose at least one option 👇",
    description: "",
    options: ["Option 1", "Option 2"],
    selectCheckboxes: [
      {
        value: "Other option",
        tooltip:
          "Add other option at the end of list. User will be able to input their own answer.",
      },
      {
        value: "Randomize options",
        tooltip:
          "If checked options will be presented in random order. This help in reducing bias toward selection that are listed first.",
      },
      {
        value: "Horizontally align options",
      },
      {
        value: "Hide labels",
        tooltip:
          "If checked, option label will be hidden. Only works when options has images. Click to learn more.",
      },
    ],
    hasUrlParams: true,
    urlParamsPlaceholder: "e.g choices",
    urlParamsTooltip:
      "For e.g if you set this value to 'choices' and then append ?choices=option_id_123,option_id_456 at the end of the form page URL then it will auto fill multiple options. Use comma-separated option IDs from the chevron menu above. Click to learn more.",
    selectionLimitCheckboxes: [
      {
        value: "Unlimited",
        info: "Allow any number of options",
      },
      {
        value: "Exact number",
        info: "Allow exactly this many options",
      },
      {
        value: "Range",
        info: "Allow between min and max options",
      },
    ],
  },
  drowdownList: {
    type: "drowdownList",
    question: "Please choose 👇",
    description: "",
    options: ["Option 1", "Option 2"],
    selectCheckboxes: [
      {
        value: "Other option",
        tooltip:
          "Add other option at the end of list. User will be able to input their own answer.",
      },
      {
        value: "Randomize options",
        tooltip:
          "If checked options will be presented in random order. This help in reducing bias toward selection that are listed first.",
      },
      {
        value: "Horizontally align options",
      },
      {
        value: "Hide labels",
        tooltip:
          "If checked, option label will be hidden. Only works when options has images. Click to learn more.",
      },
    ],
    hasUrlParams: true,
    urlParamsPlaceholder: "e.g selection",
    urlParamsTooltip:
      "For e.g if you set this value to 'selection' and then append ?selection=option_id_123 at the end of the form page URL then it will auto fill the field with that option. Use option IDs from the chevron menu above. Click to learn more.",
  },
  date: {
    question: "Please select a date",
    description: "",
    button: "Next",
    displayTitle: "Please select a date",
    displayDescription: "",
    displayPlaceholder: "Select date...",
    displayButtonText: "Next ➡️",
    hasUrlParams: true,
    urlParamsPlaceholder: "e.g birthday",
    urlParamsTooltip:
      "For e.g if you set this value to 'birthdate' and then append ?birthdate=1995-12-25 at the end of the form page URL then it will auto fill the field value with 1995-12-25. Format must be YYYY-MM-DD. Click to learn more.",
  },
  address: {
    question: "Please enter your complete address",
    description: "",
    button: "Next",
    displayTitle: "Please enter your complete address",
    required: "Make this required?",
    optionalConfig: {
      address: {
        id: "address",
        label: "Address",
        placeholder: "123 Main St",
        required: true,
        visible: true,
        width: "half",
        order: 1,
      },
      addressLine2: {
        id: "addressLine2",
        label: "Address line 2",
        placeholder: "Apt., studio, or floor",
        required: false,
        visible: true,
        width: "half",
        order: 2,
      },
      city: {
        id: "city",
        label: "City",
        placeholder: "San Francisco",
        required: true,
        visible: true,
        width: "half",
        order: 3,
      },
      state: {
        id: "state",
        label: "State",
        placeholder: "California",
        required: true,
        visible: true,
        width: "half",
        order: 4,
      },
      zip: {
        id: "zip",
        label: "Zip",
        placeholder: "Zip",
        required: true,
        visible: true,
        width: "full",
        order: 5,
      },
      country: {
        id: "country",
        label: "Country",
        placeholder: "United States",
        required: true,
        visible: true,
        width: "full",
        order: 6,
      },
    },
  },
};

export const CreateNewBlockDataMap = {
  shortText: {
    type: "shortText",
    titleLabel: "Question",
    title: "",
    buttonText: "Next",
    placeholder: "Your answer here...",
    required: false,
    textAlign: "center",
  },
  longText: {
    type: "longText",
    titleLabel: "Question",
    title: "",
    buttonText: "Next",
    placeholder: "Your answer here...",
    required: false,
    textAlign: "center",
  },
  number: {
    type: "number",
    titleLabel: "Question",
    title: "Please enter a number",
    buttonText: "Next",
    placeholder: "",
    required: false,
    textAlign: "center",
  },
  websiteUrl: {
    type: "websiteUrl",
    titleLabel: "Question",
    title: "Please enter a URL",
    buttonText: "Next",
    placeholder: "https://",
    required: false,
    textAlign: "center",
  },
  date: {
    type: "date",
    titleLabel: "Question",
    title: "Please select a date",
    buttonText: "Next",
    placeholder: "",
    required: false,
    textAlign: "center",
  },
  address: {
    type: "address",
    titleLabel: "Question",
    title: "Please enter your complete address",
    buttonText: "Next",
    placeholder: "",
    required: false,
    textAlign: "center",
    optionalConfig: {
      address: {
        id: "address",
        label: "Address",
        placeholder: "123 Main St",
        required: true,
        visible: true,
        width: "half",
        order: 1,
      },
      addressLine2: {
        id: "addressLine2",
        label: "Address line 2",
        placeholder: "Apt., studio, or floor",
        required: false,
        visible: true,
        width: "half",
        order: 2,
      },
      city: {
        id: "city",
        label: "City",
        placeholder: "San Francisco",
        required: true,
        visible: true,
        width: "half",
        order: 3,
      },
      state: {
        id: "state",
        label: "State",
        placeholder: "California",
        required: true,
        visible: true,
        width: "half",
        order: 4,
      },
      zip: {
        id: "zip",
        label: "Zip",
        placeholder: "Zip",
        required: true,
        visible: true,
        width: "full",
        order: 5,
      },
      country: {
        id: "country",
        label: "Country",
        placeholder: "United States",
        required: true,
        visible: true,
        width: "full",
        order: 6,
      },
    },
  },
};

export const UnpublishedFormMessage =
  "Your form has unpublished changes. You can publish it from dashboard.";

export const FermionFormLocalStorageKey = "fermion-form";
