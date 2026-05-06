/**
 * Chai CSS — A lightweight utility-first CSS engine
 * Scans the DOM for chai-* classes, parses them, applies inline styles, and removes them.
 */
(function () {
  'use strict';

  /* ── colour map ─────────────────────────────────────────────── */
  const COLORS = {
    black: '#000', white: '#fff', transparent: 'transparent',
    red: '#ef4444', orange: '#f97316', amber: '#f59e0b', yellow: '#eab308',
    lime: '#84cc16', green: '#22c55e', emerald: '#10b981', teal: '#14b8a6',
    cyan: '#06b6d4', sky: '#0ea5e9', blue: '#3b82f6', indigo: '#6366f1',
    violet: '#8b5cf6', purple: '#a855f7', fuchsia: '#d946ef', pink: '#ec4899',
    rose: '#f43f5e', slate: '#64748b', gray: '#6b7280', zinc: '#71717a',
    neutral: '#737373', stone: '#78716c',
  };

  /* ── spacing scale (in px) ──────────────────────────────────── */
  function spacingValue(v) {
    const map = {
      '0': '0px', '0.5': '2px', '1': '4px', '1.5': '6px', '2': '8px',
      '2.5': '10px', '3': '12px', '3.5': '14px', '4': '16px', '5': '20px',
      '6': '24px', '7': '28px', '8': '32px', '9': '36px', '10': '40px',
      '11': '44px', '12': '48px', '14': '56px', '16': '64px', '20': '80px',
      '24': '96px', '28': '112px', '32': '128px', '36': '144px',
      '40': '160px', '44': '176px', '48': '192px', '52': '208px',
      '56': '224px', '60': '240px', '64': '256px', '72': '288px',
      '80': '320px', '96': '384px', 'px': '1px', 'auto': 'auto',
      'full': '100%', 'screen': '100vw', 'svw': '100svw', 'lvw': '100lvw',
      'dvw': '100dvw', 'min': 'min-content', 'max': 'max-content',
      'fit': 'fit-content',
    };
    return map[v] || (v + 'px');
  }

  function resolveColor(v) {
    if (COLORS[v]) return COLORS[v];
    if (v && v.startsWith('#')) return v;
    if (v && v.startsWith('rgb')) return v;
    return v;
  }

  /* ── font-size scale ────────────────────────────────────────── */
  const FONT_SIZES = {
    'xs': '12px', 'sm': '14px', 'base': '16px', 'lg': '18px',
    'xl': '20px', '2xl': '24px', '3xl': '30px', '4xl': '36px',
    '5xl': '48px', '6xl': '60px', '7xl': '72px', '8xl': '96px', '9xl': '128px',
  };

  /* ── font-weight scale ──────────────────────────────────────── */
  const FONT_WEIGHTS = {
    'thin': '100', 'extralight': '200', 'light': '300', 'normal': '400',
    'medium': '500', 'semibold': '600', 'bold': '700', 'extrabold': '800', 'black': '900',
  };

  /* ── border-radius scale ────────────────────────────────────── */
  const RADII = {
    'none': '0px', 'sm': '2px', '': '4px', 'md': '6px', 'lg': '8px',
    'xl': '12px', '2xl': '16px', '3xl': '24px', 'full': '9999px',
  };

  /* ── border-width scale ─────────────────────────────────────── */
  const BORDER_WIDTHS = {
    '': '1px', '0': '0px', '2': '2px', '4': '4px', '8': '8px',
  };

  /* ── opacity scale ──────────────────────────────────────────── */
  const OPACITIES = {
    '0': '0', '5': '0.05', '10': '0.1', '15': '0.15', '20': '0.2',
    '25': '0.25', '30': '0.3', '35': '0.35', '40': '0.4', '45': '0.45',
    '50': '0.5', '55': '0.55', '60': '0.6', '65': '0.65', '70': '0.7',
    '75': '0.75', '80': '0.8', '85': '0.85', '90': '0.9', '95': '0.95', '100': '1',
  };

  /* ── line-height scale ──────────────────────────────────────── */
  const LINE_HEIGHTS = {
    'none': '1', 'tight': '1.25', 'snug': '1.375', 'normal': '1.5',
    'relaxed': '1.625', 'loose': '2',
  };

  const LETTER_SPACINGS = {
    'tighter': '-0.05em', 'tight': '-0.025em', 'normal': '0em',
    'wide': '0.025em', 'wider': '0.05em', 'widest': '0.1em',
  };

  /* ── z-index scale ──────────────────────────────────────────── */
  const Z_INDICES = {
    '0': '0', '10': '10', '20': '20', '30': '30', '40': '40', '50': '50', 'auto': 'auto',
  };

  /* ── master rules table ─────────────────────────────────────── */
  function buildRules() {
    const rules = [];

    /* helper: push a simple exact-match rule */
    function exact(name, prop, val) {
      rules.push({ pattern: name, apply: (s) => { s[prop] = val; } });
    }

    /* --- DISPLAY --- */
    exact('block', 'display', 'block');
    exact('inline-block', 'display', 'inline-block');
    exact('inline', 'display', 'inline');
    exact('flex', 'display', 'flex');
    exact('inline-flex', 'display', 'inline-flex');
    exact('grid', 'display', 'grid');
    exact('inline-grid', 'display', 'inline-grid');
    exact('hidden', 'display', 'none');
    exact('table', 'display', 'table');
    exact('table-row', 'display', 'table-row');
    exact('table-cell', 'display', 'table-cell');

    /* --- POSITION --- */
    exact('static', 'position', 'static');
    exact('fixed', 'position', 'fixed');
    exact('absolute', 'position', 'absolute');
    exact('relative', 'position', 'relative');
    exact('sticky', 'position', 'sticky');

    /* --- OVERFLOW --- */
    exact('overflow-auto', 'overflow', 'auto');
    exact('overflow-hidden', 'overflow', 'hidden');
    exact('overflow-visible', 'overflow', 'visible');
    exact('overflow-scroll', 'overflow', 'scroll');
    exact('overflow-x-auto', 'overflowX', 'auto');
    exact('overflow-x-hidden', 'overflowX', 'hidden');
    exact('overflow-y-auto', 'overflowY', 'auto');
    exact('overflow-y-hidden', 'overflowY', 'hidden');

    /* --- FLEX --- */
    exact('flex-row', 'flexDirection', 'row');
    exact('flex-row-reverse', 'flexDirection', 'row-reverse');
    exact('flex-col', 'flexDirection', 'column');
    exact('flex-col-reverse', 'flexDirection', 'column-reverse');
    exact('flex-wrap', 'flexWrap', 'wrap');
    exact('flex-wrap-reverse', 'flexWrap', 'wrap-reverse');
    exact('flex-nowrap', 'flexWrap', 'nowrap');
    exact('flex-1', 'flex', '1 1 0%');
    exact('flex-auto', 'flex', '1 1 auto');
    exact('flex-initial', 'flex', '0 1 auto');
    exact('flex-none', 'flex', 'none');
    exact('grow', 'flexGrow', '1');
    exact('grow-0', 'flexGrow', '0');
    exact('shrink', 'flexShrink', '1');
    exact('shrink-0', 'flexShrink', '0');

    /* --- JUSTIFY / ALIGN --- */
    exact('justify-start', 'justifyContent', 'flex-start');
    exact('justify-end', 'justifyContent', 'flex-end');
    exact('justify-center', 'justifyContent', 'center');
    exact('justify-between', 'justifyContent', 'space-between');
    exact('justify-around', 'justifyContent', 'space-around');
    exact('justify-evenly', 'justifyContent', 'space-evenly');
    exact('items-start', 'alignItems', 'flex-start');
    exact('items-end', 'alignItems', 'flex-end');
    exact('items-center', 'alignItems', 'center');
    exact('items-baseline', 'alignItems', 'baseline');
    exact('items-stretch', 'alignItems', 'stretch');
    exact('self-auto', 'alignSelf', 'auto');
    exact('self-start', 'alignSelf', 'flex-start');
    exact('self-end', 'alignSelf', 'flex-end');
    exact('self-center', 'alignSelf', 'center');
    exact('self-stretch', 'alignSelf', 'stretch');
    exact('content-start', 'alignContent', 'flex-start');
    exact('content-end', 'alignContent', 'flex-end');
    exact('content-center', 'alignContent', 'center');
    exact('content-between', 'alignContent', 'space-between');

    /* --- GAP --- */
    rules.push({ prefix: 'gap-', apply: (s, v) => { s.gap = spacingValue(v); } });
    rules.push({ prefix: 'gap-x-', apply: (s, v) => { s.columnGap = spacingValue(v); } });
    rules.push({ prefix: 'gap-y-', apply: (s, v) => { s.rowGap = spacingValue(v); } });

    /* --- PADDING --- */
    rules.push({ prefix: 'p-', apply: (s, v) => { s.padding = spacingValue(v); } });
    rules.push({ prefix: 'px-', apply: (s, v) => { s.paddingLeft = spacingValue(v); s.paddingRight = spacingValue(v); } });
    rules.push({ prefix: 'py-', apply: (s, v) => { s.paddingTop = spacingValue(v); s.paddingBottom = spacingValue(v); } });
    rules.push({ prefix: 'pt-', apply: (s, v) => { s.paddingTop = spacingValue(v); } });
    rules.push({ prefix: 'pr-', apply: (s, v) => { s.paddingRight = spacingValue(v); } });
    rules.push({ prefix: 'pb-', apply: (s, v) => { s.paddingBottom = spacingValue(v); } });
    rules.push({ prefix: 'pl-', apply: (s, v) => { s.paddingLeft = spacingValue(v); } });

    /* --- MARGIN --- */
    rules.push({ prefix: 'm-', apply: (s, v) => { s.margin = spacingValue(v); } });
    rules.push({ prefix: 'mx-', apply: (s, v) => { s.marginLeft = spacingValue(v); s.marginRight = spacingValue(v); } });
    rules.push({ prefix: 'my-', apply: (s, v) => { s.marginTop = spacingValue(v); s.marginBottom = spacingValue(v); } });
    rules.push({ prefix: 'mt-', apply: (s, v) => { s.marginTop = spacingValue(v); } });
    rules.push({ prefix: 'mr-', apply: (s, v) => { s.marginRight = spacingValue(v); } });
    rules.push({ prefix: 'mb-', apply: (s, v) => { s.marginBottom = spacingValue(v); } });
    rules.push({ prefix: 'ml-', apply: (s, v) => { s.marginLeft = spacingValue(v); } });

    /* --- WIDTH / HEIGHT --- */
    rules.push({ prefix: 'w-', apply: (s, v) => { s.width = spacingValue(v); } });
    rules.push({ prefix: 'h-', apply: (s, v) => { s.height = spacingValue(v); } });
    rules.push({ prefix: 'min-w-', apply: (s, v) => { s.minWidth = spacingValue(v); } });
    rules.push({ prefix: 'min-h-', apply: (s, v) => { s.minHeight = spacingValue(v); } });
    rules.push({ prefix: 'max-w-', apply: (s, v) => { s.maxWidth = spacingValue(v); } });
    rules.push({ prefix: 'max-h-', apply: (s, v) => { s.maxHeight = spacingValue(v); } });

    /* --- INSET --- */
    rules.push({ prefix: 'top-', apply: (s, v) => { s.top = spacingValue(v); } });
    rules.push({ prefix: 'right-', apply: (s, v) => { s.right = spacingValue(v); } });
    rules.push({ prefix: 'bottom-', apply: (s, v) => { s.bottom = spacingValue(v); } });
    rules.push({ prefix: 'left-', apply: (s, v) => { s.left = spacingValue(v); } });
    rules.push({ prefix: 'inset-', apply: (s, v) => { const val = spacingValue(v); s.top = val; s.right = val; s.bottom = val; s.left = val; } });

    /* --- BACKGROUND COLOR --- */
    rules.push({ prefix: 'bg-', apply: (s, v) => { s.backgroundColor = resolveColor(v); } });

    /* --- TEXT COLOR --- */
    rules.push({ prefix: 'text-', apply: (s, v) => {
      if (FONT_SIZES[v]) { s.fontSize = FONT_SIZES[v]; }
      else if (['left', 'center', 'right', 'justify', 'start', 'end'].includes(v)) { s.textAlign = v; }
      else { s.color = resolveColor(v); }
    }});

    /* --- FONT SIZE (explicit) --- */
    rules.push({ prefix: 'font-', apply: (s, v) => {
      if (FONT_WEIGHTS[v]) { s.fontWeight = FONT_WEIGHTS[v]; }
      else { s.fontFamily = v; }
    }});

    /* --- TEXT DECORATION --- */
    exact('underline', 'textDecoration', 'underline');
    exact('overline', 'textDecoration', 'overline');
    exact('line-through', 'textDecoration', 'line-through');
    exact('no-underline', 'textDecoration', 'none');

    /* --- TEXT TRANSFORM --- */
    exact('uppercase', 'textTransform', 'uppercase');
    exact('lowercase', 'textTransform', 'lowercase');
    exact('capitalize', 'textTransform', 'capitalize');
    exact('normal-case', 'textTransform', 'none');

    /* --- WHITESPACE --- */
    exact('whitespace-normal', 'whiteSpace', 'normal');
    exact('whitespace-nowrap', 'whiteSpace', 'nowrap');
    exact('whitespace-pre', 'whiteSpace', 'pre');
    exact('whitespace-pre-line', 'whiteSpace', 'pre-line');
    exact('whitespace-pre-wrap', 'whiteSpace', 'pre-wrap');
    exact('truncate', 'overflow', 'hidden');

    /* --- LINE HEIGHT --- */
    rules.push({ prefix: 'leading-', apply: (s, v) => { s.lineHeight = LINE_HEIGHTS[v] || v; } });

    /* --- LETTER SPACING --- */
    rules.push({ prefix: 'tracking-', apply: (s, v) => { s.letterSpacing = LETTER_SPACINGS[v] || v; } });

    /* --- BORDER RADIUS --- */
    rules.push({ prefix: 'rounded-', apply: (s, v) => { s.borderRadius = RADII[v] || spacingValue(v); } });
    exact('rounded', 'borderRadius', '4px');

    /* --- BORDER WIDTH --- */
    rules.push({ prefix: 'border-', apply: (s, v) => {
      if (BORDER_WIDTHS[v] !== undefined) { s.borderWidth = BORDER_WIDTHS[v]; s.borderStyle = 'solid'; }
      else if (['solid', 'dashed', 'dotted', 'double', 'none'].includes(v)) { s.borderStyle = v; }
      else if (['t', 'r', 'b', 'l'].includes(v)) { /* skip directional without value */ }
      else { s.borderColor = resolveColor(v); }
    }});
    exact('border', 'borderWidth', '1px');

    /* --- OPACITY --- */
    rules.push({ prefix: 'opacity-', apply: (s, v) => { s.opacity = OPACITIES[v] || (parseInt(v) / 100).toString(); } });

    /* --- Z-INDEX --- */
    rules.push({ prefix: 'z-', apply: (s, v) => { s.zIndex = Z_INDICES[v] || v; } });

    /* --- CURSOR --- */
    exact('cursor-pointer', 'cursor', 'pointer');
    exact('cursor-default', 'cursor', 'default');
    exact('cursor-wait', 'cursor', 'wait');
    exact('cursor-text', 'cursor', 'text');
    exact('cursor-move', 'cursor', 'move');
    exact('cursor-not-allowed', 'cursor', 'not-allowed');
    exact('pointer-events-none', 'pointerEvents', 'none');
    exact('pointer-events-auto', 'pointerEvents', 'auto');

    /* --- BOX SHADOW --- */
    exact('shadow-sm', 'boxShadow', '0 1px 2px 0 rgba(0,0,0,0.05)');
    exact('shadow', 'boxShadow', '0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px -1px rgba(0,0,0,0.1)');
    exact('shadow-md', 'boxShadow', '0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1)');
    exact('shadow-lg', 'boxShadow', '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1)');
    exact('shadow-xl', 'boxShadow', '0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1)');
    exact('shadow-2xl', 'boxShadow', '0 25px 50px -12px rgba(0,0,0,0.25)');
    exact('shadow-none', 'boxShadow', 'none');

    /* --- TRANSITION --- */
    exact('transition', 'transition', 'all 150ms cubic-bezier(0.4,0,0.2,1)');
    exact('transition-none', 'transition', 'none');
    rules.push({ prefix: 'duration-', apply: (s, v) => { s.transitionDuration = v + 'ms'; } });
    rules.push({ prefix: 'delay-', apply: (s, v) => { s.transitionDelay = v + 'ms'; } });

    /* --- OBJECT FIT --- */
    exact('object-contain', 'objectFit', 'contain');
    exact('object-cover', 'objectFit', 'cover');
    exact('object-fill', 'objectFit', 'fill');
    exact('object-none', 'objectFit', 'none');

    /* --- LIST STYLE --- */
    exact('list-none', 'listStyle', 'none');
    exact('list-disc', 'listStyleType', 'disc');
    exact('list-decimal', 'listStyleType', 'decimal');
    exact('list-inside', 'listStylePosition', 'inside');
    exact('list-outside', 'listStylePosition', 'outside');

    /* --- GRID --- */
    rules.push({ prefix: 'grid-cols-', apply: (s, v) => { s.gridTemplateColumns = 'repeat(' + v + ', minmax(0, 1fr))'; } });
    rules.push({ prefix: 'grid-rows-', apply: (s, v) => { s.gridTemplateRows = 'repeat(' + v + ', minmax(0, 1fr))'; } });
    rules.push({ prefix: 'col-span-', apply: (s, v) => { s.gridColumn = 'span ' + v + ' / span ' + v; } });
    rules.push({ prefix: 'row-span-', apply: (s, v) => { s.gridRow = 'span ' + v + ' / span ' + v; } });

    /* --- ORDER --- */
    rules.push({ prefix: 'order-', apply: (s, v) => { s.order = v; } });

    /* --- ASPECT RATIO --- */
    exact('aspect-auto', 'aspectRatio', 'auto');
    exact('aspect-square', 'aspectRatio', '1 / 1');
    exact('aspect-video', 'aspectRatio', '16 / 9');

    /* --- BOX SIZING --- */
    exact('box-border', 'boxSizing', 'border-box');
    exact('box-content', 'boxSizing', 'content-box');

    /* --- FLOAT / CLEAR --- */
    exact('float-right', 'float', 'right');
    exact('float-left', 'float', 'left');
    exact('float-none', 'float', 'none');
    exact('clear-left', 'clear', 'left');
    exact('clear-right', 'clear', 'right');
    exact('clear-both', 'clear', 'both');

    /* --- WORD / TEXT BREAK --- */
    exact('break-normal', 'wordBreak', 'normal');
    exact('break-words', 'overflowWrap', 'break-word');
    exact('break-all', 'wordBreak', 'break-all');

    /* --- SELECT --- */
    exact('select-none', 'userSelect', 'none');
    exact('select-text', 'userSelect', 'text');
    exact('select-all', 'userSelect', 'all');
    exact('select-auto', 'userSelect', 'auto');

    /* --- RESIZE --- */
    exact('resize-none', 'resize', 'none');
    exact('resize', 'resize', 'both');
    exact('resize-x', 'resize', 'horizontal');
    exact('resize-y', 'resize', 'vertical');

    return rules;
  }

  const RULES = buildRules();

  /* ── class parser ───────────────────────────────────────────── */
  function parseClass(cls) {
    /* try exact matches first */
    for (const rule of RULES) {
      if (rule.pattern && rule.pattern === cls) return rule;
    }
    /* then prefix matches — longest prefix wins */
    let best = null;
    for (const rule of RULES) {
      if (rule.prefix && cls.startsWith(rule.prefix)) {
        if (!best || rule.prefix.length > best.prefix.length) best = rule;
      }
    }
    return best;
  }

  /* ── main engine ────────────────────────────────────────────── */
  function processElement(el) {
    const classes = Array.from(el.classList);
    const chaiClasses = classes.filter(c => c.startsWith('chai-'));
    if (!chaiClasses.length) return;

    chaiClasses.forEach(fullClass => {
      const utilName = fullClass.slice(5); // strip "chai-"
      const rule = parseClass(utilName);
      if (rule) {
        if (rule.pattern) {
          rule.apply(el.style);
        } else if (rule.prefix) {
          const value = utilName.slice(rule.prefix.length);
          rule.apply(el.style, value);
        }
      }
      el.classList.remove(fullClass);
    });
  }

  function processAll(root) {
    root = root || document;
    const all = root.querySelectorAll('*');
    all.forEach(processElement);
    processElement(root.body || root);
  }

  /* ── observer for dynamic content ──────────────────────────── */
  function observe() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            processElement(node);
            node.querySelectorAll && node.querySelectorAll('*').forEach(processElement);
          }
        });
        if (m.type === 'attributes' && m.attributeName === 'class') {
          processElement(m.target);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  /* ── public API ─────────────────────────────────────────────── */
  window.ChaiCSS = {
    process: processAll,
    processElement: processElement,
    version: '1.0.0',
    colors: COLORS,
    spacingValue: spacingValue,
  };

  /* ── auto-init ──────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { processAll(); observe(); });
  } else {
    processAll();
    observe();
  }
})();
