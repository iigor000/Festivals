<template>
    <div class="container">
        <h1 class="display-1 text-center my-5">Doslo je do greske</h1>
        <p class="display-3 text-danger text-center">{{ errorMessage }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            errorMessage: localStorage.getItem('error') || 'An error occurred',
        };
    },
    created() {
        localStorage.removeItem('error');
    },
};
</script>
