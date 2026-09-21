export const WRITNEXA_SUPPORT_KNOWLEDGE = {
  product: {
    name: "Writnexa",
    description:
      "AI writing studio with writing, translation, document, project, and video-editing workflows.",
  },

  dashboard: {
    description: "Main AI writing workspace.",
    formats: [
      "Blog post",
      "Social post",
      "Video script",
      "Professional email",
      "Business proposal",
      "Product announcement",
      "Rewrite",
    ],
    actions: ["Improve", "Shorten", "Expand", "Rewrite"],
    tones: [
      "Professional",
      "Friendly",
      "Persuasive",
      "Casual",
      "Creative",
    ],
  },

  documents: {
    description: "Saved writing documents.",
    capabilities: ["Search", "Rename", "Download"],
    downloadFormats: ["TXT", "Markdown", "DOCX", "PDF"],
  },

  templates: {
    description: "Structured workflows for common writing tasks.",
    templates: [
      "Blog post",
      "Social media post",
      "YouTube video script",
      "Professional email",
      "Business proposal",
      "Product announcement",
      "Rewrite",
    ],
    rewrite:
      "Improves existing text for clarity, structure, tone, and impact.",
  },

  projects: {
    description: "Projects organize related writing work.",
  },

  translator: {
    description:
      "Writnexa Translator translates content across supported languages.",
    languageCount:
      "Do not claim an exact number unless the user provides or sees it.",
  },

  settings: {
    capabilities: [
      "Account information",
      "Email address",
      "Appearance",
      "Default writing format",
      "Default writing tone",
      "Save preferences",
      "Sign out",
    ],
    appearance: ["Light", "Dark", "System"],
    preferences:
      "Saved writing preferences affect the user's writing experience.",
  },

  account: {
    capabilities: [
      "Account access",
      "Sign out",
      "Forgot-password flow",
      "Password reset",
    ],
    sensitiveInformation: [
      "Passwords",
      "Authentication codes",
      "API keys",
      "Payment-card details",
    ],
  },

  videoEditor: {
    capabilities: [
      "Video upload",
      "Video preview/playback",
      "Trim",
      "Split at the playhead",
      "Split clip export",
      "Auto captions",
      "Caption synchronization",
      "Remove Silence",
      "Video export/download",
    ],
  },

  troubleshooting: {
    videoExport: [
      "Confirm a video is loaded.",
      "Determine whether Trim is being used.",
      "Determine whether Export starts and then fails or does nothing.",
      "Ask for the visible error message when one exists.",
      "If there is no error, retry once.",
      "If the failure repeats, escalate for human review.",
    ],

    removeSilence: [
      "Determine whether audio is missing only in the editor or also in the exported video.",
      "If the exported video has no audio, suggest trying Remove Silence again.",
      "If the problem continues, suggest the main Export flow where appropriate.",
      "Escalate if the problem remains unresolved.",
    ],

    captions: [
      "Confirm that a video has been uploaded.",
      "Try Generate captions again.",
      "If it still fails, ask for the visible error or behavior.",
      "Escalate if unresolved.",
    ],

    upload: [
      "Confirm that a valid video file was selected.",
      "If useful, ask whether another supported video file works.",
      "Collect the visible error or behavior if the issue continues.",
      "Escalate if unresolved.",
    ],

    splitExport: [
      "Confirm that a split point has been added.",
      "Try exporting again.",
      "If it fails again, ask what happens or what error appears.",
      "Escalate if unresolved.",
    ],
  },

  intents: {
    general_help: {
      description: "The user wants general help understanding or using Writnexa.",
      areas: ["Dashboard", "Help Center", "Settings", "Account"],
      strategy:
        "Answer the question directly using known Writnexa capabilities. If the request is unclear, ask one concise clarifying question.",
    },

    blog_post: {
      description: "The user wants to create or improve a blog post.",
      areas: ["Dashboard", "Templates"],
      strategy:
        "Explain the known blog-post workflow and, when appropriate, guide the user one step at a time.",
    },

    social_post: {
      description: "The user wants to create or improve a social post.",
      areas: ["Dashboard", "Templates"],
      strategy:
        "Explain the known social-post workflow and help the user choose the appropriate writing action when relevant.",
    },

    video_script: {
      description: "The user wants to create or improve a video script.",
      areas: ["Dashboard", "Templates"],
      strategy:
        "Explain the known video-script workflow and guide the user through the relevant writing options.",
    },

    professional_email: {
      description: "The user wants to create or improve a professional email.",
      areas: ["Dashboard", "Templates"],
      strategy:
        "Explain the professional-email workflow and guide the user toward the relevant writing action.",
    },

    business_proposal: {
      description: "The user wants to create or improve a business proposal.",
      areas: ["Dashboard", "Templates"],
      strategy:
        "Explain the business-proposal workflow and guide the user through the relevant writing options.",
    },

    product_announcement: {
      description: "The user wants to create or improve a product announcement.",
      areas: ["Dashboard", "Templates"],
      strategy:
        "Explain the product-announcement workflow using only known Writnexa capabilities.",
    },

    rewrite: {
      description: "The user wants to rewrite existing text.",
      areas: ["Dashboard", "Templates"],
      strategy:
        "Explain that Rewrite improves existing text for clarity, structure, tone, and impact. Guide the user through the known Rewrite workflow without inventing controls.",
    },

    writing_action: {
      description: "The user wants to Improve, Shorten, Expand, or Rewrite content.",
      areas: ["Dashboard"],
      strategy:
        "Identify the requested writing action and explain its purpose. If troubleshooting is involved, determine what the user sees before suggesting a next step.",
    },

    documents_missing: {
      description: "The user cannot find a saved document.",
      areas: ["Documents", "Dashboard"],
      strategy:
        "First clarify what the user currently sees and what document they are looking for. Avoid inventing navigation controls. Use only known document capabilities and escalate if the document still cannot be located.",
    },

    documents_search: {
      description: "The user wants to find a saved document.",
      areas: ["Documents"],
      strategy:
        "Explain the known document search capability and ask for clarification only if the user cannot identify the document they need.",
    },

    document_download: {
      description: "The user wants to download a document.",
      areas: ["Documents"],
      strategy:
        "Explain the known download capability and supported formats: TXT, Markdown, DOCX, and PDF.",
    },

    projects_help: {
      description: "The user needs help organizing or understanding projects.",
      areas: ["Projects"],
      strategy:
        "Explain that Projects organize related writing work. Do not invent project-specific controls that are not documented.",
    },

    preferences: {
      description: "The user wants to change writing preferences.",
      areas: ["Settings"],
      strategy:
        "Explain the documented preference capabilities, including default writing format, default writing tone, appearance, and saving preferences. Do not invent navigation details.",
    },

    translator_help: {
      description: "The user wants to use Writnexa Translator.",
      areas: ["Translator"],
      strategy:
        "Explain that Writnexa Translator translates content across supported languages. Do not claim an exact language count unless it is explicitly known from the current product information.",
    },

    account_help: {
      description: "The user needs help with account access or account settings.",
      areas: ["Account", "Settings"],
      strategy:
        "Provide help using documented account capabilities. Never request passwords, authentication codes, API keys, or payment-card details.",
    },

    password_reset: {
      description: "The user cannot access their account or needs to reset a password.",
      areas: ["Account", "Login", "Forgot Password", "Reset Password"],
      strategy:
        "Guide the user through the documented forgot-password and password-reset flow. Never ask for the user's password or authentication code.",
    },

    video_upload_failure: {
      description: "The user cannot upload a video.",
      areas: ["Video Editor"],
      strategy:
        "Confirm that a valid video file was selected. If useful, ask whether another supported video file works. Ask for the visible error or behavior if the problem continues, then escalate if unresolved.",
    },

    video_playback: {
      description: "The user has a problem previewing or playing a video.",
      areas: ["Video Editor"],
      strategy:
        "Determine whether the problem occurs in the editor preview or exported video. Ask one focused diagnostic question at a time and avoid assuming the cause.",
    },

    captions_failure: {
      description: "The user cannot generate or use captions correctly.",
      areas: ["Video Editor"],
      strategy:
        "Confirm that a video is loaded, suggest trying Generate captions again, then inspect the resulting behavior or visible error. Escalate if the problem remains unresolved.",
    },

    caption_sync: {
      description: "The user reports that captions are not synchronized correctly.",
      areas: ["Video Editor"],
      strategy:
        "Clarify what is out of sync and whether the issue occurs before or after export. Troubleshoot one step at a time and escalate if the issue persists.",
    },

    trim_help: {
      description: "The user needs help using or troubleshooting Trim.",
      areas: ["Video Editor"],
      strategy:
        "Explain the known Trim capability. If the user is troubleshooting an export, follow the video-export diagnostic sequence rather than skipping ahead.",
    },

    split_help: {
      description: "The user needs help using or troubleshooting Split at the playhead.",
      areas: ["Video Editor"],
      strategy:
        "Confirm that a split point has been added, then guide the user toward exporting the split result. If export fails, switch to the appropriate export troubleshooting flow.",
    },

    split_export_failure: {
      description: "The user cannot successfully export a split video.",
      areas: ["Video Editor"],
      strategy:
        "Confirm that a split point has been added and ask what happens when the user exports. If the problem persists, collect the visible behavior or error and escalate when necessary.",
    },

    remove_silence_failure: {
      description: "The user reports a problem with Remove Silence.",
      areas: ["Video Editor"],
      strategy:
        "Determine whether the issue occurs only in the editor or also in the exported video. If exported audio is missing, suggest trying Remove Silence again and then the main Export flow where appropriate. Escalate if unresolved.",
    },

    video_export_failure: {
      description: "The user reports that video export fails.",
      areas: ["Video Editor"],
      strategy:
        "Follow the strict diagnostic sequence: confirm a video is loaded, determine whether Trim is being used, determine whether Export starts and then fails or does nothing, ask for an exact visible error only when appropriate, retry once when there is no error, and escalate if the failure persists.",
    },

    usage_limits: {
      description: "The user asks about usage limits or available usage.",
      areas: ["Dashboard", "Account"],
      strategy:
        "Explain only the usage information that is currently known. Do not invent quotas, renewal dates, or plan restrictions.",
    },

    billing_upgrade: {
      description: "The user asks about upgrading or billing.",
      areas: ["Account", "Settings"],
      strategy:
        "Explain only documented upgrade or billing information. Never request or ask the user to provide payment-card details in chat.",
    },

    unknown_or_unresolved: {
      description: "The request cannot be confidently mapped to a documented Writnexa capability or troubleshooting flow.",
      areas: ["Support"],
      strategy:
        "Do not guess. Ask one concise clarifying question when that could resolve the ambiguity. If the issue remains outside the available knowledge, transparently explain that human review may be needed.",
    },
  },

  supportPolicy: {
    neverInventUI: true,
    neverInventFeatures: true,
    neverClaimPrivateAccess: true,
    neverRequestSensitiveCredentials: true,
    discloseAIIdentity: true,
    escalateWhenUnresolved: true,
  },
} as const;
