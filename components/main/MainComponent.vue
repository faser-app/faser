<template>
  <div class="min-h-screen pl-2 bg-gray-950 text-white">
    <div class="flex justify-center items-center h-svh pt-5">
      <div>
        <h1
          class="text-5xl block text-transparent bg-gradient-to-tr from-[#24c7ce] to-[#1ed794] bg-clip-text font-extrabold"
        >
          Welcome to faser
        </h1>
        <p class="text-gray-500">coming soon</p>
      </div>
    </div>
  </div>
  <div class="blob bg-gradient-to-tr z-0 pointer-events-none from-[#24c7ce] to-[#1ed794]"></div>
</template>
<script setup>
onMounted(() => {
  document.addEventListener("mousemove", (e) => {
    const blob = document.querySelector(".blob");

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const targetX = e.clientX;
    const targetY = e.clientY;

    let blobX = parseFloat(getComputedStyle(blob).left) || 0;
    let blobY = parseFloat(getComputedStyle(blob).top) || 0;

    function animateBlob() {
      const speed = 0.1;

      blobX += (targetX - blobX - 250) * speed;
      blobY += (targetY - blobY - 200) * speed;

      blob.style.left = `${blobX}px`;
      blob.style.top = `${blobY}px`;

      requestAnimationFrame(animateBlob);
    }

    requestAnimationFrame(animateBlob);
  });

  document.addEventListener("mouseenter", (e) => {
    const blob = document.querySelector(".blob");
    blob.style.opacity = 1;
  });

  document.addEventListener("mouseleave", (e) => {
    const blob = document.querySelector(".blob");
    blob.style.opacity = 0;
  });
});
</script>

<style scoped>
.blob {
  position: fixed;
  top: 50rem;
  left: 30rem;
  width: 500px;
  opacity: 0;
  height: 400px;
  filter: blur(10rem);
  transition: opacity 250ms ease;
  animation: rotate 20s linear infinite;
  background-color: #24c7ce;
  border-radius: 100%;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
