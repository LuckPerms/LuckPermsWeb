<template>
  <span
    class="icon"
    :class="[
      fixedWidth && 'icon-fw',
      spin && 'icon-spin',
      rotation && `icon-rotate-${rotation}`,
    ]"
    v-html="svg"
  />
</template>

<script setup>
import { computed } from 'vue';

import arrowLeft from '@gravity-ui/icons/svgs/arrow-left.svg?raw';
import arrowRightToSquare from '@gravity-ui/icons/svgs/arrow-right-to-square.svg?raw';
import arrowRotateLeft from '@gravity-ui/icons/svgs/arrow-rotate-left.svg?raw';
import arrowRotateRight from '@gravity-ui/icons/svgs/arrow-rotate-right.svg?raw';
import bars from '@gravity-ui/icons/svgs/bars.svg?raw';
import book from '@gravity-ui/icons/svgs/book.svg?raw';
import check from '@gravity-ui/icons/svgs/check.svg?raw';
import chevronRight from '@gravity-ui/icons/svgs/chevron-right.svg?raw';
import circleArrowDown from '@gravity-ui/icons/svgs/circle-arrow-down.svg?raw';
import circleArrowRight from '@gravity-ui/icons/svgs/circle-arrow-right.svg?raw';
import circleChevronDown from '@gravity-ui/icons/svgs/circle-chevron-down.svg?raw';
import circleExclamation from '@gravity-ui/icons/svgs/circle-exclamation.svg?raw';
import circlePlus from '@gravity-ui/icons/svgs/circle-plus.svg?raw';
import circleQuestion from '@gravity-ui/icons/svgs/circle-question.svg?raw';
import circleXmark from '@gravity-ui/icons/svgs/circle-xmark.svg?raw';
import codeFork from '@gravity-ui/icons/svgs/code-fork.svg?raw';
import comment from '@gravity-ui/icons/svgs/comment.svg?raw';
import copy from '@gravity-ui/icons/svgs/copy.svg?raw';
import floppyDisk from '@gravity-ui/icons/svgs/floppy-disk.svg?raw';
import folderTree from '@gravity-ui/icons/svgs/folder-tree.svg?raw';
import globe from '@gravity-ui/icons/svgs/globe.svg?raw';
import heart from '@gravity-ui/icons/svgs/heart.svg?raw';
import house from '@gravity-ui/icons/svgs/house.svg?raw';
import logoGithub from '@gravity-ui/icons/svgs/logo-github.svg?raw';
import magnifier from '@gravity-ui/icons/svgs/magnifier.svg?raw';
import minus from '@gravity-ui/icons/svgs/minus.svg?raw';
import pencil from '@gravity-ui/icons/svgs/pencil.svg?raw';
import plus from '@gravity-ui/icons/svgs/plus.svg?raw';
import server from '@gravity-ui/icons/svgs/server.svg?raw';
import squareMinus from '@gravity-ui/icons/svgs/square-minus.svg?raw';
import squarePlus from '@gravity-ui/icons/svgs/square-plus.svg?raw';
import wrench from '@gravity-ui/icons/svgs/wrench.svg?raw';
import xmark from '@gravity-ui/icons/svgs/xmark.svg?raw';

const asteriskSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M478.21 334.093L336 256l142.21-78.093c11.795-6.477 15.961-21.384 9.232-33.037l-19.48-33.741c-6.728-11.653-21.72-15.499-33.227-8.523L296 186.718l3.475-162.204C299.763 11.061 288.937 0 275.48 0h-38.96c-13.456 0-24.283 11.061-23.994 24.514L216 186.718 77.265 102.607c-11.506-6.976-26.499-3.13-33.227 8.523l-19.48 33.741c-6.728 11.653-2.562 26.56 9.233 33.037L176 256 33.79 334.093c-11.795 6.477-15.961 21.384-9.232 33.037l19.48 33.741c6.728 11.653 21.721 15.499 33.227 8.523L216 325.282l-3.475 162.204C212.237 500.939 223.064 512 236.52 512h38.961c13.456 0 24.283-11.061 23.995-24.514L296 325.282l138.735 84.111c11.506 6.976 26.499 3.13 33.227-8.523l19.48-33.741c6.728-11.653 2.563-26.559-9.232-33.036z"/></svg>';

const networkSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor"><path d="M640 264v-16c0-8.84-7.16-16-16-16H344v-40h72c17.67 0 32-14.33 32-32V32c0-17.67-14.33-32-32-32H224c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h72v40H16c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16h104v40H64c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32h-56v-40h304v40h-56c-17.67 0-32 14.33-32 32v128c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V352c0-17.67-14.33-32-32-32h-56v-40h104c8.84 0 16-7.16 16-16zM256 128V64h128v64H256zm-64 320H96v-64h96v64zm352 0h-96v-64h96v64z"/></svg>';

const discordSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor"><path d="M524.531 69.836a1.5 1.5 0 0 0-.764-.7A485.065 485.065 0 0 0 404.081 32.03a1.816 1.816 0 0 0-1.923.91 337.461 337.461 0 0 0-14.9 30.6 447.848 447.848 0 0 0-134.426 0 309.541 309.541 0 0 0-15.135-30.6 1.89 1.89 0 0 0-1.924-.91A483.689 483.689 0 0 0 116.085 69.137a1.712 1.712 0 0 0-.788.676C39.068 183.651 18.186 294.69 28.43 404.354a2.016 2.016 0 0 0 .765 1.375A487.666 487.666 0 0 0 176.02 479.918a1.9 1.9 0 0 0 2.063-.676 348.2 348.2 0 0 0 30.037-48.842 1.86 1.86 0 0 0-1.019-2.588 321.173 321.173 0 0 1-45.868-21.853 1.885 1.885 0 0 1-.185-3.126c3.082-2.309 6.166-4.711 9.109-7.137a1.819 1.819 0 0 1 1.9-.256c96.229 43.917 200.41 43.917 295.5 0a1.812 1.812 0 0 1 1.924.233c2.944 2.426 6.027 4.851 9.132 7.16a1.884 1.884 0 0 1-.162 3.126 301.407 301.407 0 0 1-45.89 21.83 1.875 1.875 0 0 0-1 2.611 391.055 391.055 0 0 0 30.014 48.815 1.864 1.864 0 0 0 2.063.7A486.048 486.048 0 0 0 610.7 405.729a1.882 1.882 0 0 0 .765-1.352C623.729 277.594 590.933 167.465 524.531 69.836zM222.491 337.58c-28.972 0-52.844-26.587-52.844-59.239S193.056 219.1 222.491 219.1c29.665 0 53.306 26.82 52.843 59.239C275.334 310.993 251.924 337.58 222.491 337.58zm195.38 0c-28.971 0-52.843-26.587-52.843-59.239S388.437 219.1 417.871 219.1c29.667 0 53.307 26.82 52.844 59.239C470.715 310.993 447.538 337.58 417.871 337.58z"/></svg>';

const icons = {
  'save': floppyDisk,
  'undo': arrowRotateLeft,
  'redo': arrowRotateRight,
  'sync-alt': arrowRotateRight,
  'exclamation-circle': circleExclamation,
  'plus-circle': circlePlus,
  'times': xmark,
  'times-circle': circleXmark,
  'chevron-circle-down': circleChevronDown,
  'plus': plus,
  'book': book,
  'arrow-alt-circle-down': circleArrowDown,
  'arrow-left': arrowLeft,
  'caret-right': chevronRight,
  'edit': pencil,
  'check': check,
  'home': house,
  'comment-alt': comment,
  'tools': wrench,
  'language': globe,
  'minus': minus,
  'sitemap': folderTree,
  'plus-square': squarePlus,
  'minus-square': squareMinus,
  'question-circle': circleQuestion,
  'bars': bars,
  'code-branch': codeFork,
  'clone': copy,
  'sign-in-alt': arrowRightToSquare,
  'search': magnifier,
  'server': server,
  'heart': heart,
  'arrow-circle-right': circleArrowRight,
  'github': logoGithub,
  'discord': discordSvg,
  'network-wired': networkSvg,
  'asterisk': asteriskSvg,
};

const props = defineProps({
  icon: {
    type: [String, Array],
    default: null,
  },
  spin: {
    type: Boolean,
    default: false,
  },
  rotation: {
    type: [Number, String],
    default: null,
  },
  fixedWidth: {
    type: Boolean,
    default: false,
  },
});

const svg = computed(() => {
  const name = Array.isArray(props.icon) ? props.icon[1] : props.icon;
  return icons[name] || '';
});
</script>

<style>
  .icon {
    display: inline-block;
    vertical-align: -0.125em;
    line-height: 1;
  }

  .icon svg {
    display: block;
    width: 1em;
    height: 1em;
  }

  .icon-fw {
    width: 1.25em;
    text-align: center;
  }

  @keyframes icon-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .icon-spin svg {
    animation: icon-spin 2s linear infinite;
  }

  .icon-rotate-90 svg {
    transform: rotate(90deg);
  }

  .icon-rotate-180 svg {
    transform: rotate(180deg);
  }

  .icon-rotate-270 svg {
    transform: rotate(270deg);
  }

  .fa-layers {
    display: inline-block;
    height: 1em;
    position: relative;
    vertical-align: -0.125em;
    width: 1em;
  }

  .fa-layers .icon {
    position: absolute;
    inset: 0;
  }
</style>
