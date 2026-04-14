/**
 * AICW Ask AI Widget
 *
 * Standalone embeddable widget that lets visitors summarize any page
 * with AI services (ChatGPT, Claude, Perplexity, Gemini, Grok)
 * and share it via social platforms.
 *
 * Zero dependencies. No tracking. No analytics. No external API calls.
 * Just a floating UI widget — embed with a single <script> tag.
 *
 * Configuration via data attributes on the script tag.
 * See README.md for full documentation.
 */
(function() {
  'use strict';

  // ========================================================================
  // AI Service Registry
  // ========================================================================
  var AI_SERVICES = {
    chatgpt: {
      name: 'ChatGPT',
      url: 'https://chat.openai.com/?q='
    },
    claude: {
      name: 'Claude',
      url: 'https://claude.ai/new?q='
    },
    perplexity: {
      name: 'Perplexity',
      url: 'https://www.perplexity.ai/search/new?q='
    },
    gemini: {
      name: 'Gemini',
      url: 'https://www.google.com/search?udm=50&q='
    },
    grok: {
      name: 'Grok',
      url: 'https://x.com/i/grok?text='
    }
  };

  // ========================================================================
  // Share Services Registry
  // URL templates use {url}, {text}, {title} placeholders
  // ========================================================================
  var SHARE_SERVICES = {
    whatsapp: {
      name: 'WhatsApp',
      urlTemplate: 'https://api.whatsapp.com/send?text={text}%20{url}',
      type: 'redirect'
    },
    x: {
      name: 'X',
      urlTemplate: 'https://twitter.com/intent/tweet?text={text}&url={url}',
      type: 'redirect'
    },
    telegram: {
      name: 'Telegram',
      urlTemplate: 'https://t.me/share/url?url={url}&text={text}',
      type: 'redirect'
    },
    facebook: {
      name: 'Facebook',
      urlTemplate: 'https://www.facebook.com/sharer.php?u={url}',
      type: 'redirect'
    },
    linkedin: {
      name: 'LinkedIn',
      urlTemplate: 'https://www.linkedin.com/sharing/share-offsite/?url={url}',
      type: 'redirect'
    },
    reddit: {
      name: 'Reddit',
      urlTemplate: 'https://reddit.com/submit?url={url}&title={title}',
      type: 'redirect'
    },
    gmail: {
      name: 'Gmail',
      urlTemplate: 'https://mail.google.com/mail/?view=cm&su={title}&body={url}',
      type: 'redirect'
    },
    email: {
      name: 'Email',
      urlTemplate: 'mailto:?subject={title}&body={url}',
      type: 'redirect'
    },
    copy: {
      name: 'Copy Link',
      urlTemplate: null,
      type: 'clipboard'
    }
  };

  // ========================================================================
  // Inline SVG Icons (monochrome, scalable)
  // Based on Bootstrap Icons (MIT) and simplified brand marks
  // ========================================================================
  var AI_ICONS = {
    chatgpt: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z"/></svg>',
    claude: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z"/></svg>',
    perplexity: '<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 .188a.5.5 0 0 1 .503.5V4.03l3.022-2.92.059-.048a.51.51 0 0 1 .49-.054.5.5 0 0 1 .306.46v3.247h1.117l.1.01a.5.5 0 0 1 .403.49v5.558a.5.5 0 0 1-.503.5H12.38v3.258a.5.5 0 0 1-.312.462.51.51 0 0 1-.55-.11l-3.016-3.018v3.448c0 .275-.225.5-.503.5a.5.5 0 0 1-.503-.5v-3.448l-3.018 3.019a.51.51 0 0 1-.548.11.5.5 0 0 1-.312-.463v-3.258H2.503a.5.5 0 0 1-.503-.5V5.215l.01-.1c.047-.229.25-.4.493-.4H3.62V1.469l.006-.074a.5.5 0 0 1 .302-.387.51.51 0 0 1 .547.102l3.023 2.92V.687c0-.276.225-.5.503-.5M4.626 9.333v3.984l2.87-2.872v-4.01zm3.877 1.113 2.871 2.871V9.333l-2.87-2.897zm3.733-1.668a.5.5 0 0 1 .145.35v1.145h.612V5.715H9.201zm-9.23 1.495h.613V9.13c0-.131.052-.257.145-.35l3.033-3.064h-3.79zm1.62-5.558H6.76L4.626 2.652zm4.613 0h2.134V2.652z"/></svg>',
    gemini: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0c.17 0 .31.115.355.278a9.6 9.6 0 0 0 .494 1.46c.532 1.235 1.261 2.316 2.187 3.242.926.926 2.007 1.655 3.242 2.187a9.63 9.63 0 0 0 1.46.494.367.367 0 0 1 0 .712 9.6 9.6 0 0 0-1.46.494c-1.235.532-2.316 1.261-3.242 2.187-.926.926-1.655 2.007-2.187 3.242a9.63 9.63 0 0 0-.494 1.46.367.367 0 0 1-.711 0 9.6 9.6 0 0 0-.494-1.46c-.532-1.235-1.26-2.316-2.187-3.242-.926-.926-2.007-1.655-3.242-2.187a9.63 9.63 0 0 0-1.46-.494.367.367 0 0 1 0-.712 9.6 9.6 0 0 0 1.46-.494c1.235-.532 2.316-1.26 3.242-2.187.926-.926 1.655-2.007 2.187-3.242a9.63 9.63 0 0 0 .494-1.46A.367.367 0 0 1 8 0z"/></svg>',
    grok: '<svg viewBox="0 0 512 510" fill="currentColor"><path d="M213.235 306.019l178.976-180.002v.169l51.695-51.763c-.924 1.32-1.86 2.605-2.785 3.89-39.281 54.164-58.46 80.649-43.07 146.922l-.09-.101c10.61 45.11-.744 95.137-37.398 131.836-46.216 46.306-120.167 56.611-181.063 14.928l42.462-19.675c38.863 15.278 81.392 8.57 111.947-22.03 30.566-30.6 37.432-75.159 22.065-112.252-2.92-7.025-11.67-8.795-17.792-4.263l-124.947 92.341zm-25.786 22.437l-.033.034L68.094 435.217c7.565-10.429 16.957-20.294 26.327-30.149 26.428-27.803 52.653-55.359 36.654-94.302-21.422-52.112-8.952-113.177 30.724-152.898 41.243-41.254 101.98-51.661 152.706-30.758 11.23 4.172 21.016 10.114 28.638 15.639l-42.359 19.584c-39.44-16.563-84.629-5.299-112.207 22.313-37.298 37.308-44.84 102.003-1.128 143.81z"/></svg>'
  };

  // ========================================================================
  // Share Icons (monochrome, scalable)
  // ========================================================================
  var SHARE_ICONS = {
    whatsapp: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>',
    x: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg>',
    telegram: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/></svg>',
    facebook: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/></svg>',
    linkedin: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/></svg>',
    reddit: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z"/><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165"/></svg>',
    gmail: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/></svg>',
    email: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg>',
    copy: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/></svg>',
    checkmark: '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/></svg>'
  };

  // ========================================================================
  // Color Helpers
  // ========================================================================

  /**
   * Parse hex color to RGB components
   * Supports #RGB and #RRGGBB formats
   */
  function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return null;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) return null;
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return r + ',' + g + ',' + b;
  }

  /**
   * Build gradient CSS from a color
   * Returns neutral gray gradient if no color provided
   */
  function buildGradient(color) {
    var rgb = color ? hexToRgb(color) : null;
    var base = rgb || '0,0,0';
    return 'linear-gradient(180deg,rgba(' + base + ',0.08) 0%,rgba(' + base + ',0.20) 50%,rgba(' + base + ',0.08) 100%)';
  }

  // ========================================================================
  // Configuration Defaults
  // ========================================================================
  var DEFAULTS = {
    position: 'right',
    services: 'gemini,chatgpt,perplexity,claude,grok',
    prompt: 'Summarize this page:',
    mobilePosition: 'bottom',
    shareEnabled: true,
    shareServices: 'whatsapp,telegram,x,gmail,linkedin',
    poweredBy: true
  };

  // ========================================================================
  // Get Configuration from Script Tag
  // ========================================================================
  function getConfig() {
    // Prefer document.currentScript (available during initial execution)
    var scriptEl = document.currentScript;

    // Fallback: search for script by src attribute
    if (!scriptEl) {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].src && scripts[i].src.indexOf('aicw-widget-ask-ai') !== -1) {
          scriptEl = scripts[i];
          break;
        }
      }
    }

    var config = {};

    if (!scriptEl) return config;

    // Summarize enabled (default: true)
    var enabled = scriptEl.getAttribute('data-summarize');
    config.enabled = enabled !== 'false' && enabled !== '0';

    // Position
    config.position = scriptEl.getAttribute('data-position') || DEFAULTS.position;
    config.mobilePosition = scriptEl.getAttribute('data-mobile-position') || DEFAULTS.mobilePosition;

    // Services
    config.services = scriptEl.getAttribute('data-services') || DEFAULTS.services;
    config.prompt = scriptEl.getAttribute('data-prompt') || DEFAULTS.prompt;

    // Share
    var shareEnabled = scriptEl.getAttribute('data-share');
    config.shareEnabled = shareEnabled !== 'false' && shareEnabled !== '0';
    config.shareServices = scriptEl.getAttribute('data-share-services') || DEFAULTS.shareServices;

    // Colors
    config.bgColor = scriptEl.getAttribute('data-bg-color') || '';
    config.textColor = scriptEl.getAttribute('data-text-color') || '';
    config.accentColor = scriptEl.getAttribute('data-accent-color') || '';
    config.iconColor = scriptEl.getAttribute('data-icon-color') || '';
    config.buttonBgColor = scriptEl.getAttribute('data-button-bg-color') || '';
    config.buttonTextColor = scriptEl.getAttribute('data-button-text-color') || '';

    // Label override
    config.label = scriptEl.getAttribute('data-label') || '';

    // Powered by
    var poweredBy = scriptEl.getAttribute('data-powered-by');
    config.poweredBy = poweredBy !== 'false' && poweredBy !== '0';

    return config;
  }

  // Save config at load time (document.currentScript only works during execution)
  var savedConfig = getConfig();

  // ========================================================================
  // CSS Styles (generated dynamically for gradient and custom colors)
  // ========================================================================
  function getWidgetCss(gradient, config) {
    var barBg = config.buttonBgColor || 'rgba(255,255,255,0.85)';
    var barText = config.buttonTextColor || config.textColor || '#374151';
    var iconColor = config.iconColor || '#1f2937';
    var popupBg = config.bgColor || 'rgba(255,255,255,0.92)';
    var textColor = config.textColor || '#374151';
    var secondaryText = config.textColor || '#6b7280';

    return '\
    /* Trigger Bar - Glassmorphism */\
    #aicw-ask-ai-bar{position:fixed;z-index:2147483646;display:flex;align-items:center;background:' + barBg + ';backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.5);border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.1);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;transition:opacity 0.2s,box-shadow 0.2s;overflow:hidden;cursor:pointer}\
    #aicw-ask-ai-bar:hover{box-shadow:0 4px 24px rgba(0,0,0,0.12)}\
    .aicw-trigger{display:flex;align-items:center;gap:8px;padding:0;background:none;border:none;cursor:pointer;font-family:inherit}\
    .aicw-trigger-text{font-size:14px;font-weight:500;color:' + barText + ';white-space:nowrap}\
    .aicw-close{display:flex;align-items:center;justify-content:center;width:24px;height:24px;background:rgba(0,0,0,0.05);border:none;border-radius:4px;color:' + barText + ';font-size:16px;cursor:pointer;transition:all 0.15s}\
    .aicw-close:hover{background:rgba(0,0,0,0.1)}\
    /* Horizontal layout (top/bottom) */\
    #aicw-ask-ai-bar.aicw-top,#aicw-ask-ai-bar.aicw-bottom{flex-direction:row;gap:10px;padding:10px 14px}\
    #aicw-ask-ai-bar.aicw-top .aicw-trigger,#aicw-ask-ai-bar.aicw-bottom .aicw-trigger{flex-direction:row}\
    #aicw-ask-ai-bar.aicw-top::before,#aicw-ask-ai-bar.aicw-bottom::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:' + gradient + ';border-radius:3px 0 0 3px}\
    .aicw-top{top:12px;left:50%;transform:translateX(-50%)}\
    .aicw-bottom{bottom:12px;left:50%;transform:translateX(-50%)}\
    /* Vertical layout (left/right) */\
    #aicw-ask-ai-bar.aicw-left,#aicw-ask-ai-bar.aicw-right{flex-direction:column;gap:8px;padding:12px 10px}\
    #aicw-ask-ai-bar.aicw-left .aicw-trigger,#aicw-ask-ai-bar.aicw-right .aicw-trigger{flex-direction:column}\
    #aicw-ask-ai-bar.aicw-left .aicw-trigger-text,#aicw-ask-ai-bar.aicw-right .aicw-trigger-text{writing-mode:vertical-rl;text-orientation:mixed}\
    #aicw-ask-ai-bar.aicw-left .aicw-trigger-text{transform:rotate(180deg)}\
    #aicw-ask-ai-bar.aicw-right::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:' + gradient + ';border-radius:3px 0 0 3px}\
    #aicw-ask-ai-bar.aicw-left::before{content:"";position:absolute;right:0;top:0;bottom:0;width:3px;background:' + gradient + ';border-radius:0 3px 3px 0}\
    .aicw-left{left:12px;top:50%;transform:translateY(-50%)}\
    .aicw-right{right:12px;top:50%;transform:translateY(-50%)}\
    /* Popup - Glassmorphism */\
    #aicw-ask-ai-popup{position:fixed;z-index:2147483647;background:' + popupBg + ';backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.5);border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.15);padding:8px;opacity:0;pointer-events:none;transition:opacity 0.2s;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;min-width:180px;max-width:280px}\
    #aicw-ask-ai-popup::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:' + gradient + ';border-radius:3px 0 0 3px}\
    #aicw-ask-ai-popup.aicw-visible{opacity:1;pointer-events:auto}\
    .aicw-popup-title{padding:8px 12px;font-size:11px;font-weight:600;color:' + secondaryText + ';text-transform:uppercase;letter-spacing:0.5px}\
    .aicw-popup-icons-row{display:flex;gap:8px;padding:8px 12px;flex-wrap:wrap}\
    .aicw-popup-icon-btn{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(0,0,0,0.04);color:' + iconColor + ';text-decoration:none;transition:background 0.15s,transform 0.1s}\
    .aicw-popup-icon-btn:hover{background:rgba(0,0,0,0.08);transform:scale(1.05)}\
    .aicw-popup-icon-btn svg{width:22px;height:22px}\
    .aicw-powered-by{display:block;text-align:right;padding:8px 12px 4px;font-size:10px;color:rgba(0,0,0,0.35)}\
    .aicw-powered-by a{color:rgba(0,0,0,0.35);text-decoration:none}\
    .aicw-powered-by a:hover{color:rgba(0,0,0,0.5)}\
    .aicw-popup-separator{height:1px;background:rgba(0,0,0,0.08);margin:8px 0}\
    .aicw-popup-close{position:absolute;top:8px;right:8px;display:flex;align-items:center;justify-content:center;width:20px;height:20px;background:rgba(0,0,0,0.05);border:none;border-radius:4px;color:#9ca3af;font-size:14px;cursor:pointer;transition:all 0.15s;z-index:1}\
    .aicw-popup-close:hover{background:rgba(0,0,0,0.1);color:' + textColor + '}\
    .aicw-popup-description-wrapper{padding:12px 14px;margin:-8px -8px 0 -8px;background:rgba(0,0,0,0.03);border-radius:12px 12px 0 0;border-bottom:1px solid rgba(0,0,0,0.06)}\
    .aicw-popup-description-label{display:block;font-size:10px;font-weight:600;color:' + secondaryText + ';text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}\
    .aicw-popup-description{font-size:13px;line-height:1.5;color:' + textColor + ';overflow:hidden;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical}\
    /* Mobile: horizontal bar + bottom sheet popup */\
    @media(max-width:767px){#aicw-ask-ai-bar{flex-direction:row!important;gap:10px!important;padding:10px 14px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important}}\
    @media(max-width:767px){#aicw-ask-ai-bar .aicw-trigger{flex-direction:row!important}}\
    @media(max-width:767px){#aicw-ask-ai-bar .aicw-trigger-text{writing-mode:horizontal-tb!important;transform:none!important}}\
    @media(max-width:767px){#aicw-ask-ai-bar::before{left:0!important;right:auto!important;border-radius:3px 0 0 3px!important}}\
    @media(max-width:767px){#aicw-ask-ai-bar.aicw-mobile-top{top:12px!important;bottom:auto!important}}\
    @media(max-width:767px){#aicw-ask-ai-bar.aicw-mobile-bottom{bottom:12px!important;top:auto!important}}\
    @media(max-width:767px){#aicw-ask-ai-popup{left:8px!important;right:8px!important;bottom:0!important;top:auto!important;border-radius:16px 16px 0 0;padding:16px;transform:translateY(100%);transition:transform 0.3s,opacity 0.2s}}\
    @media(max-width:767px){#aicw-ask-ai-popup.aicw-visible{transform:translateY(0)}}\
    @media(max-width:767px){.aicw-popup-icons-row{gap:6px;padding:8px 10px}}\
    @media(max-width:767px){.aicw-popup-icon-btn{width:36px;height:36px}}\
    ';
  }

  // ========================================================================
  // Parse Services Lists
  // ========================================================================
  function parseServices(servicesStr) {
    if (!servicesStr || servicesStr === 'all') {
      return Object.keys(AI_SERVICES);
    }
    return servicesStr.toLowerCase().split(',').map(function(s) {
      return s.trim();
    }).filter(function(s) {
      return AI_SERVICES[s];
    });
  }

  function parseShareServices(servicesStr) {
    if (!servicesStr || servicesStr === 'all') {
      return Object.keys(SHARE_SERVICES);
    }
    return servicesStr.toLowerCase().split(',').map(function(s) {
      return s.trim();
    }).filter(function(s) {
      return SHARE_SERVICES[s];
    });
  }

  // ========================================================================
  // Build AI Service URL with Prompt
  // ========================================================================
  function buildServiceUrl(serviceKey, prompt) {
    var service = AI_SERVICES[serviceKey];
    if (!service) return null;

    var title = document.title || '';
    var url = window.location.href;
    var fullPrompt = prompt + ' "' + title + '" ' + url;
    return service.url + encodeURIComponent(fullPrompt);
  }

  // ========================================================================
  // Build Share URL (no tracking UTM params)
  // ========================================================================
  function buildShareUrl(serviceKey) {
    var service = SHARE_SERVICES[serviceKey];
    if (!service || service.type === 'clipboard') return null;

    var url = encodeURIComponent(window.location.href);
    var title = encodeURIComponent(document.title || '');

    return service.urlTemplate
      .replace('{url}', url)
      .replace('{text}', title)
      .replace('{title}', title);
  }

  // ========================================================================
  // Clipboard Copy
  // ========================================================================
  function handleCopyLink(copyBtn) {
    var url = window.location.href;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        showCopySuccess(copyBtn);
      }).catch(function() {
        fallbackCopy(url, copyBtn);
      });
    } else {
      fallbackCopy(url, copyBtn);
    }
  }

  function fallbackCopy(text, copyBtn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      showCopySuccess(copyBtn);
    } catch (e) {
      // Silent fail
    }

    document.body.removeChild(textarea);
  }

  function showCopySuccess(copyBtn) {
    if (!copyBtn) return;

    var svgEl = copyBtn.querySelector('svg');
    if (!svgEl) return;

    var originalIcon = svgEl.outerHTML;
    var originalTitle = copyBtn.title;

    svgEl.outerHTML = SHARE_ICONS.checkmark;
    copyBtn.title = 'Copied!';

    setTimeout(function() {
      var newSvg = copyBtn.querySelector('svg');
      if (newSvg) newSvg.outerHTML = originalIcon;
      copyBtn.title = originalTitle;
    }, 1500);
  }

  // ========================================================================
  // Get Meta Description from Page
  // ========================================================================
  function getMetaDescription() {
    try {
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && metaDesc.content) {
        var content = metaDesc.content.trim();
        if (content.length > 0) return content;
      }

      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && ogDesc.content) {
        var ogContent = ogDesc.content.trim();
        if (ogContent.length > 0) return ogContent;
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  // ========================================================================
  // Popup State
  // ========================================================================
  var popupState = {
    isOpen: false,
    config: null,
    services: []
  };

  // ========================================================================
  // Create Popup DOM
  // ========================================================================
  function createPopup(config, services, shareServices) {
    if (document.getElementById('aicw-ask-ai-popup')) return;

    var popup = document.createElement('div');
    popup.id = 'aicw-ask-ai-popup';
    popup.setAttribute('role', 'menu');
    popup.setAttribute('aria-label', 'Services');

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'aicw-popup-close';
    closeBtn.title = 'Close';
    closeBtn.setAttribute('aria-label', 'Close popup');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closePopup();
    });
    popup.appendChild(closeBtn);

    // Meta description preview
    var metaDescription = getMetaDescription();
    if (metaDescription && metaDescription.length > 0) {
      var descWrapper = document.createElement('div');
      descWrapper.className = 'aicw-popup-description-wrapper';

      var descLabel = document.createElement('div');
      descLabel.className = 'aicw-popup-description-label';
      descLabel.textContent = 'Page summary';
      descWrapper.appendChild(descLabel);

      var descText = document.createElement('div');
      descText.className = 'aicw-popup-description';
      descText.textContent = metaDescription;
      descWrapper.appendChild(descText);

      popup.appendChild(descWrapper);
    }

    // Summarize section
    if (config.enabled && services && services.length > 0) {
      var title = document.createElement('div');
      title.className = 'aicw-popup-title';
      title.textContent = 'Summarize with';
      popup.appendChild(title);

      var summarizeRow = document.createElement('div');
      summarizeRow.className = 'aicw-popup-icons-row';

      services.forEach(function(serviceKey) {
        var service = AI_SERVICES[serviceKey];
        var icon = AI_ICONS[serviceKey];
        if (!service || !icon) return;

        var url = buildServiceUrl(serviceKey, config.prompt);
        if (!url) return;

        var item = document.createElement('a');
        item.href = url;
        item.target = '_blank';
        item.rel = 'noopener noreferrer';
        item.className = 'aicw-popup-icon-btn';
        item.title = service.name;
        item.setAttribute('role', 'menuitem');
        item.setAttribute('aria-label', 'Summarize with ' + service.name);
        item.innerHTML = icon;

        item.addEventListener('click', function() {
          closePopup();
        });

        summarizeRow.appendChild(item);
      });

      popup.appendChild(summarizeRow);
    }

    // Share section
    if (config.shareEnabled && shareServices && shareServices.length > 0) {
      if (config.enabled && services && services.length > 0) {
        var separator = document.createElement('div');
        separator.className = 'aicw-popup-separator';
        popup.appendChild(separator);
      }

      var shareTitle = document.createElement('div');
      shareTitle.className = 'aicw-popup-title';
      shareTitle.textContent = 'Share';
      popup.appendChild(shareTitle);

      var shareRow = document.createElement('div');
      shareRow.className = 'aicw-popup-icons-row';

      shareServices.forEach(function(serviceKey) {
        var service = SHARE_SERVICES[serviceKey];
        var icon = SHARE_ICONS[serviceKey];
        if (!service || !icon) return;

        var item = document.createElement('a');
        item.className = 'aicw-popup-icon-btn';
        item.title = service.name;
        item.setAttribute('role', 'menuitem');
        item.setAttribute('aria-label', 'Share via ' + service.name);
        item.innerHTML = icon;

        if (service.type === 'clipboard') {
          item.href = '#';
          item.addEventListener('click', function(e) {
            e.preventDefault();
            handleCopyLink(item);
          });
        } else {
          var url = buildShareUrl(serviceKey);
          item.href = url;
          item.target = '_blank';
          item.rel = 'noopener noreferrer';
          item.addEventListener('click', function() {
            closePopup();
          });
        }

        shareRow.appendChild(item);
      });

      popup.appendChild(shareRow);
    }

    // Powered by AICW
    if (config.poweredBy) {
      var poweredBy = document.createElement('span');
      poweredBy.className = 'aicw-powered-by';
      poweredBy.appendChild(document.createTextNode('powered by '));
      var poweredByLink = document.createElement('a');
      poweredByLink.href = 'https://aicw.io';
      poweredByLink.target = '_blank';
      poweredByLink.rel = 'noopener noreferrer';
      poweredByLink.textContent = 'AICW';
      poweredBy.appendChild(poweredByLink);
      popup.appendChild(poweredBy);
    }

    document.body.appendChild(popup);

    popupState.config = config;
    popupState.services = services;
    popupState.shareServices = shareServices;
  }

  // ========================================================================
  // Position Popup Relative to Trigger
  // ========================================================================
  function positionPopup() {
    var popup = document.getElementById('aicw-ask-ai-popup');
    var bar = document.getElementById('aicw-ask-ai-bar');
    if (!popup || !bar) return;

    // On mobile, popup is positioned via CSS (bottom sheet)
    if (window.innerWidth <= 767) {
      popup.style.left = '';
      popup.style.right = '';
      popup.style.top = '';
      popup.style.bottom = '';
      return;
    }

    var barRect = bar.getBoundingClientRect();
    var position = popupState.config ? popupState.config.position : 'right';

    popup.style.left = '';
    popup.style.right = '';
    popup.style.top = '';
    popup.style.bottom = '';

    switch (position) {
      case 'left':
        popup.style.left = (barRect.right + 12) + 'px';
        popup.style.top = barRect.top + 'px';
        break;
      case 'right':
        popup.style.right = (window.innerWidth - barRect.right) + 'px';
        popup.style.top = barRect.top + 'px';
        break;
      case 'top':
        popup.style.top = (barRect.bottom + 12) + 'px';
        popup.style.left = barRect.left + 'px';
        break;
      case 'bottom':
        popup.style.bottom = (window.innerHeight - barRect.top + 12) + 'px';
        popup.style.left = barRect.left + 'px';
        break;
    }
  }

  // ========================================================================
  // Open / Close / Toggle Popup
  // ========================================================================
  function openPopup() {
    var popup = document.getElementById('aicw-ask-ai-popup');
    var bar = document.getElementById('aicw-ask-ai-bar');
    if (!popup) return;

    // Position popup BEFORE hiding bar (getBoundingClientRect needs visible element)
    positionPopup();

    if (bar) {
      bar.style.display = 'none';
    }

    popup.classList.add('aicw-visible');
    popupState.isOpen = true;

    setTimeout(function() {
      document.addEventListener('click', handleClickOutside);
    }, 10);
  }

  function closePopup() {
    var popup = document.getElementById('aicw-ask-ai-popup');
    var bar = document.getElementById('aicw-ask-ai-bar');
    if (!popup) return;

    popup.classList.remove('aicw-visible');
    popupState.isOpen = false;

    if (bar) {
      bar.style.display = '';
    }

    document.removeEventListener('click', handleClickOutside);
  }

  function togglePopup() {
    if (popupState.isOpen) {
      closePopup();
    } else {
      openPopup();
    }
  }

  function handleClickOutside(e) {
    var popup = document.getElementById('aicw-ask-ai-popup');
    var bar = document.getElementById('aicw-ask-ai-bar');

    if (!popup || !bar) return;

    if (!popup.contains(e.target) && !bar.contains(e.target)) {
      closePopup();
    }
  }

  // ========================================================================
  // Inject CSS Styles
  // ========================================================================
  function injectStyles(config) {
    if (document.getElementById('aicw-ask-ai-styles')) return;

    var accentColor = config.accentColor || config.textColor;
    var gradient = buildGradient(accentColor);
    var style = document.createElement('style');
    style.id = 'aicw-ask-ai-styles';
    style.textContent = getWidgetCss(gradient, config);
    document.head.appendChild(style);
  }

  // ========================================================================
  // Create Floating Bar DOM (Trigger Button)
  // ========================================================================
  function createBar(config, services, shareServices) {
    if (document.getElementById('aicw-ask-ai-bar')) return;

    var hasSummarize = services && services.length > 0;
    var hasShare = shareServices && shareServices.length > 0;

    // Determine label
    var buttonText = config.label || 'Summarize';
    var ariaLabel = 'Summarize this page';
    if (!config.label) {
      if (!hasSummarize && hasShare) {
        buttonText = 'Share';
        ariaLabel = 'Share this page';
      } else if (hasSummarize && hasShare) {
        buttonText = 'Summarize';
        ariaLabel = 'Summarize or share this page';
      }
    } else {
      ariaLabel = config.label;
    }

    var bar = document.createElement('div');
    bar.id = 'aicw-ask-ai-bar';
    bar.className = 'aicw-' + config.position + ' aicw-mobile-' + config.mobilePosition;
    bar.setAttribute('role', 'button');
    bar.setAttribute('aria-label', ariaLabel);
    bar.setAttribute('aria-haspopup', 'true');
    bar.setAttribute('aria-expanded', 'false');

    // Trigger button
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'aicw-trigger';

    var triggerText = document.createElement('span');
    triggerText.className = 'aicw-trigger-text';
    triggerText.textContent = buttonText;
    trigger.appendChild(triggerText);

    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      togglePopup();
      bar.setAttribute('aria-expanded', popupState.isOpen ? 'true' : 'false');
    });

    bar.appendChild(trigger);

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'aicw-close';
    closeBtn.title = 'Hide';
    closeBtn.setAttribute('aria-label', 'Close bar');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      bar.style.display = 'none';
      var popup = document.getElementById('aicw-ask-ai-popup');
      if (popup) popup.style.display = 'none';
    });
    bar.appendChild(closeBtn);

    document.body.appendChild(bar);
  }

  // ========================================================================
  // Initialize Widget
  // ========================================================================
  function initWidget() {
    var config = savedConfig;

    // Skip iframes (avoid recursion / visual clutter)
    if (window !== window.parent) return;

    // Parse services
    var services = config.enabled !== false ? parseServices(config.services) : [];
    var shareServices = config.shareEnabled !== false ? parseShareServices(config.shareServices) : [];

    // Only proceed if at least one feature is enabled with services
    if (services.length === 0 && shareServices.length === 0) return;

    // Inject styles and create bar + popup
    injectStyles(config);
    createBar(config, services, shareServices);
    createPopup(config, services, shareServices);
  }

  // ========================================================================
  // Initialize when DOM is ready
  // ========================================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();
