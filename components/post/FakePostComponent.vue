<template>
    <div class="w-full max-w-[90rem] md:bg-gray-900 bg-black p-2 pb-4 text-white">
        <div class="flex items-center">
            <div class="flex items-center w-full">
                <div class="flex items-center">
                    <div>
                        <div
                            class="h-14 rounded-full w-14 m-2 flex border justify-center items-center border-[#96969627] bg-[#1118276c]">
                            <i class="fa-solid fa-user rounded-full text-2xl"></i>
                        </div>
                    </div>
                    <div class="h-5 w-32 mr-2 loading-animation rounded-lg"></div>
                </div>
                <div class="flex flex-wrap">
                    <div class="h-5 w-32 loading-animation rounded-lg"></div>
                </div>
            </div>
        </div>
        <div>
            <p class="ml-2">
            <div class="h-28 w-full loading-animation rounded-lg"></div>
            </p>
        </div>


        <div class="flex w-full mt-2 items-center justify-center">
            <div class="flex justify-center gap-2 w-1/3 cursor-pointer items-center text-gray-300">

                <i class="fa-regular absolute text-xl fa-heart transition-colors duration-150"></i>
                <p class="ml-16">
                <div class="h-5 w-5 loading-animation rounded-lg"></div>
                </p>
            </div>
            <div class="flex gap-2 w-1/3 justify-center cursor-pointer items-center text-gray-300">
                <div class="flex no-underline gap-2 items-center justify-center">
                    <i class="fa-regular fa-comment text-xl"></i>
                    <p>
                    <div class="h-5 w-5 loading-animation rounded-lg"></div>
                    </p>
                </div>
            </div>
            <div class="w-1/3 flex gap-2 justify-center items-center text-gray-300">
                <i class="fa-solid fa-chart-line"></i>
                <p>
                <div class="h-5 w-5 loading-animation rounded-lg"></div>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loading-animation {
    background: linear-gradient(90deg, #263238, #37474f, #263238);
    background-size: 200% 100%;
    animation: loading 5s linear infinite;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}
</style>