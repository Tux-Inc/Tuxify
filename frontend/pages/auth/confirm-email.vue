<template>
  <div class="h-screen w-full flex flex-col gap-4 items-center justify-center">
    <NuxtLink to="/" class="mt-20">
      <img
          src="../../public/logo-full@1:1.svg"
          alt="Description de l'image"
          class="w-32 32"
      />
    </NuxtLink>
    <UCard class="w-full sm:w-1/2 md:w-1/3">
      <h1 class="text-2xl font-semibold text-center">{{ i18n.t('Verify your e-mail address') }}</h1>
      <p class="text-gray-600">{{ i18n.t('A verification code has been sent to your email address. Please enter the 6-digit code you received to activate your account.') }}</p>

      <input
          type="text"
          v-model="code"
          @input="checkCodeFormat"
          maxlength="6"
          pattern="[0-9]{6}"
          placeholder="Code à 6 chiffres"
          required
          class="w-full mt-4 p-2 border border-gray-300 rounded"
      />

      <UButton
          :label="i18n.t('Confirm')"
          block
          size="lg"
          to="/"
          color="primary"
          variant="solid"
          class="mt-4"
      />
    </UCard>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const i18n = useI18n();


let code = '';


function checkCodeFormat() {
  code = code.replace(/[^0-9]/g, '');
}
</script>
