<template>
  <div class="node mb-1 focus:outline focus:outline-brand focus:outline-1">
    <div class="main px-4 py-1 flex cursor-pointer hover:bg-white/10" @click="open = !open">
      <span class="name flex items-center min-w-[10rem] mr-4 [&_img]:w-4 [&_img]:mr-2">
        <avatar
          v-if="source.who.uuid && source.who.uuid !== '00000000-0000-0000-0000-000000000000'"
          :id="source.who.uuid"
          :name="source.who.identifier"
          :title="false"
        />
        {{ source.who.identifier }}
      </span>
      <span class="permission flex-1">
        <code>{{ source.permission || `meta: ${source.key}` }}</code>
      </span>
      <span class="value" :class="source.result">
        <code :class="source.result">{{ source.result }}</code>
        <font-awesome :icon="valueIcon" fixed-width />
      </span>
    </div>
    <transition name="slide">
      <div class="stack bg-black/20 px-4 py-2 flex gap-4 whitespace-normal" v-if="open">
        <div class="col-1 flex-1 min-w-0 overflow-hidden">
          <table class="w-full table-fixed border-collapse [&_tr+tr_td]:border-t [&_tr+tr_td]:border-white/5 [&_td]:p-1 [&_td]:align-top [&_td]:overflow-hidden [&_td:first-child]:w-[30%] [&_td:first-child]:opacity-70 [&_td:first-child]:whitespace-nowrap [&_td:first-child]:pr-3">
            <tr v-if="source.context.length">
              <td>{{ $t('verbose.context') }}</td>
              <td>
                <code v-for="context in source.context" v-bind:key="context" class="break-all m-0.5">
                  {{ context.key }}: {{ context.value }}
                </code>
              </td>
            </tr>
            <tr>
              <td>{{ $t('verbose.origin') }}</td>
              <td>
                <code>{{ source.origin }}</code>
              </td>
            </tr>
            <tr v-if="source.resultInfo">
              <td>{{ $t('verbose.processor') }}</td>
              <td>
                <code>{{ source.resultInfo.processorClass.split('.').at(-1) }}</code>
              </td>
            </tr>
            <tr v-if="source.resultInfo && source.resultInfo.node">
              <td>{{ $t('verbose.cause') }}</td>
              <td>
                <pre class="code w-full overflow-x-auto whitespace-pre break-normal my-0.5">{{ JSON.stringify(source.resultInfo.node, null, 2) }}</pre>
              </td>
            </tr>
            <tr>
              <td>{{ $t('verbose.thread') }}</td>
              <td>
                <code>{{ source.thread }}</code>
              </td>
            </tr>
          </table>
        </div>
        <div class="col-2 flex flex-col flex-[2] min-w-0">
          <span class="opacity-70 pb-1">{{ $t('verbose.trace') }}</span>
          <pre class="code w-full overflow-x-auto whitespace-pre break-normal my-0.5 max-h-[32rem]">{{ source.trace.join("\n") }}</pre>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Avatar from '../Avatar.vue';

export default {
  components: {
    Avatar,
  },
  props: {
    source: Object,
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    valueIcon() {
      switch (this.source.result) {
        case 'true':
          return 'check';
        case 'false':
          return 'times';
        default:
          return 'minus';
      }
    },
  },
};
</script>
