<template>
    <div class="container">
        <div v-if="festivals" class="mb-5">
            <h1 class="text-center my-5 display-1" style="font-weight: 400;">Festivali</h1>
            <div class="mb-3 d-flex justify-content-between">
                <input type="text" class="form-control" placeholder="Pretrazi" v-model="search"
                    :style="{ width: '300px' }">
                <select ref="dropdown" class="form-select ms-2" v-model="filter" style="width: 200px;">
                    <option value="" selected disabled>Tip festivala</option>
                    <option value="">Svi</option>
                    <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
                </select>
            </div>
            <div v-if="filteredFestivals.length === 0" class="text-center display-3 my-5">
                <p>Nije pronadjen festival :(</p>
            </div>
            <div v-else class="masonry">
                <router-link v-for="(festival, key) in filteredFestivals" :key="key"
                    class="festival masonry-item hover-shadow mb-3 position-relative d-flex align-items-center justify-content-center text-white text-center rounded text-decoration-none"
                    :to="{ name: 'festival', params: { id: festival.id, festivalsId: festival.organizerId } }"
                    :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${festival.slike[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', height: festival.height + 'px', transition: '0.3s' }">
                    <div class="display-3" style="font-weight: 400;">
                        <span v-for="(part, index) in highlightSearch(festival.naziv)" :key="index"
                            :class="{ 'highlight': part.toLowerCase() === search.toLowerCase() }">{{ part }}</span>
                    </div>
                    <div class="position-absolute bottom-0 start-0 m-2">
                        <p class="fs-5">Tip: {{ festival.tip }}</p>
                    </div>
                </router-link>
            </div>
        </div>
        <div v-else class="display-1 my-5 text-center">Loading...</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            festivals: null,
            search: '',
            filter: '',
            types: ['Muzički', 'Umetnički', 'Filmski', 'Edukativni', 'Gastronomski'],
            showDropdown: false,
        };
    },
    computed: {
        filteredFestivals() {
            return this.festivals
                .filter(festival => {
                    return (!this.search || festival.naziv.toLowerCase().includes(this.search.toLowerCase())) &&
                        (!this.filter || festival.tip === this.filter);
                });
        },
    },
    async created() {
        try {
            const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/festivali.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const festivalsJson = await response.json();
            const festivals = [];
            for (const key in festivalsJson) {
                for (const festivalKey in festivalsJson[key]) {
                    festivalsJson[key][festivalKey].id = festivalKey;
                    festivalsJson[key][festivalKey].organizerId = key;
                    festivals.push(festivalsJson[key][festivalKey]);
                }
            }
            this.festivals = festivals.map(festival => {
                const height = Math.floor(Math.random() * 301) + 350;
                return { height, ...festival };
            });
        } catch (error) {
            localStorage.setItem('error', error.message);
                this.$router.push('/error');
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
    openDropdown() {
        this.$refs.dropdown.style.display = 'block';
        this.$refs.dropdown.focus();
    },
};
</script>

<style scoped>
.festival:hover {
    filter: brightness(115%);
    box-shadow: 50px;
}

.masonry {
    column-count: 1;
    column-gap: 1em;
}

.masonry-item {
    background-color: #eee;
    margin-bottom: 1em;
    break-inside: avoid;
}

@media (min-width: 800px) {
    .masonry {
        column-count: 2;
    }
}

@media (min-width: 1400px) {
    .masonry {
        column-count: 3;
    }
}

.highlight {
    background-color: rgba(255, 255, 0, 0.705);
}
</style>