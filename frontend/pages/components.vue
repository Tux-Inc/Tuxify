<template>
  <div class="p-12">
    <div class="flex items-center justify-start gap-4 mb-16">
      <img src="/logo@1:1.svg" alt="logo" class="h-12" />
      <h1 class="text-3xl font-bold">Design system - Components</h1>
    </div>
    <div class="flex flex-col">
        <h2 class="text-2xl font-bold mb-8">Buttons</h2>
        <div class="flex flex-col gap-2">
          <Button type="primary" text="Click me" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="secondary" text="Click me" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="tertiary" text="Click me" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="success" text="Click me" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="warning" text="Click me" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="danger" text="Click me" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="info" text="Click me" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="primary" text="Click me" icon="bx bx-user" :onClick="() => {}" :state="'loading'"></Button>
          <Button type="primary" text="Click me" icon="bx bx-user" :onClick="() => {}" :state="'disabled'"></Button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>