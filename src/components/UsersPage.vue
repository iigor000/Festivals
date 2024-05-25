<template>
    <div class="container">
        <h1 class="text-center my-5 display-1" style="font-weight: 400;">Svi Korisnici</h1>
        <div v-if="users">
            <div class="row justify-content-center justify-content-xl-between">
                <router-link v-for="(user, key) in users" :key="key" :to="{ name: 'user', params: { id: key } }"
                    class="display-2 rounded text-center p-3 border shadow mb-5 item text-decoration-none text-dark"
                    :style="{ width: '600px' }">
                    {{ user.ime }}
                    {{ user.prezime }}
                    <p class="fs-2 mt-4">
                       Korisnicko ime: {{ user.korisnickoIme }}
                    </p>
                    <p class="fs-2 mt-3 text-break">
                        Email: {{ user.email }}
                    </p>
                    <p class="fs-2 mt-3 text-break">
                        Telefon: {{ user.telefon }}
                    </p>
                    <p class="fs-2 mt-3 text-break">
                        Zanimanje: {{ user.zanimanje }}
                    </p>
                    <p class="fs-2 mt-3 text-break">
                        Adresa: {{ user.adresa }}
                    </p>
                    <p class="fs-2 mt-3 text-break">
                        Datum rodjenja: {{ user.datumRodjenja }}
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
                const currentUserKey = localStorage.getItem('userId');
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/korisnici.json');
                const data = await response.json();
                const filteredData = Object.entries(data).filter(([key]) => key !== currentUserKey);
                this.users = Object.fromEntries(filteredData);
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