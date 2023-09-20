<template>
  <div class="p-12">
    <div class="flex items-center justify-start gap-4 mb-16">
      <img src="/logo@1:1.svg" alt="logo" class="h-12" />
      <h1 class="text-3xl font-bold">Design system - Components</h1>
    </div>
    <div class="flex flex-col">
        <h2 class="text-2xl font-bold mb-8">Buttons</h2>
        <div class="flex flex-col gap-2">
          <Button type="primary" text="Primary filled button" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="secondary" text="Secondary filled button" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="success" text="Success filled button" icon="bx bx-check-circle" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="warning" text="Warning filled button" icon="bx bx-error-circle" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="danger" text="Danger filled button" icon="bx bx-trash" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="info" text="Info filled button" icon="bx bx-info-circle" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="primary" text="Primary loading button" icon="bx bx-user" :onClick="() => {}" :state="'loading'"></Button>
          <Button type="primary" text="Primary disabled button" icon="bx bx-user" :onClick="() => {}" :state="'disabled'"></Button>
          <Button type="primary" :outlined="true" text="Primary outlined button" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
          <Button type="secondary" :outlined="true" text="Secondary outlined button" icon="bx bx-user" :onClick="() => {}" :state="'idle'"></Button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>