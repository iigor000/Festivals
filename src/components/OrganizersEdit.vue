<template>
    <div class="container">
        <h1 class="text-center my-5 display-1" style="font-weight: 400;">Organizatori festivala</h1>
        <div v-if="organizers" class="mb-5">
            <div class="mb-3 d-flex justify-content-end">
                <input type="text" class="form-control" placeholder="Pretrazi" v-model="search"
                    :style="{ width: '300px' }">
            </div>
            <div v-if="filteredOrganizers.length === 0" class="text-center display-3 my-5">
                <p>Nije pronadjen organizator :(</p>
            </div>
            <div v-else>
                <router-link v-for="(organizer, key) in filteredOrganizers" :key="key"
                    class="organizer mb-3 position-relative row align-items-center justify-content-center text-white text-center rounded text-decoration-none py-3"
                    :to="{ name: 'organizerEdit', params: { id: organizer.key } }"
                    :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${organizer.logo})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: '0.3s' }">
                    <div class="organizer-name display-3 mt-3 mb-5" style="font-weight: 400;">
                        <span v-for="(part, index) in highlightSearch(organizer.naziv)" :key="index"
                            :class="{ 'highlight': part.toLowerCase() === search.toLowerCase() }">{{ part }}</span>
                    </div>
                    <div class="organizer-info">
                        <div class="row">
                            <div class="col-md-6 fs-4">
                                <p>Email: {{ organizer.email }}</p>
                                <p>Adresa: {{ organizer.adresa }}</p>
                            </div>
                            <div class="col-md-6 fs-4">
                                <p>Godina osnivanja: {{ organizer.godinaOsnivanja }}</p>
                                <p>Telefon: {{ organizer.telefon }}</p>
                            </div>
                        </div>
                    </div>
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
            organizers: null,
            search: '',
        };
    },
    async created() {
        try {
            const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.organizers = Object.keys(data).map(key => {
                const height = Math.floor(Math.random() * 301) + 300;
                return { key, height, ...data[key] };
            });
            console.log(this.organizers); // Log the data after it's loaded
        } catch (error) {
            localStorage.setItem('error', error.message);
            this.$router.push('/error');
        }
    },
    computed: {
        filteredOrganizers() {
            if (!this.search) {
                return this.organizers;
            }
            return this.organizers.filter(organizer => organizer.naziv.toLowerCase().includes(this.search.toLowerCase()));
        },
        loggedIn() {
            return localStorage.getItem('userId') ? true : false;
        }
    },
    methods: {
        highlightSearch(text) {
            if (!this.search) {
                return [text];
            }
            const regex = new RegExp(`(${this.search})`, 'gi');
            return text.split(regex);
        },
    },
};
</script>

<style scoped>
.organizer:hover {
    filter: brightness(115%);
}

.highlight {
    background-color: rgba(255, 255, 0, 0.671);
}
</style>