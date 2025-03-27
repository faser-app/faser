<template>
    <div v-if="postVisible" class="post-container" :style="{ backgroundColor: currentPalette.bgSecondary }"
        :class="{ 'border-b border-gray-700': border }">

        <!-- Parent post reference -->
        <div class="parent-post-link"
            v-if="postType === 'comment' && !route.fullPath.split('/')[2].includes(parentPost)">
            <div class="reply-connector"></div>
            <RouterLink :to="'/post/' + parentPost" class="parent-link">Go to parent post</RouterLink>
        </div>

        <!-- Post header with author info -->
        <div class="post-header">
            <div class="author-info">
                <!-- Profile picture -->
                <RouterLink :to="'/' + author.username" class="author-avatar">
                    <img v-if="author.hasProfilePicture" @error="author.hasProfilePicture = false"
                        :src="'https://s3.faser.app/profilepictures/' + author.id + '/image.png'" alt="profile picture"
                        :class="{'rounded-full': !author.businessAccount, 'rounded-lg': author.businessAccount}" />
                    <div v-else class="avatar-placeholder"
                        :class="{'rounded-full': !author.businessAccount, 'rounded-md': author.businessAccount}">
                        <i class="fa-solid fa-user text-xl"></i>
                    </div>
                </RouterLink>

                <!-- Author name, verification badge and timestamp -->
                <div class="author-details">
                    <div class="author-name-container">
                        <RouterLink :to="'/' + author.username" class="author-name">{{ author.displayName }}
                        </RouterLink>
                        <div v-if="author.businessAccount" class="verification-badge business">
                            <i class="fa-solid fa-check text-[10px]"></i>
                        </div>
                        <div v-else-if="author.verifiedAccount" class="verification-badge">
                            <i class="fa-solid fa-check text-[10px]"></i>
                        </div>
                    </div>

                    <div class="post-meta">
                        <span class="username">@{{ author.username }}</span>
                        <span class="separator">·</span>
                        <span class="timestamp" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                            {{ postCreatedAt }}
                            <div class="timestamp-tooltip" v-if="showTooltip">
                                {{ localDateTime }}
                            </div>
                        </span>
                        <span class="edited-flag" v-if="postContent.edited">· edited</span>
                        <span class="ai-flag" v-if="postContent.ai">· AI <i class="fa-solid fa-robot"></i></span>
                    </div>
                </div>
            </div>

            <!-- Post options menu -->
            <Menu as="div" class="post-menu">
                <MenuButton class="menu-button">
                    <i class="fa-solid fa-ellipsis"></i>
                </MenuButton>

                <transition enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                    <MenuItems class="menu-items" :style="{ backgroundColor: currentPalette.bgSecondary }">
                        <div class="menu-group">
                            <MenuItem>
                            <div class="menu-action-row">
                                <button class="action-button" @click="sharePost">
                                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                                    <span>Share</span>
                                </button>

                                <button v-if="!props.isCommunity" class="action-button" @click="toggleSave">
                                    <i v-if="!savedPost" class="fa-regular fa-bookmark"></i>
                                    <i v-else class="fa-solid fa-bookmark"></i>
                                    <span>{{ savedPost ? 'Saved' : 'Save' }}</span>
                                </button>
                            </div>
                            </MenuItem>

                            <MenuItem v-slot="{ active }" v-if="isAuthor">
                            <button :class="[active ? 'bg-gray-700' : '', 'menu-item']" @click="openDeleteModal">
                                <i class="fa-solid fa-trash"></i>
                                <span>Delete</span>
                            </button>
                            </MenuItem>

                            <MenuItem v-slot="{ active }" v-if="isAuthor">
                            <button :class="[active ? 'bg-gray-700' : '', 'menu-item']" @click="openEditModal">
                                <i class="fa-solid fa-edit"></i>
                                <span>Edit</span>
                            </button>
                            </MenuItem>

                            <MenuItem v-slot="{ active }">
                            <button :class="[active ? 'bg-gray-700' : '', 'menu-item']" @click="showReport = true">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                <span>Report</span>
                            </button>
                            </MenuItem>
                        </div>
                    </MenuItems>
                </transition>
            </Menu>
        </div>

        <!-- NSFW warning -->
        <div v-if="postContent.nsfw" class="nsfw-tag" @click="toggleNSFW">
            <span>NSFW</span>
            <i class="fa-solid" :class="showPost ? 'fa-eye' : 'fa-eye-slash'"></i>
        </div>

        <!-- Post content -->
        <div v-if="isAdult || !postContent.nsfw" :class="{ 'blur-content': !showPost && postContent.nsfw }">
            <!-- Text content -->
            <div class="post-content" v-html="postValue"></div>

            <!-- Images gallery -->
            <div v-if="postContent.images && postContent.images > 0" class="image-gallery">
                <div class="image-grid" :class="[
                    postContent.images === 1 ? 'single-image' : '',
                    postContent.images === 2 ? 'two-images' : '',
                    postContent.images === 3 ? 'three-images' : '',
                    postContent.images >= 4 ? 'four-plus-images' : ''
                ]">
                    <!-- Show first 4 images directly in the grid -->
                    <div v-for="imageIndex in Math.min(postContent.images, 4)" :key="imageIndex" class="image-container"
                        @click="openImage('https://s3.faser.app/postimages/' + author.id + '/' + postContent.postId + '/' + imageIndex + '.png')">
                        <img :src="'https://s3.faser.app/postimages/' + author.id + '/' + postContent.postId + '/' + imageIndex + '.png'"
                            class="post-image" />

                        <!-- If there are more images, show a counter overlay on the 4th image -->
                        <div v-if="imageIndex === 4 && postContent.images > 4" class="more-images-overlay">
                            <span>+{{ postContent.images - 4 }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Spotify embed -->
            <iframe v-if="postContent.music" :src="'https://open.spotify.com/embed/track/' + postContent.music"
                class="spotify-embed" frameBorder="0" allowfullscreen=""
                allow="clipboard-write; encrypted-media;"></iframe>

            <!-- URL embeds -->
            <a v-if="embed.url || embed.image || embed.title || embed.description" :href="embed.url" target="_blank"
                class="url-embed">
                <div class="embed-container">
                    <img v-if="embed.image" :src="embed.image" class="embed-image" :class="{
                        'rounded-t-lg': embed.title || embed.description,
                        'rounded-lg': !(embed.title || embed.description)
                    }" />
                    <div v-if="embed.title || embed.description" class="embed-content" :class="{
                        'rounded-lg': !embed.image,
                        'rounded-b-lg': embed.image
                    }">
                        <p v-if="embed.title" class="embed-title">{{ embed.title }}</p>
                        <p v-if="embed.description" class="embed-description">{{ embed.description }}</p>
                    </div>
                </div>
            </a>
        </div>

        <!-- NSFW content warning -->
        <div v-else-if="postContent.nsfw" class="nsfw-warning"
            :style="{ backgroundColor: currentPalette.buttonDanger, color: currentPalette.textPrimary }">
            <div class="warning-icon">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div v-if="loggedIn" class="warning-text">
                This post is marked as NSFW. You have to be 18 years or older to view this post.
            </div>
            <div v-else class="warning-text">
                This post is marked as NSFW. You have to be logged in and 18 years or older to view this post.
            </div>
        </div>

        <!-- Post actions (like, comment, view stats) -->
        <div class="post-actions">
            <!-- Like button -->
            <div class="action-button" @click="toggleLike">
                <div class="action-icon">
                    <transition name="like">
                        <i v-if="isLiked" class="fa-solid fa-heart liked"></i>
                    </transition>
                    <i v-if="!isLiked" class="fa-regular fa-heart"></i>
                </div>
                <span class="action-count">{{ postLikes }}</span>
            </div>

            <!-- Comment button -->
            <RouterLink :to="'/post/' + postContent.postId" class="action-button">
                <div class="action-icon">
                    <i class="fa-regular fa-comment"></i>
                </div>
                <span class="action-count">{{ postComments }}</span>
            </RouterLink>

            <!-- Stats button -->
            <div class="action-button">
                <div class="action-icon">
                    <i class="fa-solid fa-chart-line"></i>
                </div>
                <span class="action-count">{{ impressions }}</span>
            </div>
        </div>

        <!-- Comment input -->
        <div v-if="loggedIn" class="comment-input">
            <input type="text" class="comment-field" :style="{ backgroundColor: currentPalette.buttonPrimary }"
                placeholder="Write a comment..." v-model="commentText" />

            <button v-if="!runningCommentRequest" class="comment-button"
                :style="{ backgroundColor: currentPalette.buttonDanger }" @click="postComment">
                Comment
            </button>

            <button v-else class="comment-button loading" :style="{ backgroundColor: currentPalette.buttonDanger }">
                <l-line-wobble size="80" stroke="5" bg-opacity="0.1" speed="1.75" color="white"></l-line-wobble>
            </button>
        </div>

        <!-- Modals -->
        <!-- Login Modal -->
        <transition name="fade">
            <div v-if="showLoginModal" @click.self="showLoginModal = false" class="modal-overlay">
                <div class="login-modal">
                    <div class="modal-close">
                        <i class="fa-solid fa-xmark" @click="showLoginModal = false"></i>
                    </div>
                    <LoginComponent />
                </div>
            </div>
        </transition>

        <!-- Delete Confirmation Modal -->
        <transition name="fade">
            <div v-if="showModal" @click.self="showModal = false" class="modal-overlay">
                <div class="delete-modal">
                    <div class="modal-icon">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                    <h2 class="modal-title">Delete Post?</h2>
                    <p class="modal-text">Do you really want to delete this post?</p>
                    <div class="modal-actions">
                        <button @click="showModal = false" class="cancel-button">Cancel</button>
                        <button @click="deletePost" class="confirm-button">Delete</button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Edit Modal -->
        <transition name="fade">
            <div v-if="showEditModal" @click.self="showEditModal = false" class="modal-overlay">
                <div class="edit-modal" :style="{ backgroundColor: currentPalette.bg }">
                    <div class="modal-icon">
                        <i class="fa-solid fa-pen"></i>
                    </div>
                    <h2 class="modal-title">Edit post</h2>
                    <p class="modal-subtitle">If you edit the post, an edited text will be added to the post</p>
                    <textarea class="edit-textarea" :style="{ backgroundColor: currentPalette.bgSecondary }"
                        v-model="postContent.content"></textarea>
                    <div class="modal-actions">
                        <button @click="showEditModal = false" class="cancel-button"
                            :style="{ backgroundColor: currentPalette.buttonSecondary }">Cancel</button>
                        <button @click="editPost" class="confirm-button"
                            :style="{ backgroundColor: currentPalette.buttonDanger }">Save</button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Image Modal -->
        <transition name="fade">
            <div v-if="showImageModal" @click.self="showImageModal = false" class="modal-overlay image-modal-overlay">
                <div class="image-modal" :class="{'transition-back': !isDragging}" @touchstart="handleTouchStart"
                    @touchmove="handleTouchMove" @touchend="handleTouchEnd"
                    :style="{ transform: `translateY(${translateY}px)` }">
                    <div class="image-carousel">
                        <div v-for="imageIndex in Number(postContent.images)" :key="imageIndex" class="carousel-item">
                            <img :src="'https://s3.faser.app/postimages/' + author.id + '/' + postContent.postId + '/' + imageIndex + '.png'"
                                class="full-image" @click.self="showImageModal = false" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Report Modal -->
        <transition name="fade">
            <div v-if="showReport" class="modal-overlay">
                <div class="report-modal" :style="{ backgroundColor: currentPalette.bg }">
                    <div class="modal-header">
                        <h1>Report Post</h1>
                        <i class="fa-solid fa-xmark" @click="showReport = false"></i>
                    </div>
                    <SupportFieldsComponent :predefinedSubject="'Post Report for ' + author.displayName"
                        :predefinedMessage="'I want to report this post because...\n\nPost ID: ' + postId" />
                    <p class="report-note">Please provide the Post ID for the Person you want to report.</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import axios from "axios";
import MarkdownIt from "markdown-it";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { useRouter, useRoute } from "vue-router";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import currentPalette from "~/vars/getColors";

const router = useRouter();
const route = useRoute();
const md = new MarkdownIt({
    html: false,
    linkify: false,
}).disable(["code", "table", "heading", "hr", "image"]);
const showImageModal = ref(false);
const threeDotElementOpen = ref(false)
const postContent = ref({})
const author = ref({})
const postValue = ref('')
const commentText = ref('')
const postCreatedAt = ref('')
const postVisible = ref(true);
const showLoginModal = ref(false)
const copied = ref(false);
const postType = ref('')
const parentPost = ref('')
const runningCommentRequest = ref(false);
const postLikes = ref(0);
const postComments = ref(0)
const isLiked = ref(false);
const hovered = ref(false);
const showModal = ref(false);
const showEditModal = ref(false);
const threeDotsMenu = ref(false);
const profile = ref({})
const impressions = ref(0)
const showPost = ref(false)
const isAdult = ref(false)
const showReport = ref(false)
const loggedIn = ref(Cookies.get("token") !== undefined)
const hideNSFW = ref(false)
const showTooltip = ref(false)
const localDateTime = ref("")
const savedPost = ref(false)
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const translateY = ref(0)
const embed = ref({
    url: "",
    title: "",
    description: "",
    image: "",
    type: "",
})
const runtimeConfig = useRuntimeConfig()


const props = defineProps({
    postId: String,
    ownProfile: Boolean,
    account: Object,
    ownProfileData: Object,
    admin: Boolean,
    border: Boolean,
    isCommunity: Boolean || false,
    communityId: String,
})

const isAuthor = ref(false)

if (localStorage.getItem("nsfw") === "true") {
    showPost.value = true
}
if (localStorage.getItem("hideNSFW") === "true") {
    hideNSFW.value = true
}

watch(() => postContent.value, (value) => {
    if (value.nsfw && hideNSFW.value) {
        postVisible.value = false
    }

    isAuthor.value = props.ownProfileData.id === value.authorId
})

let scrollpos = window.scrollY

watch(() => showImageModal.value, (value) => {
    if (value) {
        scrollpos = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = "-" + scrollpos + "px";
        document.body.classList.add("overflow-hidden")
    }
    else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.classList.remove("overflow-hidden")
        window.scrollTo(0, scrollpos);
    }
})

watch(() => showEditModal, (value) => {
    if (value) {
        scrollpos = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = "-" + scrollpos + "px";
        document.body.classList.add("overflow-hidden")
    }
    else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.classList.remove("overflow-hidden")
        window.scrollTo(0, scrollpos);
    }
})

const handleTouchStart = (event) => {
    isDragging.value = true;
    startY.value = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
    if (!isDragging.value) return;
    currentY.value = event.touches[0].clientY;
    if (currentY.value - startY.value > 0) {
        translateY.value = currentY.value - startY.value;
    }
};

const handleTouchEnd = () => {
    isDragging.value = false;

    if (translateY.value > 200) {
        showImageModal.value = false
    }
    translateY.value = 0;
};

watch(() => showModal.value, (value) => {
    if (value) {
        scrollpos = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = "-" + scrollpos + "px";
        document.body.classList.add("overflow-hidden")
    }
    else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.classList.remove("overflow-hidden")
        window.scrollTo(0, scrollpos);
    }
})

function postComment() {
    runningCommentRequest.value = true

    axios.post(baseURL + "/api/social/createPost", {
        token: Cookies.get("token"),
        message: commentText.value,
        lang: "en",
        type: 'comment',
        parentPost: postId.value,
        images: 0,
        community: postContent.value.postId.includes("cmt"),
    })
        .then(() => {
            if (router.currentRoute.value.path.startsWith("/post/")) {
                router.go(0)
            } else {
                router.push("/post/" + postId.value)
            }

            runningCommentRequest.value = false
        })
        .catch((error) => {
            runningCommentRequest.value = false

            if (error.response.status === 429) {
                alert("You are being rate limited")
            }
        })
}

function toggleNSFW() {
    if (isAdult.value) {
        showPost.value = !showPost.value
    }
}

function toggleSave() {
    if (savedPost.value) {
        unsavePost()
    } else {
        savePost()
    }
}

function savePost() {
    axios.post(baseURL + "/api/social/savePost", {
        postId: postId.value,
        token: Cookies.get("token"),
    })
        .then(() => {
            savedPost.value = true
        })
}

function unsavePost() {
    axios.post(baseURL + "/api/social/unsavePost", {
        postId: postId.value,
        token: Cookies.get("token"),
    })
        .then(() => {
            savedPost.value = false
        })
}

watch(() => props.account, (account) => {
    const today = new Date()
    const birthdate = new Date(account.birthday)

    let age = today.getFullYear() - birthdate.getFullYear();
    let m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    if (age >= 18) {
        isAdult.value = true
    }
})

onMounted(() => {
    author.value.displayName = profile.displayName
    author.value.verifiedAccount = profile.verifiedAccount
    author.value.businessAccount = profile.businessAccount

    const today = new Date()
    const birthdate = new Date(props.account.birthday)

    let age = today.getFullYear() - birthdate.getFullYear();
    let m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }

    if (age >= 18) {
        isAdult.value = true
    }

    if (props.ownProfileData.savedPosts) {
        if (props.ownProfileData.savedPosts.includes(postId.value)) {
            savedPost.value = true
        }
    }
})

function closeMenu() {
    threeDotElementOpen.value = false

    threeDotsMenu.value = false
}

axios.get(baseURL + "/api/profile/getPostProfile", {
    headers: {
        postId: props.postId,
        community: props.isCommunity,
    }
})
    .then((response) => {
        author.value = response.data[0]
        author.value.username = response.data[1].username
        author.value.hasProfilePicture = true
    })

function toggleLike() {
    if (!loggedIn.value) {
        showLoginModal.value = true
        return
    }

    if (!isAdult.value && postContent.value.nsfw) {
        return
    }

    isLiked.value = !isLiked.value

    if (isLiked.value) {
        postLikes.value++
    } else {
        postLikes.value--
    }

    axios.post(baseURL + "/api/social/toggleLike", {
        postId: postId.value,
        token: Cookies.get("token"),
        community: props.isCommunity
    })
        .then(() => {
        })
        .catch((error) => {
            if (error.response.data.message === "Account not found") {
                router.push("/login")
            }

            if (error.response.status === 429) {
                alert("You are being rate limited")

                isLiked.value = !isLiked.value

                if (isLiked.value) {
                    postLikes.value++
                } else {
                    postLikes.value--
                }
            }
        })
}

const postId = ref(props.postId)

const imageSrc = ref('')

function deletePost() {
    if (!props.admin) {
        axios.post(baseURL + "/api/social/deletePost", {
            postid: postId.value,
            token: Cookies.get("token"),
            community: props.isCommunity,
            communityId: props.communityId
        })
            .then(() => {
                postVisible.value = false
                showModal.value = false
            })
    } else {
        axios.post(baseURL + "/api/admin/deletePost", {
            postId: postId.value,
            token: Cookies.get("token"),
            community: props.isCommunity
        })
            .then(() => {
                postVisible.value = false
                showModal.value = false
            })
    }
}

function editPost() {
    axios.post(baseURL + "/api/social/editPost", {
        postId: postId.value,
        token: Cookies.get("token"),
        message: postContent.value.content,
        community: props.isCommunity
    })
        .then(() => {
            showEditModal.value = false
            reloadStats()
        })
}

function openreport() {
    openReport.value = true
}

function openImage(imageSrcValue) {
    showImageModal.value = true
    imageSrc.value = imageSrcValue
    translateY.value = 0
}

function formatTimeDifference(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    postValue.value = md.render(postContent.value.content)

    const words = postContent.value.content.split(" ").length

    for (let i = 0; i < words; i++) {
        if (postContent.value.content.split(" ")[i].includes("https://")) {
            postValue.value = postValue.value.replace(postContent.value.content.split(" ")[i], `<a style="text-decoration: underline;" class="underline text-blue-500" href="${postContent.value.content.split(" ")[i]}" target="_blank">${postContent.value.content.split(" ")[i]}</a>`)

            const url = postContent.value.content.split(" ")[i]

            loadEmbed(url)
        }

        if (postContent.value.content.split(" ")[i].includes("@")) {
            postValue.value = postValue.value.replace(postContent.value.content.split(" ")[i], `<a style="text-decoration: underline;" href="https://faser.app/${postContent.value.content.split(" ")[i].replace("@", "")}">${postContent.value.content.split(" ")[i]}</a>`)
        }
    }

    const units = [
        { name: "y", seconds: 60 * 60 * 24 * 365 },
        { name: "mo", seconds: 60 * 60 * 24 * 30 },
        { name: "w", seconds: 60 * 60 * 24 * 7 },
        { name: "d", seconds: 60 * 60 * 24 },
        { name: "h", seconds: 60 * 60 },
        { name: "m", seconds: 60 },
        { name: "s", seconds: 1 }
    ];

    for (const unit of units) {
        const diff = Math.floor(diffInSeconds / unit.seconds);
        if (diff >= 1) {
            return `${diff}${unit.name}`;
        }
    }
    return "just now";
}

function loadEmbed(url) {
    axios.post(baseURL + "/api/social/embed", {
        url: url
    })
        .then((response) => {
            embed.value = response.data
        })
}

function openDeleteModal() {
    showModal.value = true
    closeMenu()
}

function openEditModal() {
    showEditModal.value = true
    closeMenu()
}

function sharePost() {
    navigator.share({
        url: "https://faser.app/post/" + postId.value
    })
}

function reloadStats() {
    axios.get(baseURL + "/api/social/fetchPost", {
        headers: {
            postId: postId.value,
            community: props.isCommunity,
            token: Cookies.get("token")
        }
    })
        .then((response) => {

            postContent.value = response.data[0]
            postCreatedAt.value = formatTimeDifference(postContent.value.creationDate)

            isLiked.value = postContent.value.likes.includes(props.ownProfileData.id)

            postLikes.value = response.data[0].likes.length

            impressions.value = response.data[0].impressions.length

            postLikes.value = postContent.value.likes.length

            postComments.value = postContent.value.comments.length

            localDateTime.value = DateTime.fromMillis(postContent.value.creationDate).toLocaleString(DateTime.MED)

            postType.value = response.data[0].postType
            parentPost.value = response.data[0].parentPost
        })
        .catch((err) => {
            console.error(err)

            console.log(props)
        })
}

onMounted(() => {

    reloadStats()
})
</script>
<style scoped>
/* Post container */
.post-container {
    width: 100%;
    max-width: 90rem;
    padding: 16px;
    padding-bottom: 12px;
    border-radius: 0;
    transition: background-color 0.2s;
    margin-bottom: 1px;
}

.post-container:hover {
    background-color: rgba(255, 255, 255, 0.03);
}

/* Parent post reference */
.parent-post-link {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.reply-connector {
    height: 16px;
    width: 16px;
    border-top: 2px solid #4b5563;
    border-left: 2px solid #4b5563;
    border-top-left-radius: 8px;
    margin-left: 32px;
}

.parent-link {
    margin-left: 8px;
    color: #9ca3af;
    text-decoration: underline;
    font-size: 14px;
}

/* Post header with author info */
.post-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.author-info {
    display: flex;
    width: 100%;
}

.author-avatar {
    margin-right: 12px;
    flex-shrink: 0;
}

.author-avatar img {
    height: 48px;
    width: 48px;
    object-fit: cover;
}

.avatar-placeholder {
    height: 48px;
    width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgba(150, 150, 150, 0.15);
    background-color: rgba(17, 24, 39, 0.42);
}

.author-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.author-name-container {
    display: flex;
    align-items: center;
}

.author-name {
    font-weight: 700;
    color: white;
    text-decoration: none;
    font-size: 16px;
}

.author-name:hover {
    text-decoration: underline;
}

.verification-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1d9bf0;
    border: 1px solid #1a91da;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-left: 4px;
}

.verification-badge.business {
    background-color: #f59e0b;
    border: 1px solid #d97706;
}

.post-meta {
    display: flex;
    align-items: center;
    color: #9ca3af;
    font-size: 14px;
    line-height: 1;
    margin-top: 2px;
}

.username {
    color: #9ca3af;
    margin-right: 4px;
}

.separator {
    margin: 0 4px;
}

.timestamp {
    position: relative;
    cursor: default;
    color: #9ca3af;
}

.timestamp-tooltip {
    position: absolute;
    top: -30px;
    left: 0;
    background-color: #1f2937;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
}

.edited-flag,
.ai-flag {
    color: #9ca3af;
}

/* Post menu */
.post-menu {
    position: relative;
    z-index: 5;
}

.menu-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    border-radius: 50%;
    color: #9ca3af;
    transition: background-color 0.15s;
}

.menu-button:hover {
    background-color: rgba(107, 114, 128, 0.1);
    color: white;
}

.menu-items {
    position: absolute;
    right: 0;
    margin-top: 8px;
    width: 240px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(75, 85, 99, 0.4);
}

.menu-group {
    padding: 4px;
}

.menu-action-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    padding: 4px;
}

.action-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    color: #d1d5db;
    font-size: 14px;
    transition: background-color 0.15s;
}

.action-button:hover {
    background-color: rgba(107, 114, 128, 0.1);
}

.action-button i {
    font-size: 18px;
    margin-bottom: 6px;
}

.menu-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    color: #d1d5db;
    font-size: 14px;
    transition: background-color 0.15s;
}

.menu-item:hover {
    background-color: rgba(107, 114, 128, 0.1);
}

.menu-item i {
    margin-right: 12px;
    width: 16px;
    text-align: center;
}

/* NSFW tag */
.nsfw-tag {
    display: inline-flex;
    align-items: center;
    background-color: #ef4444;
    border-radius: 9999px;
    padding: 4px 8px;
    margin-bottom: 8px;
    font-size: 12px;
    cursor: pointer;
    gap: 4px;
}

.nsfw-tag:hover {
    background-color: #dc2626;
}

/* Post content */
.blur-content {
    filter: blur(8px);
    user-select: none;
    pointer-events: none;
}

.post-content {
    margin-bottom: 12px;
    word-break: break-word;
    white-space: pre-wrap;
    font-size: 15px;
    line-height: 1.5;
}

/* Image gallery */
.image-gallery {
    margin-bottom: 12px;
    border-radius: 16px;
    overflow: hidden;
}

.image-grid {
    display: grid;
    grid-gap: 2px;
    width: 100%;
}

.image-grid.single-image {
    grid-template-columns: 1fr;
    max-height: 500px;
}

.image-grid.two-images {
    grid-template-columns: 1fr 1fr;
    max-height: 280px;
}

.image-grid.three-images {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    max-height: 350px;
}

.image-grid.three-images .image-container:first-child {
    grid-row: span 2;
}

.image-grid.four-plus-images {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    max-height: 280px;
}

.image-container {
    position: relative;
    overflow: hidden;
    height: 100%;
    cursor: pointer;
}

.post-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.more-images-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(1px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 24px;
    font-weight: bold;
    transition: background-color 0.2s;
}

.more-images-overlay:hover {
    background-color: rgba(0, 0, 0, 0.65);
}

/* Spotify embed */
.spotify-embed {
    width: 100%;
    max-width: 384px;
    height: 80px;
    border-radius: 12px;
    margin-bottom: 12px;
}

/* URL embeds */
.url-embed {
    display: block;
    margin-bottom: 12px;
    text-decoration: none;
    color: inherit;
}

.embed-container {
    max-width: 384px;
    border: 1px solid rgba(75, 85, 99, 0.4);
    border-radius: 8px;
    overflow: hidden;
}

.embed-image {
    width: 100%;
    height: 192px;
    object-fit: cover;
}

.embed-content {
    padding: 12px;
    background-color: #2d3748;
}

.embed-title {
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 4px;
}

.embed-description {
    font-size: 14px;
    color: #9ca3af;
    line-height: 1.4;
}

/* NSFW warning */
.nsfw-warning {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 144px;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 16px;
    text-align: center;
}

.warning-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(239, 68, 68, 0.2);
    border: 1px solid #ef4444;
    margin-bottom: 12px;
    font-size: 20px;
}

.warning-text {
    font-size: 14px;
    line-height: 1.4;
}

/* Post actions */
.post-actions {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-top: 1px solid rgba(75, 85, 99, 0.2);
    border-bottom: 1px solid rgba(75, 85, 99, 0.2);
    margin: 8px 0;
}

.post-actions .action-button {
    display: flex;
    align-items: center;
    padding: 8px 0;
    color: #9ca3af;
    flex-direction: row;
    font-size: inherit;
}

.post-actions .action-button:hover {
    color: #d1d5db;
    background-color: transparent;
}

.post-actions .action-button:hover .fa-heart {
    color: #ef4444;
}

.post-actions .action-button:hover .fa-comment {
    color: #10b981;
}

.post-actions .action-button:hover .fa-chart-line {
    color: #3b82f6;
}

.action-icon {
    position: relative;
    margin-right: 4px;
    width: 18px;
    text-align: center;
}

.action-count {
    font-size: 14px;
}

.fa-heart.liked {
    color: #ef4444;
}

/* Comment input */
.comment-input {
    display: flex;
    gap: 8px;
    margin-top: 12px;
}

.comment-field {
    flex-grow: 1;
    padding: 8px 12px;
    border-radius: 20px;
    border: none;
    color: white;
    font-size: 14px;
}

.comment-field:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.5);
}

.comment-button {
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-weight: 600;
    color: white;
    font-size: 14px;
    cursor: pointer;
    min-width: 100px;
    transition: filter 0.15s;
}

.comment-button:hover {
    filter: brightness(1.1);
}

.comment-button.loading {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
}

.login-modal {
    background-color: #1f2937;
    padding: 20px;
    border-radius: 12px;
    width: 80%;
    max-width: 480px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    color: #9ca3af;
}

.delete-modal,
.edit-modal {
    background-color: #1f2937;
    padding: 24px;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    text-align: center;
}

.modal-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: rgba(239, 68, 68, 0.2);
    border: 1px solid #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    font-size: 20px;
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
}

.modal-subtitle {
    color: #9ca3af;
    margin-bottom: 16px;
    font-size: 14px;
}

.modal-text {
    margin-bottom: 24px;
    color: #d1d5db;
}

.modal-actions {
    display: flex;
    gap: 8px;
}

.cancel-button,
.confirm-button {
    padding: 10px;
    border-radius: 8px;
    border: none;
    flex-grow: 1;
    cursor: pointer;
    font-weight: 600;
    transition: filter 0.15s;
}

.cancel-button {
    background-color: #4b5563;
    color: white;
}

.confirm-button {
    background-color: #ef4444;
    color: white;
}

.cancel-button:hover,
.confirm-button:hover {
    filter: brightness(1.1);
}

.edit-textarea {
    width: 100%;
    height: 160px;
    padding: 12px;
    border-radius: 8px;
    border: none;
    margin-bottom: 16px;
    color: white;
    resize: none;
}

.edit-textarea:focus {
    outline: none;
}

.image-modal-overlay {
    background-color: rgba(0, 0, 0, 0.9);
}

.image-modal {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-carousel {
    display: flex;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    width: 100%;
    height: 100%;
}

.image-carousel::-webkit-scrollbar {
    display: none;
}

.carousel-item {
    flex: 0 0 100%;
    scroll-snap-align: start;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.full-image {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
}

.report-modal {
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    padding: 24px;
    border-radius: 12px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.modal-header h1 {
    font-size: 20px;
    font-weight: 700;
}

.modal-header i {
    cursor: pointer;
    font-size: 20px;
    color: #9ca3af;
}

.report-note {
    margin-top: 16px;
    color: #9ca3af;
    font-size: 14px;
}

/* Transitions */
.fade-enter-active {
    animation: fadeIn 0.2s ease-out;
}

.fade-leave-active {
    animation: fadeOut 0.2s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }

    to {
        opacity: 0;
        transform: translateY(8px);
    }
}

.like-enter-active {
    animation: likeIn 0.3s ease;
}

.like-leave-active {
    animation: likeOut 0.2s ease;
}

@keyframes likeIn {
    0% {
        opacity: 0;
        transform: scale(0.5);
    }

    70% {
        transform: scale(1.2);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes likeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

.transition-back {
    transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

@media (max-width: 640px) {
    .post-actions {
        padding-left: 8px;
        padding-right: 8px;
    }

    .author-avatar img,
    .avatar-placeholder {
        height: 40px;
        width: 40px;
    }

    .post-content {
        font-size: 14px;
    }

    .full-image {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
    }
}

@import url("~/assets/css/markdown.css");
</style>
