<script setup lang="ts">

import { IServiceDisplay } from "~/types/IServiceDisplay";

definePageMeta({
    layout: "app-navigation",
});

const services: IServiceDisplay[] = [
    {
        "image": "../landing/integration_icons/github.svg",
        "name": "github",
        "title": "GitHub",
        "description": "GitHub is a development platform inspired by the way you work. You can host and review code, manage projects used by over50 million developers.",
        "isConnected": false,
    },
    {
        "image": "../landing/integration_icons/gmail.svg",
        "name": "gmail",
        "title": "Gmail",
        "description": "Gmail is email that's intuitive, efficient, and useful. 15 GB of storage, less spam, and mobile access.",
        "isConnected": true,
    },
    {
        "image": "../landing/integration_icons/google-calendar.svg",
        "name": "google",
        "title": "Google",
        "description": "Bonjour",
        "isConnected": false,
    },
    {
        "image": "../landing/integration_icons/linear.svg",
        "name": "linear",
        "title": "Linear",
        "description": "Linear helps streamline software projects, sprints, tasks, and bug tracking. It's built for high-performance teams.",
        "isConnected": false,
    },
    {
        "image": "../landing/integration_icons/slack.svg",
        "name": "slack",
        "title": "Slack",
        "description": "Slack is a new way to communicate with your team. It's faster, better organized, and more secure than email.",
        "isConnected": false,
    },
    {
        "image": "../landing/integration_icons/linkedin.svg",
        "name": "linkedin",
        "title": "LinkedIn",
        "description": "LinkedIn is professional networking platform connecting individuals, fostering career development, and facilitating business connections for professionals worldwide.",
        "isConnected": false,
    },
];

</script>

<template>
    <div class="flex flex-wrap gap-x-6 gap-y-10 justify-center max text-center">
        <h1 class="text-4xl font-bold text-dark dark:text-light hidden sm:block">Services</h1>
        <div class="container mx-auto my-auto grid md:grid-cols-3 sm:grid-cols-1 gap-8">
            <ServiceDisplay
                v-for="(service) in services"
                :image="service.image"
                :name="service.name"
                :title="service.title"
                :description="service.description"
                :isConnected="service.isConnected"
            />
        </div>
    </div>
</template>

<style scoped>

</style>
