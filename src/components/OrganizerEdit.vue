<template>
    <div class="container">
        <div v-if="organizer">
            <h1 class="text-center my-5 display-1" style="font-weight: 400;">Promenite podatke za {{ name }}
            </h1>
            <form @submit.prevent="validateOrganizer" class="text-center">
                <div class="mb-3 text-start">
                    <label for="name" class="form-label fs-4">Naziv</label>
                    <input type="text" class="form-control fs-4" id="name" v-model="organizer.naziv">
                </div>
                <div class="row">
                    <div class="col-sm-6 text-start">
                        <label for="email" class="form-label fs-4">Email</label>
                        <input type="email" class="form-control mb-3 fs-4" id="email" @input="validateEmail"
                            v-model="organizer.email">
                        <label for="adress" class="form-label fs-4">Adresa</label>
                        <input type="text" class="form-control fs-4" id="adress" v-model="organizer.adresa">
                    </div>
                    <div class="col-sm-6 text-start">
                        <label for="year" class="form-label fs-4">Godina Osnivanja</label>
                        <input type="number" class="form-control mb-3 fs-4" id="year"
                            v-model="organizer.godinaOsnivanja">
                        <label for="telephone" class="form-label fs-4">Telefon</label>
                        <input type="phone" class="form-control fs-4" id="telephone" v-model="organizer.kontaktTelefon">
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <div class="my-5 image-container" @click="uploadImage">
                        <img :src="organizer.logo" class="image rounded" />
                        <div class="overlay">
                            <i class="bi bi-plus-circle-fill icon text-white" :style="{ fontSize: '80px' }"></i>
                        </div>
                        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" />
                    </div>
                </div>
                <button type="submit" class="btn btn-primary center btn-lg me-3">Sacuvaj podatke</button>
                <button type="button" class="btn btn-danger center btn-lg me-3" @click="deleteOrg = true">Obrišite
                    organizatora</button>
            </form>

            <h3 class="text-center display-4" style="font-weight: 400;">Fesitvali</h3>
            <div class="d-flex flex-wrap justify-content-around mb-5">
                <div v-for="(festival, key) in festivalsData" :key="key"
                    class="mb-3 position-relative d-flex align-items-center justify-content-center text-white text-center rounded text-decoration-none"
                    :style="{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${festival.slike[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '300px', height: '200px', transition: '0.3s' }">
                    <button class="btn btn-danger position-absolute top-0 start-0 m-2"
                        @click="deleteFestivalModal(key)"><i class="icon bi bi-trash-fill"></i></button>
                    <div class="fs-2" style="font-weight: 400;">{{ festival.naziv }}</div>
                </div>
                <div @click="addFes = true"
                    class="rounded border d-flex justify-content-center align-items-center add-festival"
                    :style="{ width: '300px', height: '200px' }">
                    <i class="icon bi bi-plus-circle"
                        :style="{ fontSize: '60px', color: 'rgb(134, 134, 134)', transition: '1s' }"></i>
                </div>
            </div>
        </div>
        <div v-else class="display-1 my-5 text-center">Loading...</div>
    </div>

    <BModal v-model="deleteOrg" title="Obrisite organizatora">
        <div class="modal-body">Da li ste sigurni da zelite da obriste organizatora</div>
        <template #footer>
            <button class="btn btn-secondary" @click="deleteOrg = false">Odustani</button>
            <button class="btn btn-danger" @click="deleteOrganizer">Obrisi</button>
        </template>
    </BModal>
    <BModal v-model="deleteFes" title="Obrisite festival">
        <div class="modal-body">Da li ste sigurni da zelite da obriste festival</div>
        <template #footer>
            <button class="btn btn-secondary" @click="deleteFes = false">Odustani</button>
            <button class="btn btn-danger" @click="deleteFestival()">Obrisi</button>
        </template>
    </BModal>
    <BModal v-model="addFes" title="Dodajte festival">
        <div class="modal-body">
            <form @submit.prevent="validateForm" ref="form">
                <label for="name" class="form-label fs-4">Naziv</label>
                <input type="text" class="form-control fs-4 mb-2" id="name" v-model="festival.naziv">
                <label for="price" class="form-label fs-4">Cena (din)</label>
                <input type="number" class="form-control fs-4 mb-2" id="price" v-model="festival.cena">
                <label for="max" class="form-label fs-4">Maksimalan broj osoba</label>
                <input type="number" class="form-control fs-4 mb-2" id="max" v-model="festival.maxOsoba">
                <label for="transport" class="form-label fs-4">Prevoz</label>
                <select id="transport" class="form-control fs-4 mb-2" v-model="festival.prevoz">
                    <option value="Autobus">Autobus</option>
                    <option value="Avion">Avion</option>
                    <option value="Sopstveni prevoz">Sopstveni prevoz</option>
                </select>
                <label for="type" class="form-label fs-4">Tip festivala</label>
                <select id="type" class="form-control fs-4 mb-2" v-model="festival.tip">
                    <option value="Muzički">Muzički</option>
                    <option value="Umetnički">Umetnički</option>
                    <option value="Filmski">Filmski</option>
                    <option value="Gastronomski">Gastronomski</option>
                    <option value="Edukativni">Edukativni</option>
                </select>
                <label for="desc" class="form-label fs-4">Opis</label>
                <textarea type="text" class="form-control fs-4 mb-2" id="desc" v-model="festival.opis"
                    :style="{ height: '200px' }">
            </textarea>
            </form>
            <label for="pictures" class="form-label fs-4 me-3">Slike</label>
            <input type="file" id="pictures" v-on:change="handleFilesUpload($event)" multiple hidden ref="addPics">
            <button type="button" class="btn btn-primary" @click="$refs.addPics.click()">Dodaj slike</button>
            <div class="row">
                <div v-for="(slika, index) in festival.slike" :key="index"
                    class="col-4 d-flex flex-column align-items-center">
                    <img :src="slika" alt="Preview" class="img-thumbnail m-2"
                        :style="{ width: '150px', height: '100px', objectFit: 'cover' }">
                    <button type="button" class="btn btn-danger btn-sm" @click="removePicture(index)">Obrisi</button>
                </div>
            </div>
        </div>
        <template #footer>
            <button class="btn btn-secondary" @click="addFes = false">Odustani</button>
            <button type="button" class="btn btn-primary" @click="validateFestival">Dodaj</button>
        </template>
    </BModal>
</template>

<script>
import { BModal } from 'bootstrap-vue-3';

export default {
    components: {
        BModal,
    },
    data() {
        return {
            organizer: null,
            festivalsData: null,
            name: null,
            deleteOrg: false,
            deleteFestivalId: null,
            deleteFes: false,
            addFes: false,
            festival: {
                naziv: null,
                cena: null,
                maxOsoba: null,
                prevoz: 'Autobus',
                tip: 'Muzički',
                opis: null,
                slike: [],
            }
        };
    },
    async created() {
        this.organizer = await this.fetchOrganizer(this.$route.params.id);
    },
    methods: {
        async addFestival() {
            try {
                const url = `https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/` + this.organizer.festivali + '.json';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.festival),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.alert('Festival je uspešno dodat');
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
            this.addFes = false;
        },
        removePicture(index) {
            this.festival.slike.splice(index, 1);
        },
        async validateFestival() {
            if (!this.festival.naziv || !this.festival.cena || !this.festival.maxOsoba || !this.festival.opis || !this.festival.slike.length) {
                window.alert('Molimo vas popunite sva polja');
                return;
            }
            await this.addFestival();
        },
        handleFilesUpload(event) {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    this.festival.slike.push(e.target.result);
                };
                reader.readAsDataURL(files[i]);
            }
        },
        deleteFestivalModal(id) {
            this.deleteFestivalId = id;
            this.deleteFes = true;
        },
        async deleteFestival() {
            try {
                const url = `https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/` + this.organizer.festivali + '/' + this.deleteFestivalId + '.json';
                const response = await fetch(url, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const fesResponse = await fetch('https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/' + this.organizer.festivali + '.json');
                if (!fesResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const festivals = await fesResponse.json();
                this.festivalsData = festivals;
                this.deleteFes = false;
                window.alert('Festival je uspešno obrisan');
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        },
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
                this.name = organizer.naziv;

                return organizer;
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        },
        uploadImage() {
            this.$refs.fileInput.click();
        },
        validateEmail(event) {
            const input = event.target;
            if (!input.validity.valid) {
                if (input.validity.typeMismatch) {
                    input.setCustomValidity('Molimo vas unesite validan email');
                }
            } else {
                input.setCustomValidity('');
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.organizer.logo = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        async validateOrganizer() {
            if (!this.organizer.naziv || !this.organizer.email || !this.organizer.adresa || !this.organizer.godinaOsnivanja || !this.organizer.kontaktTelefon) {
                window.alert('Molimo vas popunite sva polja');
                return;
            }
            const phoneNumber = this.organizer.kontaktTelefon.replace(/\D/g, '');
            if(phoneNumber.length < 9 || phoneNumber.length > 10) {
                    alert('Telefon mora imati izmedju 9 i 10 cifara');
                    return;
                }
            await this.submitOrganizer();
        },
        async submitOrganizer() {
            try {
                const url = `https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/` + this.$route.params.id + '.json';
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.organizer),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.alert('Podaci su uspešno promenjeni');
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        },
        async deleteOrganizer() {
            try {
                const url = `https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/` + this.$route.params.id + '.json';
                const festivalsUrl = `https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/` + this.organizer.festivali + '.json';
                const response = await fetch(url, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const fesResponse = await fetch(festivalsUrl, {
                    method: 'DELETE',
                });
                if (!fesResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                window.alert('Organizator je uspešno obrisan');
                this.$router.push('/');
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        }
    },
};
</script>

<style scoped>
.image-container {
    position: relative;
    width: 70%;
    cursor: pointer;
}

.image {
    display: block;
    width: 100%;
    height: auto;
    transition: .5s ease;
}

.overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    transition: .5s ease;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-container:hover .overlay {
    background-color: rgba(255, 255, 255, 0);
}

.add-festival {
    transition: filter 0.2s ease-in-out;
    border-color: rgb(134, 134, 134) !important;
}

.add-festival:hover {
    filter: brightness(75%);
    cursor: pointer;
}
</style>