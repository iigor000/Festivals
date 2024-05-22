<template>
    <div class="container">
        <h1 class="text-center my-5 display-1" style="font-weight: 400;">Svi Korisnici</h1>
        <div v-if="users">
            <div class="row justify-content-center justify-content-md-between">
                <router-link v-for="(user, key) in users" :key="key"
                    :to="{ name: 'user', params: { id: key } }"
                    class="display-2 rounded text-center p-3 border shadow mb-5 item text-decoration-none text-dark"
                    :style="{ width: '300px', height: '300px' }">
                    {{ user.korisnickoIme }}
                    <p class="fs-2 mt-4">
                        {{ user.ime }}
                        {{ user.prezime }}
                    </p>
                    <p class="fs-2 mt-3 text-break">
                        {{ user.email }}
                    </p>
                </router-link>
            </div>
        </div>
        <div v-else class="fs-1 text-center">Loading...</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            users: []
        };
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici.json');
                const data = await response.json();
                this.users = data;
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        }
    }
};
</script>

<style scoped>
.item {
    cursor: pointer;
    background-color: #ededed;
    transition: 0.3s;
}

.item:hover {
    background-color: #f3f3f3;
}
</style>