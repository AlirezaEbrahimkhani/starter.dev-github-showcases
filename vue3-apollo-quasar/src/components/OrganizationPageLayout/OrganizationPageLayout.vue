<template>
  <div>
    <div class="wrapper">
      <div class="row items-center">
        <span class="company_logo">
          <img
            src="https://avatars.githubusercontent.com/u/22839396?s=64&amp;v=4"
            alt="company logo"
            style="width: 42px; height: 42px"
          />
        </span>
        &nbsp; &nbsp; &nbsp;
        <h3 class="">Company Name</h3>
      </div>
      <TabHeader
        :repositories="true"
        @triggerTab="changeTab"
        classNames="org_tab"
      />
    </div>
    <div class="wrapper">
      <!-- Right side -->
      <div class="tab-contents">
        <SearchFilter repoBtnText="New repository" />

        <q-tab-panels v-model="tab">
          <q-tab-panel name="overview">
            <slot name="overview">
              <div class="text-h6">Overview</div>
            </slot>
          </q-tab-panel>

          <q-tab-panel name="repositories">
            <slot name="repositories">
              <div class="text-h6">Repositories</div>
            </slot>
          </q-tab-panel>

          <q-tab-panel name="projects">
            <slot name="projects">
              <div class="text-h6">Projects</div>
            </slot>
          </q-tab-panel>

          <q-tab-panel name="packages">
            <slot name="packages">
              <div class="text-h6">Packages</div>
            </slot>
          </q-tab-panel>

          <q-tab-panel name="stars">
            <slot name="stars">
              <div class="text-h6">Stars</div>
            </slot>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { SearchFilter, TabHeader } from '..';

export default defineComponent({
  name: 'ProfilePageLayout',
  components: {
    TabHeader,
    SearchFilter,
  },
  setup() {
    const tab = ref('');
    function changeTab(val) {
      tab.value = val;
    }
    return {
      tab,
      changeTab,
    };
  },
});
</script>

<style lang="scss">
@import '../../App.css';
.tab-contents {
  flex-grow: 1;
}

.company_logo {
  border: 1px solid var(--color-border-muted);
  border-radius: 6px;
}

.org_tab {
  & .q-tabs__content--align-center {
    justify-content: start !important;
  }
}

.usercard {
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
}
</style>
