<template>
  <div class="compact-create-post" :class="{ 'expanded': isExpanded }" :style="{ backgroundColor: currentPalette.bgSecondary }">
    <div class="post-container">
      <!-- User Avatar -->
      <div class="user-avatar">
        <img v-if="haveProfilePicture && loaded" @error="haveProfilePicture = false"
          :src="'https://s3.faser.app/profilepictures/' + id + '/image.png' + '?t=' + new Date().getTime()"
          class="h-10 w-10 rounded-full object-cover" alt="Profile" />
        <div v-else class="h-10 w-10 rounded-full flex items-center justify-center border border-[#96969627] bg-[#1118276c]">
          <i class="fa-solid fa-user text-white"></i>
        </div>
      </div>

      <!-- Post Input Area -->
      <div class="post-input-area" :class="{ 'expanded': isExpanded }">
        <div class="input-wrapper" @click="expandInput">
          <textarea 
            ref="postTextarea"
            class="post-textarea" 
            :class="{ 'expanded': isExpanded }"
            :style="{ backgroundColor: currentPalette.bg }"
            v-model="postContent" 
            placeholder="What's happening?"
            @focus="expandInput"
            @blur="checkForCollapse"
            @input="checkContentLength"
          ></textarea>
        </div>

        <!-- Image & Media Options (Only visible when expanded) -->
        <div v-if="isExpanded" class="media-options">
          <div class="selected-media">
            <div v-if="selectedTrack">
              <div class="remove-track" @click="selectedTrack = null">
                <i class="fa-solid fa-xmark"></i>
              </div>
              <iframe 
                :src="'https://open.spotify.com/embed/track/' + selectedTrack.songId"
                class="spotify-embed" 
                frameBorder="0"
                allowfullscreen="" 
                allow="clipboard-write; encrypted-media;"
              ></iframe>
            </div>

            <div class="image-previews">
              <template v-for="(image, index) in images" :key="index">
                <div class="image-preview" :style="{ backgroundColor: currentPalette.buttonSecondary }">
                  <div class="remove-image" @click="images.splice(index, 1)">
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                  <img :src="getPreviewImage(image)" class="preview-img" />
                </div>
              </template>
            </div>
          </div>

          <div class="action-buttons">
            <div class="option-button" :style="{ backgroundColor: currentPalette.buttonSecondary }" @click="selectFile">
              <i class="fa-solid fa-image"></i>
            </div>
            <div class="option-button" :style="{ backgroundColor: currentPalette.buttonSecondary }" @click="searchSong = !searchSong">
              <i class="fa-solid fa-music"></i>
            </div>
            
            <div v-if="isAdult" class="option-toggle">
              <label class="switch-label">
                <input type="checkbox" v-model="nsfw">
                <span class="toggle-slider" :style="{ backgroundColor: nsfw ? currentPalette.buttonPrimary : currentPalette.buttonSecondary }"></span>
                <span class="toggle-text">NSFW</span>
              </label>
            </div>
            
            <div class="option-toggle">
              <label class="switch-label">
                <input type="checkbox" v-model="ai">
                <span class="toggle-slider" :style="{ backgroundColor: ai ? currentPalette.buttonPrimary : currentPalette.buttonSecondary }"></span>
                <span class="toggle-text">AI</span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="isExpanded" class="post-actions">
          <div class="char-count" :class="{ 'warning': postContent.length > 250, 'error': postContent.length > 290 }">
            {{ postContent.length }}/300
          </div>
          <button 
            class="post-button"
            :disabled="postContent.length === 0 || postContent.length > 300 || loading"
            :style="{ 
              backgroundColor: currentPalette.buttonPrimary, 
              opacity: (postContent.length === 0 || postContent.length > 300) ? '0.6' : '1' 
            }"
            @click="uploadPost"
          >
            <span v-if="!loading">Post</span>
            <div v-else class="loading-indicator"></div>
          </button>
        </div>
      </div>
    </div>
  </div>

  <PostSelectSongComponent 
    :show-modal="searchSong" 
    @close="searchSong = false" 
    class="z-50"
    @selectSong="selectSong" 
  />
</template>

<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import currentPalette from '~/vars/getColors';

const router = useRouter();
const isExpanded = ref(false);
const postContent = ref('');
const images = ref([]);
const error = ref('');
const loading = ref(false);
const searchSong = ref(false);
const selectedTrack = ref(null);
const nsfw = ref(false);
const isAdult = ref(false);
const ai = ref(false);
const id = ref(0);
const loaded = ref(false);
const haveProfilePicture = ref(true);
const postTextarea = ref(null);

const props = defineProps({
  ownProfile: Object
});

const emit = defineEmits(['post-created']);

function getPreviewImage(file) {
  return URL.createObjectURL(file);
}

function expandInput() {
  isExpanded.value = true;
}

function checkForCollapse(event) {
  // Only collapse if clicking outside and post content is empty
  if (postContent.value.trim() === '' && images.value.length === 0 && !selectedTrack.value) {
    // Small delay to allow other click events to process first
    setTimeout(() => {
      if (!document.activeElement.classList.contains('post-textarea')) {
        isExpanded.value = false;
      }
    }, 200);
  }
}

function checkContentLength() {
  // Optional: Add any validation logic here
}

function selectFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.click();
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (file.size / 1024 / 1024 >= 10) {
      error.value = "Image is too large. Max size is 10MB.";
      return;
    }
    
    if (images.value.length >= 10) {
      error.value = "You can only upload 10 images.";
      return;
    }
    
    if (file.type.split('/')[0] !== 'image') {
      error.value = "File is not an image.";
      return;
    }
    
    error.value = "";
    images.value.push(file);
  };
}

function selectSong(song) {
  selectedTrack.value = song;
  searchSong.value = false;
}

function uploadPost() {
  loading.value = true;
  
  axios.post(baseURL + "/api/social/createPost", {
    token: Cookies.get("token"),
    message: postContent.value,
    lang: "en",
    type: 'post',
    music: selectedTrack.value ? selectedTrack.value.songId : null,
    images: images.value.length,
    nsfw: nsfw.value,
    ai: ai.value
  })
  .then(response => {
    if (images.value.length === 0) {
      router.go(0);
      loading.value = false;
      resetForm();
    } else {
      for (let i = 0; i < images.value.length; i++) {
        const formData = new FormData();
        formData.append('file', images.value[i]);
        
        axios.post(baseURL + "/api/social/uploadImage", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'token': Cookies.get('token'),
            'postId': response.data.postId,
            'lang': 'en',
            'imageId': (i + 1)
          }
        })
        .then(() => {
          if (i === images.value.length - 1) {
            router.go(0);
            loading.value = false;
            resetForm();
          }
        })
        .catch(err => {
          error.value = err.response?.data?.message || "Error uploading image";
          loading.value = false;
        });
      }
    }
    emit('post-created');
  })
  .catch(err => {
    error.value = err.response?.data?.message || "Error creating post";
    loading.value = false;
  });
}

function resetForm() {
  postContent.value = '';
  images.value = [];
  selectedTrack.value = null;
  nsfw.value = false;
  ai.value = false;
  isExpanded.value = false;
}

onMounted(() => {
  // Check if user is an adult for NSFW toggle
  try {
    if (props.ownProfile) {
      id.value = props.ownProfile.id;
      
      const today = new Date();
      const birthDate = new Date(props.ownProfile.birthday);
      
      if (!isNaN(birthDate.getTime())) {
        const age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
          isAdult.value = age - 1 >= 18;
        } else {
          isAdult.value = age >= 18;
        }
      }
      
      loaded.value = true;
    }
  } catch (e) {
    console.error("Error checking adult status:", e);
  }
  
  // Handle paste events for images
  document.addEventListener('paste', (event) => {
    if (!isExpanded.value) return;
    
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    
    for (let index in items) {
      const item = items[index];
      
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        if (blob && blob.type.startsWith('image/')) {
          images.value.push(blob);
          event.preventDefault();
        }
      }
    }
  });
});
</script>

<style scoped>
.compact-create-post {
  width: 100%;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-container {
  display: flex;
  gap: 12px;
}

.user-avatar {
  flex-shrink: 0;
  height: 40px;
  width: 40px;
}

.post-input-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease;
}

.input-wrapper {
  width: 100%;
}

.post-textarea {
  width: 100%;
  border-radius: 20px;
  padding: 10px 16px;
  color: white;
  resize: none;
  min-height: 40px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.post-textarea:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.2);
}

.post-textarea.expanded {
  min-height: 100px;
}

.media-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-media {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.remove-track {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  margin: 4px;
}

.spotify-embed {
  width: 100%;
  height: 80px;
  border-radius: 12px;
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.image-preview {
  position: relative;
  border-radius: 12px;
  padding: 4px;
  width: 80px;
  height: 80px;
}

.remove-image {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  top: -5px;
  right: -5px;
  z-index: 10;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.option-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-button:hover {
  filter: brightness(1.2);
}

.option-toggle {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.switch-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.switch-label input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  border-radius: 34px;
  transition: 0.4s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

input:checked + .toggle-slider:before {
  transform: translateX(16px);
}

.toggle-text {
  font-size: 14px;
  color: #aaa;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.char-count {
  font-size: 14px;
  color: #aaa;
}

.char-count.warning {
  color: orange;
}

.char-count.error {
  color: #ff4d4d;
}

.post-button {
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.post-button:disabled {
  cursor: not-allowed;
}

.post-button:hover:not(:disabled) {
  filter: brightness(1.1);
}

.loading-indicator {
  width: 20px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent 0%, white 50%, transparent 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>