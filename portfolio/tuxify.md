---
title: Tuxify
description: Bring the revolution of simple and smart action/reaction in a world of complex automation. 
date: 20-11-2023
image: /images/tuxify-hero.png
---

::Hero
---
src: /images/tuxify-hero.png
alt: Tuxify
---
::

# Tuxify
[https://tuxify.fr](https://tuxify.fr)

- [Introduction](#introduction)
- [Architecture](#architecture)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
- [CI/CD](#cicd)
- [References](#references)

## Introduction

Tuxify is a project like IFTTT, the goal is simple provide a simple and smart action/reaction system. Our goal with Tuxify is also to discover how to create an manage production grade, complex and scalable applications. Below you can find a short video of the architecture of Tuxify.

::Youtube
---
ytId: 709_mfcZscE
---
::

## Architecture
Tuxify, being a complex project, requires a clear understanding of its architecture. This section will explain the different parts of the project.

### Frontend Architecture
#### Components
The Tuxify project is based on a component architecture. It utilizes the VueJS framework, which facilitates the creation of reusable components. This enhances the maintainability and evolution of the project.

#### Server Side Rendering (SSR)
Tuxify employs Server Side Rendering (SSR) architecture. Unlike Client Side Rendering (CSR), SSR generates content on the server side. This improves the website's SEO and the page loading performance.

#### Performance Optimization and SEO
Tuxify places a significant emphasis on performance optimization and SEO. The project uses optimization modules like NuxtImage to generate web-optimized images. Additionally, page load optimization modules like NuxtLazyLoad are used to load images only when needed by the user.

### Backend Architecture
#### Microservices
The project's architecture is based on microservices. Contrary to a monolithic architecture, a microservices architecture breaks the project into multiple independent services. Each service is responsible for a part of the project, simplifying maintenance and evolution.
For more information on microservices architecture, refer to Google Cloud's document: [What is microservice architecture ?](https://cloud.google.com/learn/what-is-microservices-architecture) or [Microservices.io](https://microservices.io/)

#### Service Abstraction Concept
To facilitate communication between services, a service abstraction concept has been implemented. This concept operates on the principle that each service is independent and does not necessarily need to know about other services. A communication system based on events has been set up, where each service can publish and subscribe to events. This avoids the need for services to know about each other and manage communication errors.

For more information on service abstraction, refer to TIBCO's document: [Event-Driven Microservices](https://www.tibco.com/reference-center/what-is-event-driven-architecture)

However, some services may still have dependencies on others, like authentication, which helps identify user requests and verify user authentication.

#### Application to Tuxify
For Tuxify, the project has been divided into several microservices. For service communication, the NATS protocol (see NATS.io) is used. This protocol enables asynchronous communication between services, preventing service blocks during communication. NATS also integrates a queuing system to preserve messages if a service is unavailable. Additionally, NATS natively incorporates dual layers of communication - event and data, unlike other protocols like TCP or MQTT that only manage a single communication layer and thus require additional data layer management.

The figure below represents the Tuxify project architecture. Each service is depicted as a rectangle, with arrows indicating communication between services.

![Tuxify Architecture](/images/tuxify-architecture.png)

**Gateway**: This service is the application's entry point, redirecting requests to the relevant services.

**Auth**: This service manages user administration, including creating, modifying, and deleting users. It also handles user sessions and OAuth with various providers.

**Providers**: This service manages providers, including listing, managing access tokens, and handling the actions and reactions of available providers.

**Flow**: Responsible for managing Flows, this service allows users to create, modify, and delete Flows. It also manages Flow execution and subscribes to events from providers as needed.

**External providers (group)**: These services are external to Tuxify and communicate with external providers. Each service is responsible for a specific external provider and includes an OAuth authentication module, an access token management module, and modules for actions and reactions.

## CI/CD

Tuxify uses a CI/CD pipeline to automate the deployment of the project. The pipeline is based on GitHub Actions and is triggered by a push to the main branch. The pipeline is divided into several steps:
- **Build**: This step builds the project's frontend and backend.
- **Test**: This step runs the project's tests.
- **Deploy**: This step deploys the project to the production environment managed by Kubernetes.

## References
- [NATS.io](https://nats.io/)
- [What is microservice architecture ?](https://cloud.google.com/learn/what-is-microservices-architecture)
- [Microservices.io](https://microservices.io/)
- [Event-Driven Microservices](https://www.tibco.com/reference-center/what-is-event-driven-architecture)
- [Tuxify](https://tuxify.fr)