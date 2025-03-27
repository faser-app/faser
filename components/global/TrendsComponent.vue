<template>
    <div class="trends-container h-screen overflow-y-auto px-4 py-4 text-white"
        :style="{ backgroundColor: currentPalette.bgSecondary }">
        
        <!-- Enhanced Search bar -->
        <div class="search-wrapper mb-6">
            <div class="search-container relative">
                <div class="search-input-wrapper relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                    <input 
                        type="text" 
                        placeholder="Search for users"
                        v-model="searchQuery"
                        @input="searchUsers"
                        @focus="searchFocused = true"
                        @blur="handleBlur"
                        class="w-full py-3 pl-12 pr-4 rounded-full text-white focus:outline-none transition-all duration-200 border border-transparent focus:border-gray-700"
                        :style="{ backgroundColor: currentPalette.bg }" 
                    />
                    <i 
                        v-if="searchQuery.length > 0" 
                        @click="clearSearch"
                        class="fa-solid fa-times-circle absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
                    ></i>
                </div>
                
                <!-- Search results dropdown -->
                <div 
                    v-if="searchQuery.length > 0 && searchFocused && searchResults.length > 0" 
                    class="search-results absolute w-full mt-2 rounded-lg border border-gray-700 shadow-lg overflow-hidden z-50"
                    :style="{ backgroundColor: currentPalette.bg }"
                >
                    <div 
                        v-for="user in searchResults" 
                        :key="user.username" 
                        class="search-result-item p-3 hover:bg-gray-800 cursor-pointer"
                        :class="{'border-b border-gray-700': searchResults.indexOf(user) !== searchResults.length - 1}"
                        @click="navigateToUser(user.username)"
                    >
                        <div class="flex items-center">
                            <div class="profile-image-container h-10 w-10 rounded-full overflow-hidden mr-3">
                                <img 
                                    v-if="user.hasProfilePicture" 
                                    :src="'https://s3.faser.app/profilepictures/' + user.id + '/image.png'" 
                                    class="h-full w-full object-cover"
                                    @error="user.hasProfilePicture = false"
                                />
                                <div 
                                    v-else 
                                    class="h-full w-full flex items-center justify-center border border-[#96969627] bg-[#1118276c]"
                                >
                                    <i class="fa-solid fa-user text-white"></i>
                                </div>
                            </div>
                            <div class="user-info flex-grow">
                                <div class="flex items-center">
                                    <p class="font-semibold text-white">{{ user.displayName }}</p>
                                    <div v-if="user.businessAccount" class="ml-1">
                                        <div class="verified-badge bg-yellow-600 border-yellow-300">
                                            <i class="fa-solid fa-check text-[10px]"></i>
                                        </div>
                                    </div>
                                    <div v-else-if="user.verifiedAccount" class="ml-1">
                                        <div class="verified-badge bg-sky-600 border-sky-300">
                                            <i class="fa-solid fa-check text-[10px]"></i>
                                        </div>
                                    </div>
                                    <div v-if="user.privateAccount" class="ml-1">
                                        <i class="fa-solid fa-lock text-gray-400 text-sm"></i>
                                    </div>
                                </div>
                                <p class="text-gray-500 text-sm">@{{ user.username }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div 
                    v-else-if="searchQuery.length > 0 && searchFocused && searchResults.length === 0 && searchLoaded" 
                    class="search-results absolute w-full mt-2 rounded-lg border border-gray-700 shadow-lg overflow-hidden z-50 p-4 text-center"
                    :style="{ backgroundColor: currentPalette.bg }"
                >
                    <p class="text-gray-400">No users found</p>
                </div>
            </div>
        </div>

        <!-- Who to follow section -->
        <div class="follow-section rounded-lg overflow-hidden" :style="{ backgroundColor: currentPalette.bg }">
            <h2 class="text-xl font-bold p-4">Who to follow</h2>
            <div v-for="(suggestion, index) in followSuggestions" :key="index"
                class="suggestion-item p-4 hover:bg-gray-800 cursor-pointer flex items-center">
                <div class="flex-shrink-0">
                    <div class="h-12 w-12 rounded-full overflow-hidden" :style="{ 
            backgroundColor: suggestion.hasProfilePicture ? 'transparent' : '#1118276c',
            border: suggestion.hasProfilePicture ? 'none' : '1px solid rgba(150, 150, 150, 0.15)'
          }">
                        <img v-if="suggestion.hasProfilePicture"
                            :src="'https://s3.faser.app/profilepictures/' + suggestion.id + '/image.png'"
                            class="h-full w-full object-cover" />
                        <div v-else class="h-full w-full flex items-center justify-center">
                            <i class="fa-solid fa-user text-white"></i>
                        </div>
                    </div>
                </div>
                <div class="mx-3 flex-grow">
                    <div class="flex items-center">
                        <p class="font-bold">{{ suggestion.displayName }}</p>
                        <div v-if="suggestion.verifiedAccount" class="verified-badge ml-1">
                            <i class="fa-solid fa-check text-[10px]"></i>
                        </div>
                    </div>
                    <p class="text-gray-500">@{{ suggestion.username }}</p>
                </div>
                <button class="follow-button px-4 py-1.5 rounded-full font-bold"
                    :style="{ backgroundColor: currentPalette.buttonPrimary, color: currentPalette.textSecondary }">
                    Follow
                </button>
            </div>
            <div class="p-4 hover:bg-gray-800 cursor-pointer">
                <p class="text-primary-500">Show more</p>
            </div>
        </div>
        
        <!-- Footer links -->
        <div class="footer-links my-4 text-sm text-gray-500">
            <div class="flex flex-wrap gap-2">
                <a href="#" class="hover:underline">Terms of Service</a>
                <a href="#" class="hover:underline">Privacy Policy</a>
                <a href="#" class="hover:underline">Cookie Policy</a>
                <a href="#" class="hover:underline">Accessibility</a>
                <a href="#" class="hover:underline">More</a>
            </div>
            <div class="mt-2">
                © 2025 faser, Inc.
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import currentPalette from "~/vars/getColors";

const router = useRouter();
const searchQuery = ref("");
const searchResults = ref([]);
const searchLoaded = ref(false);
const searchFocused = ref(false);
const searchTimeoutId = ref(null);
const clickOutsideHandler = ref(null);

// Search functionality
function searchUsers() {
    searchLoaded.value = false;
    
    // Clear any existing timeout
    if (searchTimeoutId.value) {
        clearTimeout(searchTimeoutId.value);
    }
    
    // If query is empty, clear results
    if (!searchQuery.value) {
        searchResults.value = [];
        return;
    }
    
    // Add debounce to prevent excessive API calls
    searchTimeoutId.value = setTimeout(() => {
        const url = baseURL + "/api/profile/searchProfiles";
        
        axios.post(url, {
            query: searchQuery.value,
            lang: navigator.language || navigator.userLanguage,
        })
        .then((response) => {
            let userData = response.data;
            
            // Process profile picture data
            for (let i = 0; i < userData.length; i++) {
                userData[i].hasProfilePicture = userData[i].hasProfilePicture === 1;
            }
            
            // Sort results based on match priority
            searchResults.value = sortByLetterPriority(userData, searchQuery.value.toLowerCase());
            searchLoaded.value = true;
        })
        .catch((error) => {
            console.error("Error searching users:", error);
            searchLoaded.value = true;
        });
    }, 300); // 300ms delay
}

function sortByLetterPriority(arr, query) {
    return arr.sort((a, b) => {
        // Higher priority for username matches
        const aStartsWithUsername = a.username.toLowerCase().startsWith(query);
        const bStartsWithUsername = b.username.toLowerCase().startsWith(query);
        
        // Also consider display name matches
        const aStartsWithDisplay = a.displayName.toLowerCase().startsWith(query);
        const bStartsWithDisplay = b.displayName.toLowerCase().startsWith(query);
        
        if (aStartsWithUsername && !bStartsWithUsername) return -1;
        if (!aStartsWithUsername && bStartsWithUsername) return 1;
        
        if (aStartsWithDisplay && !bStartsWithDisplay) return -1;
        if (!aStartsWithDisplay && bStartsWithDisplay) return 1;
        
        return a.username.localeCompare(b.username);
    });
}

function clearSearch() {
    searchQuery.value = "";
    searchResults.value = [];
    searchFocused.value = false;
}

function navigateToUser(username) {
    router.push(`/${username}`);
    clearSearch();
}

function handleBlur(event) {
    // Use setTimeout to allow click events on search results to fire first
    setTimeout(() => {
        searchFocused.value = false;
    }, 200);
}

// Handle clicks outside search results to close dropdown
function handleClickOutside(event) {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(event.target)) {
        searchFocused.value = false;
    }
}

// Mock data for follow suggestions
const followSuggestions = ref([
    {
        id: '123456',
        username: 'techguru',
        displayName: 'Tech Guru',
        hasProfilePicture: false,
        verifiedAccount: true
    },
    {
        id: '789012',
        username: 'newsupdate',
        displayName: 'News Update',
        hasProfilePicture: false,
        verifiedAccount: true
    },
    {
        id: '345678',
        username: 'creativeminds',
        displayName: 'Creative Minds',
        hasProfilePicture: false,
        verifiedAccount: false
    }
]);

onMounted(() => {
    // Add click outside listener
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    // Clean up event listener
    document.removeEventListener('click', handleClickOutside);
    
    // Clear any pending timeouts
    if (searchTimeoutId.value) {
        clearTimeout(searchTimeoutId.value);
    }
});
</script>

<style scoped>
.trends-container {
    width: 350px;
    position: fixed;
    right: 0;
    top: 0;
    border-left: 1px solid rgba(47, 51, 54, 0.8);
}

.verified-badge {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border-width: 1px;
}

.search-container {
    position: relative;
    z-index: 50;
}

.search-input-wrapper input {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.search-input-wrapper input:focus {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.search-results {
    max-height: 300px;
    overflow-y: auto;
}

/* Hide right sidebar on smaller screens */
@media (max-width: 1024px) {
    .trends-container {
        display: none;
    }
}
</style>