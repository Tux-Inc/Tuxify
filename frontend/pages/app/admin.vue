<script setup lang="ts">
import {definePageMeta} from "#imports";

definePageMeta({
  layout: 'app-navigation',
})

const usersColumns = [
  {
    label: 'Name',
    key: 'name',
    sortable: true
  },
  {
    label: 'Title',
    key: 'title',
    sortable: true
  },
  {
    label: 'Email',
    key: 'email',
    sortable: true
  },
  {
    label: 'Role',
    key: 'role',
    sortable: true
  },
  {
    key: 'actions',
    sortable: false
  }
]

type User = {
  id: number
  name: string
  title: string
  email: string
  role: string
}

const users: User[] = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member'
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin'
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member'
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin'
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}]

const userContextualActions = (row: User) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }, {
    label: 'Disable',
    icon: 'i-heroicons-x-circle-solid',
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid'
  }]
]

const selectedUser = ref<User[]>([])
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
    <h1 class="text-4xl font-bold text-dark dark:text-light">Panneau d'administration</h1>
  </div>
  <div class="flex flex-col gap-4">
    <UCard>
      <template #header>
        <div class="flex flex-row items-center justify-start gap-2">
          <UIcon name="i-heroicons-user-group" class="text-sm text-primary font-bold text-dark dark:text-light" />
          <h1 class="text-sm text-primary font-bold text-dark dark:text-light">Gestion des utilisateurs</h1>
        </div>
      </template>
      <UTable v-model="selectedUser" :rows="users" :columns="usersColumns">
        <template #name-data="{ row }">
          <span :class="[selectedUser.find(user => user.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{ row.name }}</span>
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="userContextualActions(row)">
            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>
    <UCard>
      <template #header>
        <div class="flex flex-row items-center justify-start gap-2">
          <UIcon name="i-heroicons-cog-8-tooth" class="text-sm text-primary font-bold text-dark dark:text-light" />
          <h1 class="text-sm text-primary font-bold text-dark dark:text-light">Paramètres généraux du site</h1>
        </div>
      </template>
    </UCard>
  </div>
</template>