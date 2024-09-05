<template>
    <div class="p-3 z-50 select-none cursor-pointer text-xl bottom-5 right-5 bg-gradient-to-tr hover:backdrop-brightness-0 from-[#24c7ce] to-[#1ed794] flex justify-center items-center rounded-full"
        @click="showModal = true">
        Post
    </div>

    <transition name="fade" @leave="leave">

        <div v-if="showModal"
            class="h-full backdrop-blur w-full fixed top-0 left-0 flex justify-center md:pt-36 items-end md:items-start pb-2"
            :class="{
                'fadeIn': showModal,
            }">
            <div class="w-full flex justify-center h-fit" :class="{
                'animation': showModal,
                'fadeOut': !showModal
            }">

                <div class="bg-gray-900 md:w-4/5 w-full md:mx-0 mx-2 shadow-xl p-3 rounded-xl">
                    <div class="flex">
                        <h1 class="w-full">Make Post</h1>
                        <div @click="showModal = false" class="flex cursor-pointer justify-end text-xl mr-1">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    <div class="bg-gray-800 mt-2 p-2 rounded-xl">
                        <textarea class="w-full h-40 bg-gray-800 text-white pt-0 mt-2 resize-none focus:outline-none"
                            v-model="postContent" placeholder="What are you thinking about?"></textarea>
                        <div class="flex cursor-pointer items-center w-12 h-12 justify-center bg-gray-700 rounded-xl"
                            @click="selectFile">
                            <i class="fa-solid fa-image text-2xl overflow-visible"></i>
                        </div>
                        <div class="flex gap-4 mt-2">
                            <template v-for="(image, index) in images">
                                <div class="flex bg-gray-700 p-2 rounded-xl">
                                    <div @click="images.splice(index, 1)"
                                        class="absolute cursor-pointer ml-[4rem] -mt-4 bg-gray-700 w-8 h-8 flex justify-center items-center rounded-full p-2">
                                        <i class="fa-solid fa-xmark"></i>
                                    </div>
                                    <img :src="getPreviewImage(image)" class="w-20 h-20 object-cover rounded-lg" />
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="flex md:flex-nowrap flex-wrap justify-end mt-2 gap-2">
                        <button @click="showModal = false"
                            class="bg-gray-700 p-2 md:w-2/3 w-full rounded-xl">Close</button>
                        <button @click="uploadPost"
                            class="bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] p-2 md:w-1/3 w-full rounded-xl">Post</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

const router = useRouter();

const showModal = ref(false);

const postContent = ref('');

const images = ref([]);

function getPreviewImage(file) {
    return URL.createObjectURL(file);
}

function selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = (e) => {
        const file = e.target.files[0];
        images.value.push(file);
    };
}

function uploadPost() {
    axios.post("https://api.faser.app/api/social/createPost", {
        token: Cookies.get("token"),
        message: postContent.value,
        lang: "en",
        images: images.value.length
    })
        .then(response => {
            if(images.value.length === 0) {
                router.push("/profile")
            }

            if (images.value.length > 0) {
                for (let i = 0; i < images.value.length; i++) {
                    const formData = new FormData();
                    formData.append('file', images.value[i]);

                    axios.post("https://api.faser.app/api/social/uploadImage", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'token': Cookies.get('token'),
                            'postId': response.data.postId,
                            lang: 'en',
                            imageId: (i + 1)
                        }
                    })
                        .then(response => {
                            if (i === images.value.length - 1) {
                                router.push("/profile")
                            }
                        })
                }
            }
        })
}
</script>

<style scoped>
.animation {
    animation: fadeIn 0.3s;
}

.fadeIn {
    animation: fadeInOpacity 0.3s cubic-bezier(.6, 0, .4, 1);
}

.fade-leave-active {
    animation: fadeOut 0.3s;
}

@keyframes fadeIn {
    from {
        transform: translateY(100svh);
    }

    to {
        transform: translateY(0);
    }
}

@keyframes fadeInOpacity {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>