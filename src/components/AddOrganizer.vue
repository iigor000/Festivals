<template>
    <div class="container">
        <div>
            <h1 class="text-center my-5 display-1" style="font-weight: 400;">Dodajte organizatora
            </h1>
            <form @submit.prevent="validateOrganizer" class="text-center">
                <div class="mb-3 text-start">
                    <label for="name" class="form-label fs-4">Naziv</label>
                    <input type="text" class="form-control fs-4" id="name" v-model="organizer.naziv">
                </div>
                <div class="row">
                    <div class="col-sm-6 text-start">
                        <label for="email" class="form-label fs-4">Email</label>
                        <input type="email" class="form-control mb-3 fs-4" id="email" 
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
                        <img v-if="organizer.logo" :src="organizer.logo" class="image rounded" />
                        <div v-else :style="{height:'200px'}" class="rounded border"></div>
                        <div class="overlay rounded">
                            <i class="bi bi-plus-circle-fill icon text-white" :style="{ fontSize: '80px' }"></i>
                        </div>
                        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" />
                    </div>
                </div>
                <button type="submit" class="btn btn-primary center btn-lg me-3 mb-5">Sacuvaj podatke</button>
            </form>

            
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            organizer: {
                naziv: null,
                email: null,
                adresa: null,
                godinaOsnivanja: null,
                kontaktTelefon: null,
                logo: null,
                festivali: null,
            },
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
    methods: {
        uploadImage() {
            this.$refs.fileInput.click();
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

            if (/[a-zA-Z]/.test(this.organizer.kontaktTelefon)) {
                alert('Telefon ne sme sadržati slova');
                return;
            }
            const phoneNumber = this.organizer.kontaktTelefon.replace(/\D/g, '');
            if (phoneNumber.length < 9 || phoneNumber.length > 10) {
                alert('Telefon mora imati između 9 i 10 cifara i ne sme sadržati slova');
                return;
            }
            if (!this.organizer.logo) {
                window.alert('Molimo vas dodajte logo organizatora');
                return;
            }
            await this.submitOrganizer();
        },
        async submitOrganizer() {
            try {
                const url = 'https://veb-dizajn-8a4d7-default-rtdb.europe-west1.firebasedatabase.app/organizatoriFestivala/.json';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.organizer),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const key = data.name;
                this.$router.push({ name: 'organizerEdit', params: { id: key } });
                window.alert('Organizator je uspesno dodat');
            } catch (error) {
                localStorage.setItem('error', error.message);
                this.$router.push('/error');
            }
        },
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
    background-color: rgba(85, 85, 85, 0.068);
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