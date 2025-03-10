<template>
    <div class="text-white min-h-[calc(100vh-4.5rem)] px-4">
        <div class="flex items-center gap-2 text-2xl my-4">
            <div class="flex items-center h-8 justify-center">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            Search
        </div>
        <SearchUserComponent :page="true" />
    </div>
</template>