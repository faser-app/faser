<template>
  <div
    class="bg-[#1118276c] h-[4.5rem] fixed backdrop-blur text-white w-full flex"
  >
    <div
      class="flex h-full w-full justify-center md:justify-start fixed pointer-events-none"
    >
      <img
        src="~/assets/img/icon/logo.png"
        alt="Logo"
        class="h-14 ml-2 my-2 rounded-full cursor-pointer border border-[#96969627] bg-[#1118276c] absolute pointer-events-auto"
      />
    </div>
    <div @click="expanded = !expanded">
      <div
        class="flex h-full w-14 justify-center items-center cursor-pointer md:hidden"
      >
        <i class="fa-solid fa-bars text-2xl"></i>
      </div>
    </div>
    <div class="flex h-full top-10 self-center justify-end flex-1 w-full mr-4">
      <div
        class="hidden opacity-0 self-center sm:opacity-100 gap-5 mr-5 md:flex"
      >
        <div v-for="link in links" :key="link.name" class="cursor-pointer">
          <RouterLink :to="link.href" class="text-white hover:scale">{{
            link.name
          }}</RouterLink>
        </div>
      </div>
      <div class="h-full flex items-center">
        <div
          class="border w-12 h-12 flex items-center justify-center rounded-full border-[#96969627] bg-[#1118276c] cursor-pointer"
        >
          <i class="fa-solid fa-user rounded-full text-3xl"></i>
        </div>
      </div>
    </div>
    <div class="fixed backdrop-blur top-[4.5rem] bg-[#1118276c] w-full md:hidden">
      <div :class="{ 'expandable-content': true, expanded: expanded }">
        <div
          v-for="link in links"
          :key="link.name"
          class="cursor-pointer hover:bg-[#212d45] flex w-full"
        >
          <RouterLink :to="link.href" class="text-white w-full my-2 ml-3">
            {{ link.name }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const expanded = ref(false);

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Home",
    href: "/",
  },
];
</script>

<style scoped>
.expandable-content {
  transition: max-height 0.5s ease;
  overflow: hidden;
  max-height: 0;
}

.expandable-content.expanded {
  max-height: 280px;
}
</style>
