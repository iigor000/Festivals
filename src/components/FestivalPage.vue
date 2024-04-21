<template>
    <div class="container">
        <div v-if="festival">
            <h1 class="text-center my-5 display-1" style="font-weight: 400;">{{ festival.naziv }}</h1>
            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button v-for="(image, index) in festival.slike" :key="index" type="button"
                        data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="index"
                        :class="{ 'active': index === 0 }" :aria-current="index === 0"
                        :aria-label="'Slide ' + (index + 1)"></button>
                </div>
                <div class="carousel-inner">
                    <div v-for="(image, index) in festival.slike" :key="index" class="carousel-item"
                        :class="{ 'active': index === 0 }">
                        <img :src="image" class="d-block w-100" alt="...">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            <h3 class="text-center my-3">{{ festival.opis }}</h3>
            <div class="row my-5 px-5">
                <div class="col-sm-6 text-center text-sm-start">
                    <p class="fs-3">Cena: {{ festival.cena }}</p>
                    <p class="fs-3">Kapacitet: {{ festival.maxOsoba }}</p>
                </div>
                <div class="col-sm-6 text-center text-sm-end">
                    <p class="fs-3">Prevoz: {{ festival.prevoz }}</p>
                    <p class="fs-3">Tip festivala: {{ festival.tip }}</p>
                </div>
            </div>
        </div>
        <div v-else class="display-1 my-5 text-center">Loading...</div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            festival: null,
            error: null,
        };
    },
    async created() {
        await this.fetchFestival(this.$route.params.id, this.$route.params.festivalsId);
    },
    methods: {
        async fetchFestival(id, festivalsId) {
            try {
                const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/' + festivalsId + '/' + id + '.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.festival = await response.json();
            } catch (error) {
                alert(error.message);
            }
        }
    }
};
</script>

<style scoped>
.carousel-item {
    height: 700px;
}

.carousel-item img {
    height: 100%;
    object-fit: cover;
}

</style>