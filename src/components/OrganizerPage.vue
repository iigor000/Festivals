<template>
  <div class="container">
    <div v-if="organizer">
      <div
        class="mb-3 position-relative d-flex align-items-center justify-content-center text-white text-center rounded text-decoration-none w-100 my-5"
        :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${organizer.logo})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '700px' }">
        <h1 class="display-1" style="font-weight: 400;">{{ organizer.naziv }}</h1>
      </div>
      <div class="row my-5">
        <div class="col-sm-6 text-center text-sm-start">
          <p class="fs-3"><i class="bi bi-telephone-fill"></i> {{ organizer.kontaktTelefon }}</p>
          <p class="fs-3"><i class="bi bi-geo-alt-fill"></i> {{ organizer.adresa }}</p>
        </div>
        <div class="col-sm-6 text-center text-sm-end">
          <p class="fs-3">Godina osnivanja: {{ organizer.godinaOsnivanja }}</p>
          <p class="fs-3">{{ organizer.email }} <i class="bi bi-envelope-fill"></i></p>
        </div>
      </div>
      <h3 class="text-center display-4" style="font-weight: 400;">Fesitvali</h3>
      <div class="d-flex flex-wrap justify-content-around">
        <router-link v-for="(festival, key) in festivalsData" :key="key"
          class="organizer mb-3 position-relative d-flex align-items-center justify-content-center text-white text-center rounded text-decoration-none"
          :to="{ name: 'festival', params: { id: key, festivalsId: organizer.festivali } }"
          :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${festival.slike[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '300px', height: '200px', transition: '0.3s' }">
          <div class="organizer-name fs-2" style="font-weight: 400;">{{ festival.naziv }}</div>
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
      organizer: null,
      festivalsData: null,
    };
  },
  async created() {
    this.organizer = await this.fetchOrganizer(this.$route.params.id);
  },
  methods: {
    async fetchOrganizer(id) {
      try {
        const response = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/' + id + '.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const organizer = await response.json();

        const response2 = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/' + organizer.festivali + '.json');
        if (!response2.ok) {
          throw new Error(`HTTP error! status: ${response2.status}`);
        }
        const festivals = await response2.json();
        this.festivalsData = festivals;

        return organizer;
      } catch (error) {
        localStorage.setItem('error', error.message);
        this.$router.push('/error');
      }
    },
  }
};
</script>