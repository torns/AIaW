<template>
  <q-layout view="lHr LpR lFf">
    <q-drawer
      v-model="uiStore.mainDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="1200"
      bg-sur-c
      flex
      flex-col
    >
      <div
        text-xl
        px-4
        pt-4
      >
        <svg
          fill-on-sur-var
          h="24px"
          viewBox="0 0 636 86"
        >
          <use
            xlink:href="/banner.svg#default"
          />
        </svg>
      </div>
      <q-separator spaced />
      <div
        px-4
        py-2
        text-sec
      >
        工作区
      </div>
      <workspace-nav mt-2 />
      <q-list
        mt-a
        mb-2
      >
        <q-item
          clickable
          to="/assistants"
          active-class="route-active"
          item-rd
        >
          <q-item-section avatar>
            <q-icon name="sym_o_robot_2" />
          </q-item-section>
          <q-item-section>
            助手
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/plugins"
          active-class="route-active"
          item-rd
        >
          <q-item-section avatar>
            <q-icon name="sym_o_extension" />
          </q-item-section>
          <q-item-section>
            插件
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/settings"
          active-class="route-active"
          item-rd
        >
          <q-item-section avatar>
            <q-icon name="sym_o_settings" />
          </q-item-section>
          <q-item-section>
            设置
          </q-item-section>
        </q-item>
        <q-separator spaced />
        <div
          px-2
          flex
          text-on-sur-var
        >
          <account-btn
            flat
          />
          <q-space />
          <dark-switch-btn />
          <q-btn
            flat
            dense
            round
            icon="sym_o_more_vert"
          >
            <q-menu>
              <q-list>
                <menu-item
                  icon="sym_o_book_2"
                  label="使用指南"
                  href="https://docs.aiaw.app/usage/"
                  target="_blank"
                />
                <q-item
                  clickable
                  v-close-popup
                  min-h-0
                  href="https://github.com/NitroRCr/AIaW"
                  target="_blank"
                >
                  <q-item-section
                    avatar
                    min-w-0
                  >
                    <q-avatar
                      icon="svguse:/svg/github.svg#icon"
                      size="20px"
                      font-size="20px"
                    />
                  </q-item-section>
                  <q-item-section>GitHub</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-list>
    </q-drawer>
    <router-view />
  </q-layout>
</template>

<script setup>
import { until } from '@vueuse/core'
import WorkspaceNav from 'src/components/WorkspaceNav.vue'
import { useUserDataStore } from 'src/stores/user-data'
import { useUiStateStore } from 'src/stores/ui-state'
import { useWorkspacesStore } from 'src/stores/workspaces'
import { useRoute, useRouter } from 'vue-router'
import AccountBtn from 'src/components/AccountBtn.vue'
import DarkSwitchBtn from 'src/components/DarkSwitchBtn.vue'
import MenuItem from 'src/components/MenuItem.vue'

defineOptions({
  name: 'MainLayout'
})

const uiStore = useUiStateStore()
const workspacesStore = useWorkspacesStore()
const userDataStore = useUserDataStore()
const route = useRoute()
const router = useRouter()

async function openLastWorkspace() {
  await until(() => userDataStore.ready).toBeTruthy()
  const wsId = userDataStore.data.lastWorkspaceId
  const dialogId = workspacesStore.workspaces.find(item => item.id === wsId)?.lastDialogId
  if (route.path === '/' && wsId) {
    router.push(dialogId ? `/workspaces/${wsId}/dialogs/${dialogId}` : `/workspaces/${wsId}`)
  }
}
openLastWorkspace()
</script>
