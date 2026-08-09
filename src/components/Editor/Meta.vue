<template>
<div class="editor-meta bg-white/10 px-4 pb-4">
  <div class="meta-weight flex-1" v-if="sessionData.type === 'group'">
    <strong>{{ $t('editor.meta.weight') }}</strong>
    <code>{{ groupWeight }}</code>
  </div>
  <div class="meta-parents flex-1">
    <div class="add-group relative">
      <strong>{{ $t('editor.meta.parents') }}</strong>
      <button
        class="cursor-pointer bg-brand border-0 rounded-sm text-base font-bold px-2 ml-2"
        @click="addingGroup = true"
        :title="$t('editor.meta.add', { id: session.id })"
      >
        +
      </button>
      <ul v-if="addingGroup" v-click-outside="closeGroups" class="list-none m-0 p-0 flex flex-col absolute top-full bg-grey max-h-[40vh] overflow-y-auto z-[100] shadow-[0_0.2rem_1rem_rgba(0,0,0,0.2)]">
        <li
          class="px-4 py-1 m-0 font-mono text-[0.8rem] cursor-pointer hover:bg-white/5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-black/20"
          v-for="group in groups"
          @click="addParentToGroup(group.id)"
          :key="`addParent_${group.id}`"
        >
          {{ group.id }}
        </li>
      </ul>
    </div>
    <ul class="list-none m-0 p-0 flex">
      <li v-for="parent in parents" :key="`groupParent_${parent}`" class="mr-2">
        <code
          class="cursor-pointer [&_span]:text-white [&_span]:opacity-10 [&_span]:hover:opacity-50"
          @click="handleParentSessionSwitch(parent)"
          :title="$t('editor.meta.gotoParent', { parent })"
        >
          {{ parent }}
          <span
            @click.stop="deleteParent(parent)"
            :title="$t('editor.meta.removeParent', { parent })"
          >
            <font-awesome icon="times" />
          </span>
        </code>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import vClickOutside from 'v-click-outside';

export default {
  name: 'Meta',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    session: Object,
    sessionData: Object,
  },

  data() {
    return {
      addingGroup: false,
    };
  },

  computed: {
    groupWeight() {
      const { weight } = this.sessionData;

      if (weight.length === 0) {
        return 'N/A';
      } if (weight.length === 1) {
        return weight[0].key.split('.').pop();
      }
      return 'Multiple';
    },
    groups() {
      return this.$store.getters.sessionSet.filter(session => session.type === 'group').filter(group => !this.parents.includes(group.id));
    },
    parents() {
      return this.sessionData.parents
        .filter(parent => parent.value)
        .map(parent => parent.key.split('.').pop());
    },
  },

  methods: {
    handleParentSessionSwitch(parent) {
      this.$store.commit('setCurrentSession', parent);
    },
    addParentToGroup(parentId) {
      const node = {
        sessionId: this.session.id,
        type: 'permission',
        key: `group.${parentId}`,
        value: true,
        isNew: true,
      };

      this.$store.dispatch('addNodes', [node]);
      this.addingGroup = false;
    },
    closeGroups() {
      this.addingGroup = false;
    },
    deleteParent(parentId) {
      const node = this.sessionData.parents.find(parent => parent.key === `group.${parentId}`);
      this.$store.commit('deleteNode', node.id);
    },
  },
};
</script>
