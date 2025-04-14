<template>
    <div
        class="min-h-[calc(100vh-4.5rem)] text-white"
        :style="{ backgroundColor: currentPalette.bg }"
    >
        <div class="mx-5 py-2">
            <h1 class="text-2xl font-bold">faser FAQ</h1>

            <p class="mt-2">
                Welcome to faser FAQ, here you can read more about faser and
                what we are doing.
            </p>

            <div class="mt-6 p-4 bg-gray-800 rounded-md">
                <h2 class="text-xl font-bold">About faser</h2>
                <p class="mt-2">
                    faser is a next-generation social media platform designed to
                    bring people together in a vibrant, interactive space. Our
                    mission is to provide a seamless and engaging experience for
                    users who want to share, connect, and explore new ideas.
                </p>
            </div>

            <div class="p-2 mt-2 bg-gray-800 rounded-md">
                <AccordionBuilder
                    :items="faqItems"
                    type="normal"
                    accordion-id="faser"
                />
            </div>

            <div class="w-full -ml-3" id="advanced">
                <AdvancedComponent
                    :show-modal="true"
                    :faq-page="true"
                    accordion-id="advanced"
                />
            </div>

            <div class="w-full mt-2" id="support">
                <SupportFieldsComponent title="Contact Support" />
            </div>
        </div>
    </div>
</template>

<script setup>
import currentPalette from '~/vars/getColors'

const faqItems = ref([
    {
        title: 'What is faser?',
        content:
            'faser is a social media platform that allows users to connect, share, and engage with each other. It offers a unique space for discussions, sharing media, and staying updated with the latest trends.',
    },
    {
        title: 'Who is the person behind faser?',
        content:
            "Hi, it's me, the person behind faser. My name is Neo, I live in Germany and I'm the one and only person who created faser. @timbo made the logo but I did the rest. From the design to the development, it's all me. I hope you enjoy using faser! When you have any Problems, feel free to contact me using the contact form below.",
    },
    {
        title: 'How do I create an account on faser?',
        content:
            "To create an account, simply visit our website at faser.app, click on the 'Login' button and then go to 'create account'. Follow the on-screen instructions to set up your profile and start using faser.",
    },
    {
        title: 'Is faser free to use?',
        content:
            'Yes, faser offers a free version with all the essential features. However, you can subscribe to faser Advanced for additional features and an ad-free experience.',
    },
    {
        title: 'What is faser Advanced?',
        content:
            'faser Advanced is our premium subscription model that gives users access to additional features, such as enhanced analytics, priority support, and the ability to customize their experience further.',
    },
    {
        title: 'How do I delete my account?',
        content:
            "If you wish to delete your account, go to 'Your Profile' > 'Dangerous Zone' > 'Delete Account'. Please note that this action is irreversible, and all your data will be permanently removed.",
    },
    {
        title: 'How can I contact faser support?',
        content:
            'You can contact faser support by taking a look at the bottom of the page. There you will find a contact form that you can fill out and send to us.',
    },
])
</script>
